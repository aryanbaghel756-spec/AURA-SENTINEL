import sqlite3
import os
import json
import time
import hashlib
import secrets
from pathlib import Path
from typing import List, Dict, Any, Optional

DB_DIR = Path(__file__).parent.resolve()
DB_PATH = DB_DIR / "aura_sentinel.db"
SCHEMA_PATH = DB_DIR / "schema.sql"

def _hash_password(password: str, salt: str) -> str:
    """Computes salted SHA-256 password hash."""
    return hashlib.sha256((password + salt).encode("utf-8")).hexdigest()

class DatabaseManager:
    """Enterprise SQLite Database Manager for AURA SENTINEL with WAL mode and user authentication."""

    def __init__(self, db_path: Optional[str] = None):
        self.db_path = Path(db_path) if db_path else DB_PATH
        self.init_db()

    def get_connection(self) -> sqlite3.Connection:
        """Returns a connection configured with WAL journal mode and row dict factory."""
        conn = sqlite3.connect(str(self.db_path), check_same_thread=False, timeout=10.0)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA journal_mode = WAL;")
        conn.execute("PRAGMA synchronous = NORMAL;")
        return conn

    def init_db(self):
        """Initializes tables from schema.sql and seeds initial baseline events and admin operator if needed."""
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        if SCHEMA_PATH.exists():
            with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
                schema_sql = f.read()
            with self.get_connection() as conn:
                conn.executescript(schema_sql)
                conn.commit()

        # Seed baseline events and default operator if fresh database
        self._seed_baseline_if_empty()

    def _seed_baseline_if_empty(self):
        """Seeds initial system events and default admin operator if the database is newly initialized."""
        with self.get_connection() as conn:
            # Seed events
            cursor = conn.execute("SELECT COUNT(*) as count FROM security_events")
            if cursor.fetchone()["count"] == 0:
                now = time.time()
                initial_events = [
                    ("SYSTEM", "INFO", "FastAPI Core Gateway Initialized", "Telemetry bridge active on localhost:8000", "KERNEL_TELEMETRY", None, now - 600),
                    ("SHIELD", "NOMINAL", "AURA Autonomous Sentinel Armed", "Zero-trust monitoring and IPTABLES packet inspection active", "AURA_CORE", None, now - 480),
                    ("AUTH", "INFO", "Biometric Subsystem Calibrated", "face-api.js 68-point neural landmark model loaded", "BIOMETRIC_CORE", None, now - 360),
                    ("IDS", "NOMINAL", "Initial Perimeter Scan Complete", "All open ports cataloged and cross-referenced with policy", "ATTACK_SURFACE", None, now - 180),
                    ("PROCESS", "INFO", "Hardware Watchdog Engaged", "Continuous psutil telemetry monitoring active processes", "PROCESS_WATCHDOG", None, now - 60),
                ]
                conn.executemany(
                    """
                    INSERT INTO security_events 
                    (event_type, severity, title, description, source, ip_address, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """,
                    initial_events
                )
                conn.commit()

            # Seed default admin user if users table is empty
            user_cursor = conn.execute("SELECT COUNT(*) as count FROM users")
            if user_cursor.fetchone()["count"] == 0:
                salt = secrets.token_hex(16)
                p_hash = _hash_password("aura2026", salt)
                now = time.time()
                conn.execute(
                    """
                    INSERT INTO users 
                    (username, full_name, password_hash, password_salt, role, created_at)
                    VALUES (?, ?, ?, ?, ?, ?)
                    """,
                    ("admin", "AURA Chief Operator", p_hash, salt, "Level 1 - Chief Security Operator", now)
                )
                conn.commit()

    # ==========================================
    # USER AUTHENTICATION & OPERATOR PROFILES
    # ==========================================

    def create_user(
        self,
        username: str,
        full_name: str,
        password: str,
        role: str = "Level 1 - SOC Operator",
        face_descriptor: Optional[List[float]] = None,
    ) -> Dict[str, Any]:
        """Creates a new operator with salted SHA-256 password hash."""
        clean_user = username.strip().lower()
        salt = secrets.token_hex(16)
        p_hash = _hash_password(password, salt)
        now = time.time()
        face_json = json.dumps(face_descriptor) if face_descriptor else None

        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO users 
                (username, full_name, password_hash, password_salt, role, face_descriptor_json, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (clean_user, full_name.strip(), p_hash, salt, role, face_json, now)
            )
            user_id = cursor.lastrowid
            conn.commit()

        # Audit event
        self.log_event(
            event_type="AUTH",
            severity="INFO",
            title=f"Operator Registered: {clean_user}",
            description=f"Assigned clearance role: {role}",
            source="USER_MANAGEMENT",
        )

        return {
            "id": user_id,
            "username": clean_user,
            "full_name": full_name.strip(),
            "role": role,
            "has_biometrics": face_descriptor is not None,
            "created_at": now,
        }

    def verify_user(self, username: str, password: str) -> Optional[Dict[str, Any]]:
        """Verifies username and password. Returns sanitized user profile on success."""
        clean_user = username.strip().lower()
        now = time.time()

        with self.get_connection() as conn:
            cursor = conn.execute("SELECT * FROM users WHERE username = ? AND is_active = 1", (clean_user,))
            row = cursor.fetchone()
            if not row:
                return None

            expected_hash = _hash_password(password, row["password_salt"])
            if secrets.compare_digest(row["password_hash"], expected_hash):
                # Update last login
                conn.execute("UPDATE users SET last_login_at = ? WHERE id = ?", (now, row["id"]))
                conn.commit()

                # Audit login
                self.log_event(
                    event_type="AUTH",
                    severity="NOMINAL",
                    title=f"Operator Logged In: {clean_user}",
                    description=f"Clearance authenticated: {row['role']}",
                    source="OPERATOR_AUTH",
                )

                return {
                    "id": row["id"],
                    "username": row["username"],
                    "full_name": row["full_name"],
                    "role": row["role"],
                    "has_biometrics": row["face_descriptor_json"] is not None,
                    "last_login_at": now,
                    "created_at": row["created_at"],
                }
            return None

    def get_user_by_username(self, username: str) -> Optional[Dict[str, Any]]:
        """Retrieves a user profile by username without password hashes."""
        clean_user = username.strip().lower()
        with self.get_connection() as conn:
            cursor = conn.execute(
                "SELECT id, username, full_name, role, face_descriptor_json, created_at, last_login_at FROM users WHERE username = ?",
                (clean_user,)
            )
            row = cursor.fetchone()
            if not row:
                return None
            return {
                "id": row["id"],
                "username": row["username"],
                "full_name": row["full_name"],
                "role": row["role"],
                "has_biometrics": row["face_descriptor_json"] is not None,
                "created_at": row["created_at"],
                "last_login_at": row["last_login_at"],
            }

    def save_user_face_descriptor(self, username: str, descriptor: List[float]) -> bool:
        """Links facial biometric embedding vector (128-float array) to a registered operator."""
        clean_user = username.strip().lower()
        face_json = json.dumps(descriptor)
        with self.get_connection() as conn:
            cursor = conn.execute(
                "UPDATE users SET face_descriptor_json = ? WHERE username = ?",
                (face_json, clean_user)
            )
            conn.commit()
            success = cursor.rowcount > 0

        if success:
            self.log_event(
                event_type="AUTH",
                severity="INFO",
                title=f"Biometrics Enrolled: {clean_user}",
                description="Neural 128-float facial embeddings securely linked to profile.",
                source="BIOMETRIC_CORE",
            )
        return success

    def get_users_with_biometrics(self) -> List[Dict[str, Any]]:
        """Returns list of operators who have registered facial biometrics for recognition matching."""
        with self.get_connection() as conn:
            cursor = conn.execute(
                "SELECT id, username, full_name, role, face_descriptor_json FROM users WHERE face_descriptor_json IS NOT NULL AND is_active = 1"
            )
            rows = cursor.fetchall()
            results = []
            for r in rows:
                try:
                    desc = json.loads(r["face_descriptor_json"]) if r["face_descriptor_json"] else None
                except Exception:
                    desc = None
                if desc:
                    results.append({
                        "id": r["id"],
                        "username": r["username"],
                        "full_name": r["full_name"],
                        "role": r["role"],
                        "descriptor": desc,
                    })
            return results

    def list_users(self) -> List[Dict[str, Any]]:
        """Lists all registered operators."""
        with self.get_connection() as conn:
            cursor = conn.execute(
                "SELECT id, username, full_name, role, is_active, face_descriptor_json, created_at, last_login_at FROM users ORDER BY created_at ASC"
            )
            rows = cursor.fetchall()
            return [
                {
                    "id": r["id"],
                    "username": r["username"],
                    "full_name": r["full_name"],
                    "role": r["role"],
                    "has_biometrics": r["face_descriptor_json"] is not None,
                    "created_at": r["created_at"],
                    "last_login_at": r["last_login_at"],
                }
                for r in rows
            ]

    # ==========================================
    # SECURITY EVENTS
    # ==========================================

    def log_event(
        self,
        event_type: str,
        severity: str,
        title: str,
        description: str = "",
        source: str = "AURA_CORE",
        ip_address: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
    ) -> int:
        """Logs a persistent security event to SQLite."""
        now = time.time()
        meta_json = json.dumps(metadata or {})
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO security_events 
                (event_type, severity, title, description, source, ip_address, metadata_json, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (event_type, severity.upper(), title, description, source, ip_address, meta_json, now)
            )
            conn.commit()
            return cursor.lastrowid # type: ignore

    def get_recent_events(
        self,
        limit: int = 50,
        severity: Optional[str] = None,
        event_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Retrieves recent security events sorted chronologically descending."""
        query = "SELECT * FROM security_events WHERE 1=1"
        params = []

        if severity and severity.upper() != "ALL":
            query += " AND severity = ?"
            params.append(severity.upper())

        if event_type and event_type.upper() != "ALL":
            query += " AND event_type = ?"
            params.append(event_type.upper())

        query += " ORDER BY created_at DESC LIMIT ?"
        params.append(limit)

        with self.get_connection() as conn:
            cursor = conn.execute(query, params)
            rows = cursor.fetchall()
            return [dict(row) for row in rows]

    # ==========================================
    # SYSTEM METRICS TIME-SERIES
    # ==========================================

    def log_metrics(
        self,
        cpu_percent: float,
        memory_percent: float,
        disk_percent: float,
        open_ports: int,
        risk_score: float
    ) -> int:
        """Records a timestamped system telemetry snapshot."""
        now = time.time()
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO system_metrics
                (cpu_percent, memory_percent, disk_percent, open_ports, risk_score, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (cpu_percent, memory_percent, disk_percent, open_ports, risk_score, now)
            )
            conn.commit()
            return cursor.lastrowid  # type: ignore

    def get_metrics_history(self, limit: int = 60) -> List[Dict[str, Any]]:
        """Retrieves historical metric snapshots ordered oldest to newest for graphing."""
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                SELECT * FROM (
                    SELECT * FROM system_metrics ORDER BY created_at DESC LIMIT ?
                ) ORDER BY created_at ASC
                """,
                (limit,)
            )
            return [dict(r) for r in cursor.fetchall()]

    # ==========================================
    # QUARANTINE VAULT
    # ==========================================

    def record_quarantine(
        self,
        quarantine_name: str,
        original_path: str,
        file_size: int,
        category: str,
        file_hash: Optional[str] = None
    ):
        """Records or updates a file quarantine entry."""
        now = time.time()
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO quarantine_records
                (quarantine_name, original_path, file_hash, file_size, category, status, quarantined_at, updated_at)
                VALUES (?, ?, ?, ?, ?, 'QUARANTINED', ?, ?)
                ON CONFLICT(quarantine_name) DO UPDATE SET
                    status='QUARANTINED',
                    updated_at=excluded.updated_at
                """,
                (quarantine_name, original_path, file_hash, file_size, category, now, now)
            )
            conn.commit()

    def update_quarantine_status(self, quarantine_name: str, new_status: str):
        """Updates the status of a quarantined file ('RESTORED', 'DELETED')."""
        now = time.time()
        with self.get_connection() as conn:
            conn.execute(
                """
                UPDATE quarantine_records 
                SET status = ?, updated_at = ? 
                WHERE quarantine_name = ?
                """,
                (new_status, now, quarantine_name)
            )
            conn.commit()

    def get_quarantine_records(self) -> List[Dict[str, Any]]:
        """Returns all quarantine vault records."""
        with self.get_connection() as conn:
            cursor = conn.execute("SELECT * FROM quarantine_records ORDER BY quarantined_at DESC")
            return [dict(r) for r in cursor.fetchall()]

    # ==========================================
    # MITIGATION ACTIONS AUDIT
    # ==========================================

    def record_mitigation(
        self,
        action_type: str,
        target: str,
        details: str = "",
        operator: str = "AURA_AUTONOMOUS",
        status: str = "SUCCESS"
    ) -> int:
        """Records an active defense countermeasure action."""
        now = time.time()
        with self.get_connection() as conn:
            cursor = conn.execute(
                """
                INSERT INTO mitigation_actions
                (action_type, target, details, operator, status, created_at)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (action_type, target, details, operator, status, now)
            )
            conn.commit()
            return cursor.lastrowid # type: ignore

    def get_mitigation_history(self, limit: int = 30) -> List[Dict[str, Any]]:
        """Returns recent mitigation actions."""
        with self.get_connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM mitigation_actions ORDER BY created_at DESC LIMIT ?",
                (limit,)
            )
            return [dict(r) for r in cursor.fetchall()]

    # ==========================================
    # THREAT ACTORS
    # ==========================================

    def upsert_threat_actor(
        self,
        ip_address: str,
        threat_score: int = 50,
        status: str = "OBSERVED",
        notes: str = ""
    ):
        """Records or increments threat actor profile."""
        now = time.time()
        with self.get_connection() as conn:
            conn.execute(
                """
                INSERT INTO threat_actors
                (ip_address, threat_score, status, first_seen, last_seen, hit_count, notes)
                VALUES (?, ?, ?, ?, ?, 1, ?)
                ON CONFLICT(ip_address) DO UPDATE SET
                    threat_score = MAX(threat_actors.threat_score, excluded.threat_score),
                    status = excluded.status,
                    last_seen = excluded.last_seen,
                    hit_count = threat_actors.hit_count + 1,
                    notes = CASE WHEN excluded.notes != '' THEN excluded.notes ELSE threat_actors.notes END
                """,
                (ip_address, threat_score, status, now, now, notes)
            )
            conn.commit()

    def get_threat_actors(self, limit: int = 20) -> List[Dict[str, Any]]:
        """Returns tracked threat actor profiles."""
        with self.get_connection() as conn:
            cursor = conn.execute(
                "SELECT * FROM threat_actors ORDER BY last_seen DESC LIMIT ?",
                (limit,)
            )
            return [dict(r) for r in cursor.fetchall()]

    # ==========================================
    # DATABASE METRICS & STATS
    # ==========================================

    def get_database_stats(self) -> Dict[str, Any]:
        """Returns storage statistics and record counts for AURA Sentinel."""
        db_size_bytes = self.db_path.stat().st_size if self.db_path.exists() else 0
        with self.get_connection() as conn:
            events_cnt = conn.execute("SELECT COUNT(*) FROM security_events").fetchone()[0]
            metrics_cnt = conn.execute("SELECT COUNT(*) FROM system_metrics").fetchone()[0]
            quarantine_cnt = conn.execute("SELECT COUNT(*) FROM quarantine_records").fetchone()[0]
            mitigations_cnt = conn.execute("SELECT COUNT(*) FROM mitigation_actions").fetchone()[0]
            actors_cnt = conn.execute("SELECT COUNT(*) FROM threat_actors").fetchone()[0]
            users_cnt = conn.execute("SELECT COUNT(*) FROM users").fetchone()[0]

        return {
            "status": "ONLINE",
            "engine": "SQLite 3 (WAL Mode)",
            "db_path": str(self.db_path),
            "db_size_kb": round(db_size_bytes / 1024, 2),
            "counts": {
                "security_events": events_cnt,
                "system_metrics": metrics_cnt,
                "quarantine_records": quarantine_cnt,
                "mitigation_actions": mitigations_cnt,
                "threat_actors": actors_cnt,
                "operators": users_cnt,
            }
        }

# Global database manager singleton
db = DatabaseManager()
