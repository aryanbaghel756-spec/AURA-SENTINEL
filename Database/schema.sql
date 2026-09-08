-- ==========================================================
-- AURA SENTINEL - ENTERPRISE CYBER DEFENSE DATABASE SCHEMA
-- Target Engine: SQLite 3 with WAL (Write-Ahead Logging)
-- SIH 2026 Reference: SIH26105
-- ==========================================================

PRAGMA foreign_keys = ON;

-- 1. SECURITY AUDIT & THREAT EVENTS LOG
CREATE TABLE IF NOT EXISTS security_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,          -- 'AUTH', 'IDS', 'SYSTEM', 'PROCESS', 'SHIELD', 'ANOMALY', 'ATTACK_SIM'
    severity TEXT NOT NULL,            -- 'NOMINAL', 'INFO', 'WARNING', 'HIGH', 'CRITICAL'
    title TEXT NOT NULL,
    description TEXT,
    source TEXT NOT NULL,              -- 'AURA_CORE', 'YOLO_VISION', 'NETWORK_SCANNER', 'KERNEL_TELEMETRY', 'USER_ACTION'
    ip_address TEXT,
    metadata_json TEXT DEFAULT '{}',
    created_at REAL NOT NULL           -- Epoch float timestamp
);

CREATE INDEX IF NOT EXISTS idx_events_created ON security_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_severity ON security_events(severity);
CREATE INDEX IF NOT EXISTS idx_events_type ON security_events(event_type);

-- 2. SYSTEM TELEMETRY & RISK TIME-SERIES
CREATE TABLE IF NOT EXISTS system_metrics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cpu_percent REAL NOT NULL,
    memory_percent REAL NOT NULL,
    disk_percent REAL NOT NULL,
    open_ports INTEGER NOT NULL,
    risk_score REAL NOT NULL,
    created_at REAL NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_metrics_created ON system_metrics(created_at DESC);

-- 3. QUARANTINE VAULT AUDIT
CREATE TABLE IF NOT EXISTS quarantine_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    quarantine_name TEXT UNIQUE NOT NULL,
    original_path TEXT NOT NULL,
    file_hash TEXT,
    file_size INTEGER NOT NULL,
    category TEXT NOT NULL,            -- 'SENSITIVE', 'JUNK', 'DUPLICATE', 'SUSPICIOUS'
    status TEXT DEFAULT 'QUARANTINED', -- 'QUARANTINED', 'RESTORED', 'DELETED'
    quarantined_at REAL NOT NULL,
    updated_at REAL NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_quarantine_status ON quarantine_records(status);

-- 4. MITIGATION & COUNTERMEASURE ACTIONS
CREATE TABLE IF NOT EXISTS mitigation_actions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    action_type TEXT NOT NULL,         -- 'KILL_PROCESS', 'BLOCK_IP', 'QUARANTINE_FILE', 'FIREWALL_DROP'
    target TEXT NOT NULL,
    details TEXT,
    operator TEXT DEFAULT 'AURA_AUTONOMOUS',
    status TEXT DEFAULT 'SUCCESS',
    created_at REAL NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_mitigation_created ON mitigation_actions(created_at DESC);

-- 5. THREAT ACTORS & RECON PROFILES
CREATE TABLE IF NOT EXISTS threat_actors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT UNIQUE NOT NULL,
    threat_score INTEGER DEFAULT 0,
    status TEXT DEFAULT 'OBSERVED',    -- 'OBSERVED', 'PROBING', 'ATTACKING', 'BLOCKED'
    first_seen REAL NOT NULL,
    last_seen REAL NOT NULL,
    hit_count INTEGER DEFAULT 1,
    notes TEXT DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_threat_actors_ip ON threat_actors(ip_address);
CREATE INDEX IF NOT EXISTS idx_threat_actors_status ON threat_actors(status);

-- 6. OPERATORS & USER PROFILES
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    password_salt TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'Level 1 - SOC Operator',  -- Level 1, Level 2, Level 3
    face_descriptor_json TEXT DEFAULT NULL,               -- 128-float facial embeddings vector
    avatar_url TEXT DEFAULT NULL,
    is_active INTEGER DEFAULT 1,
    created_at REAL NOT NULL,
    last_login_at REAL
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
