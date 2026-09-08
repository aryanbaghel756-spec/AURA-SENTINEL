from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import psutil
from pydantic import BaseModel
from typing import Literal
import os
import shutil
import hashlib
import time
from pathlib import Path
from typing import List, Literal, Optional
import json
import sys

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from Database import db
from Ai_Engine import (
    risk_scorer,
    FinancialExposureEngine,
    SystemAnomalyDetector,
    ThreatDetector,
    CentroidTracker,
    ThreatActorTracker,
)

system_anomaly_detector = SystemAnomalyDetector(window_size=30)
threat_detector = ThreatDetector()
vision_tracker = CentroidTracker(max_disappeared=25, max_distance=90.0)
threat_actor_tracker = ThreatActorTracker()

from send2trash import send2trash
from dotenv import load_dotenv
from groq import Groq
import cv2
from ultralytics import YOLO
from fastapi.responses import StreamingResponse

yolo_model = YOLO("yolov8n.pt")

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)
load_dotenv()

groq_key = os.environ.get("GROQ_API_KEY")
groq_client = Groq(api_key=groq_key) if groq_key else None

import platform

BACKEND_START_TIME = time.time()

app = FastAPI(title="AURA SENTINEL API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def home():
    return{
        "status": "Online",
        "system": "AURA SENTINEL BACKEND"
    }

@app.get("/api/system")
def get_system_info():
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("C:\\")

    return {
        "cpu_percent": psutil.cpu_percent(interval=0.5),
        "cpu_cores": psutil.cpu_count(logical=True),

        "memory": {
            "total": round(memory.total / (1024 ** 3), 2),
            "used": round(memory.used / (1024 ** 3), 2),
            "percent": memory.percent,
        },

        "disk": {
            "total": round(disk.total / (1024 ** 3), 2),
            "used": round(disk.used / (1024 ** 3), 2),
            "percent": disk.percent,
        },
    }

@app.get("/api/processes")
def get_provesses():
    processes = []

    for process in psutil.process_iter(
        ["pid","name","cpu_percent","memory_percent"]
    ):
        try:
            info = process.info
            processes.append({
                "pid":info["pid"],
                "name":info["name"] or "Unknown",
                "cpu_percent": info["cpu_percent"] or 0,
                "memory_percent": round(
                    info["memory_percent"] or 0,
                    2
                ),
            })

        except(
            psutil.NoSuchProcess,
            psutil.AccessDenied,
            psutil.ZombieProcess,
        ):
            pass


    processes.sort(
        key=lambda process: process["memory_percent"],
        reverse=True,

    )

    return{
        "total_processes": len(processes),
        "processes": processes[:10],
    }

@app.get("/api/attack-surface")
def get_attack_surface():
    connections = []

    for conn in psutil.net_connections(kind="inet"):
        try:
            if conn.status != psutil.CONN_LISTEN:
                continue

            if not conn.laddr:
                continue

            process_name = "Unknown"

            if conn.pid:
                try:
                    process_name = psutil.Process(conn.pid).name()
                except (
                    psutil.NoSuchProcess,
                    psutil.AccessDenied,
                ):
                    pass

            connections.append({
                "port": conn.laddr.port,
                "host": conn.laddr.ip,
                "pid": conn.pid,
                "process": process_name,
                "status": "LISTENING",
            })

        except (psutil.AccessDenied, OSError):
            continue

    connections.sort(key=lambda item: item["port"])

    return {
        "total_open_ports": len(connections),
        "ports": connections,
    }

@app.get("/api/risk-intelligence")
def get_risk_intelligence():
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("C:\\")
    cpu = psutil.cpu_percent(interval=0.2)

    listening_ports = []
    for conn in psutil.net_connections(kind="inet"):
        try:
            if conn.status == psutil.CONN_LISTEN and conn.laddr:
                listening_ports.append(conn)
        except (psutil.AccessDenied, OSError):
            continue

    port_count = len(listening_ports)

    # Statistical anomaly checks
    anomalies = system_anomaly_detector.detect_anomalies(cpu, memory.percent, port_count)

    # Calculate multi-dimensional risk using AI Risk Engine
    risk_result = risk_scorer.calculate_technical_risk(
        cpu_percent=cpu,
        memory_percent=memory.percent,
        disk_percent=disk.percent,
        open_ports_count=port_count,
        active_anomalies_count=len(anomalies),
    )

    # Persist metrics snapshot into SQLite database
    try:
        db.log_metrics(
            cpu_percent=cpu,
            memory_percent=memory.percent,
            disk_percent=disk.percent,
            open_ports=port_count,
            risk_score=risk_result["risk_score"],
        )
    except Exception:
        pass

    return {
        "risk_score": risk_result["risk_score"],
        "risk_level": risk_result["risk_level"],
        "cpu_usage": round(cpu, 1),
        "memory_usage": round(memory.percent, 1),
        "disk_usage": round(disk.percent, 1),
        "open_ports": port_count,
        "breakdown": risk_result.get("breakdown", {}),
    }

@app.get("/api/financial-risk")
def get_financial_risk():
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("C:\\")
    cpu = psutil.cpu_percent(interval=0.2)

    listening_ports = []
    for conn in psutil.net_connections(kind="inet"):
        try:
            if conn.status == psutil.CONN_LISTEN and conn.laddr:
                listening_ports.append(conn)
        except (psutil.AccessDenied, OSError):
            continue

    port_count = len(listening_ports)

    risk_result = risk_scorer.calculate_technical_risk(
        cpu_percent=cpu,
        memory_percent=memory.percent,
        disk_percent=disk.percent,
        open_ports_count=port_count,
    )

    return FinancialExposureEngine.calculate_exposure(
        risk_score=risk_result["risk_score"],
        cpu_usage=cpu,
        memory_usage=memory.percent,
        disk_usage=disk.percent,
        open_ports=port_count,
    )



class InvestmentInput(BaseModel):
    business_type: str = "Small Business"
    monthly_budget: float
    systems: int
    data_value: float


def build_investment_response(monthly_budget: float, systems: int, data_value: float, business_type: str = "Small Business"):
    memory = psutil.virtual_memory()
    disk = psutil.disk_usage("C:\\")
    cpu = psutil.cpu_percent(interval=0.5)

    listening_ports = []
    for conn in psutil.net_connections(kind="inet"):
        try:
            if conn.status == psutil.CONN_LISTEN and conn.laddr:
                listening_ports.append(conn)
        except (psutil.AccessDenied, OSError):
            continue
    port_count = len(listening_ports)

    risk_score = 0
    if cpu > 90: risk_score += 25
    elif cpu > 75: risk_score += 15
    elif cpu > 60: risk_score += 8

    if memory.percent > 90: risk_score += 25
    elif memory.percent > 80: risk_score += 15
    elif memory.percent > 70: risk_score += 8

    if disk.percent > 95: risk_score += 20
    elif disk.percent > 85: risk_score += 12
    elif disk.percent > 75: risk_score += 6

    if port_count > 15: risk_score += 30
    elif port_count > 8: risk_score += 20
    elif port_count > 3: risk_score += 10

    risk_score = min(risk_score, 100)

    if risk_score >= 60:
        risk_level, downtime_hours = "HIGH", 8
    elif risk_score >= 30:
        risk_level, downtime_hours = "MODERATE", 4
    else:
        risk_level, downtime_hours = "LOW", 1

    data_impact = data_value * (risk_score / 100) * 0.20
    system_complexity_cost = systems * 2000
    base_hourly_loss = 15000 * (1 + risk_score / 100)
    incident_cost = base_hourly_loss * downtime_hours
    recovery_cost = incident_cost * 0.35

    current_exposure = round(incident_cost + recovery_cost + data_impact + system_complexity_cost)

    plans = [
        {"id": "essential", "name": "ESSENTIAL DEFENSE", "cost": 25000, "risk_reduction": 15,
         "features": ["Endpoint protection", "System monitoring", "Basic backup strategy"]},
        {"id": "professional", "name": "PROFESSIONAL DEFENSE", "cost": 75000, "risk_reduction": 35,
         "features": ["Advanced monitoring", "Network hardening", "Incident response planning", "Automated backups"]},
        {"id": "enterprise", "name": "ENTERPRISE DEFENSE", "cost": 150000, "risk_reduction": 60,
         "features": ["Continuous threat monitoring", "Advanced endpoint security", "Network segmentation", "Incident response readiness", "Security intelligence automation"]},
    ]

    optimized_plans = []
    for plan in plans:
        affordable = plan["cost"] <= monthly_budget
        projected_exposure = round(current_exposure * (1 - plan["risk_reduction"] / 100))
        potential_savings = current_exposure - projected_exposure
        net_benefit = round(potential_savings - plan["cost"])
        roi = round((net_benefit / plan["cost"]) * 100) if plan["cost"] else 0

        score = 0
        if affordable: score += 40
        if net_benefit > 0: score += 30
        if roi > 0: score += min(roi, 30)

        optimized_plans.append({
            **plan,
            "affordable": affordable,
            "projected_exposure": projected_exposure,
            "potential_savings": potential_savings,
            "net_benefit": net_benefit,
            "roi_percent": roi,
            "recommendation_score": score,
        })

    affordable_plans = [p for p in optimized_plans if p["affordable"]]
    recommended = (
        max(affordable_plans, key=lambda p: (p["recommendation_score"], p["net_benefit"]))
        if affordable_plans
        else min(optimized_plans, key=lambda p: p["cost"])
    )

    defense_recommendations = [
        "Enable multi-factor authentication",
        "Maintain verified offline backups",
        "Monitor critical endpoints continuously",
        "Review unnecessary exposed services",
        "Prepare and test an incident response plan",
    ]
    if port_count > 8:
        defense_recommendations.append("Review and reduce unnecessary listening services")
    if risk_score >= 60:
        defense_recommendations.append("Prioritize immediate security assessment and remediation")

    return {
        "business_type": business_type,
        "live_system_risk": {
            "risk_score": risk_score,
            "risk_level": risk_level,
            "cpu_usage": round(cpu, 2),
            "memory_usage": memory.percent,
            "disk_usage": disk.percent,
            "open_ports": port_count,
        },
        "current_financial_exposure": current_exposure,
        "recommended_plan": recommended,
        "recommendation_reason": f"AURA selected {recommended['name']} based on your budget, system count and data value.",
        "plans": optimized_plans,
        "defense_recommendations": defense_recommendations,
    }


@app.get("/api/investment-optimizer")
def get_investment_optimizer():
    return build_investment_response(monthly_budget=50000, systems=10, data_value=500000)


@app.post("/api/investment-optimizer/analyze")
def analyze_investment(data: InvestmentInput):
    return build_investment_response(
        monthly_budget=data.monthly_budget,
        systems=data.systems,
        data_value=data.data_value,
        business_type=data.business_type,
    )


# FILE 

SCAN_FOLDERS = {
    "Downloads": str(Path.home() / "Downloads"),
    "Desktop": str(Path.home() / "Desktop"),
    "Documents": str(Path.home() / "Documents"),
}

QUARANTINE_FOLDER = str(Path.home() / "Documents" / "AURA_Quarantine")

SENSITIVE_KEYWORDS = [
    "password", "passwords", "credential", "credentials", "secret",
    "apikey", "api_key", "private_key", "seed_phrase", "wallet",
    "backup_codes", "creditcard", "credit_card",
    # India-specific PII
    "aadhar", "aadhaar", "pan_card", "pancard", "passport",
    "voter_id", "voterid", "bank_statement", "salary_slip", "payslip",
]

SENSITIVE_EXTENSIONS = {".env", ".pem", ".key", ".pfx", ".ppk"}
JUNK_EXTENSIONS = {".tmp", ".log", ".bak", ".old", ".dmp", ".cache"}

MAX_SCAN_DEPTH = 2
MAX_FILES_PER_FOLDER = 500


def _walk_files(root_path, max_depth):
    root = Path(root_path)
    if not root.exists():
        return []

    results = []
    root_depth = len(root.parts)

    for dirpath, dirnames, filenames in os.walk(root):
        current_depth = len(Path(dirpath).parts) - root_depth
        if current_depth >= max_depth:
            dirnames[:] = []

        for name in filenames:
            full_path = Path(dirpath) / name
            try:
                stat = full_path.stat()
            except (OSError, PermissionError):
                continue

            results.append({
                "path": str(full_path),
                "name": name,
                "size": stat.st_size,
                "modified": stat.st_mtime,
                "extension": full_path.suffix.lower(),
            })

            if len(results) >= MAX_FILES_PER_FOLDER:
                return results

    return results


def _hash_file(path, block_size=65536):
    hasher = hashlib.md5()
    try:
        with open(path, "rb") as f:
            while True:
                chunk = f.read(block_size)
                if not chunk:
                    break
                hasher.update(chunk)
        return hasher.hexdigest()
    except (OSError, PermissionError):
        return None


@app.get("/api/file-security/scan")
def scan_files():
    all_files = []

    for folder_label, folder_path in SCAN_FOLDERS.items():
        files = _walk_files(folder_path, MAX_SCAN_DEPTH)
        for f in files:
            f["source_folder"] = folder_label
        all_files.extend(files)

    flagged = []

    # Sensitive files
    for f in all_files:
        name_lower = f["name"].lower()
        is_sensitive = (
            f["extension"] in SENSITIVE_EXTENSIONS
            or any(keyword in name_lower for keyword in SENSITIVE_KEYWORDS)
        )
        if is_sensitive:
            flagged.append({
                **f,
                "category": "SENSITIVE",
                "reason": "Filename or extension suggests sensitive data (credentials/keys).",
                "recommended_action": "REVIEW",
            })

    # Junk files
    for f in all_files:
        is_junk = f["extension"] in JUNK_EXTENSIONS or f["name"].startswith("~$")
        if is_junk:
            flagged.append({
                **f,
                "category": "JUNK",
                "reason": "Temporary/log/backup file type — safe cleanup candidate.",
                "recommended_action": "QUARANTINE",
            })

    # Duplicates (by size, then content hash)
    size_groups = {}
    for f in all_files:
        size_groups.setdefault(f["size"], []).append(f)

    for size, group in size_groups.items():
        if len(group) < 2 or size == 0 or size >100 * 1024*1024:
            continue

        hash_groups = {}
        for f in group:
            file_hash = _hash_file(f["path"])
            if file_hash:
                hash_groups.setdefault(file_hash, []).append(f)

        for file_hash, dup_group in hash_groups.items():
            if len(dup_group) < 2:
                continue
            dup_group.sort(key=lambda x: x["modified"])
            for f in dup_group[1:]:
                flagged.append({
                    **f,
                    "category": "DUPLICATE",
                    "reason": "Duplicate of an older file with identical content.",
                    "recommended_action": "QUARANTINE",
                })

    seen_paths = set()
    unique_flagged = []
    for f in flagged:
        if f["path"] not in seen_paths:
            seen_paths.add(f["path"])
            unique_flagged.append(f)

    total_size_flagged = sum(
        f["size"] for f in unique_flagged if f["category"] != "SENSITIVE"
    )

    return {
        "scanned_folders": list(SCAN_FOLDERS.keys()),
        "total_files_scanned": len(all_files),
        "total_flagged": len(unique_flagged),
        "potential_space_recoverable_mb": round(total_size_flagged / (1024 ** 2), 2),
        "files": unique_flagged,
    }


class FileActionRequest(BaseModel):
    paths: List[str]


def _is_path_allowed(path: str) -> bool:
    resolved = Path(path).resolve()
    for folder_path in SCAN_FOLDERS.values():
        try:
            resolved.relative_to(Path(folder_path).resolve())
            return True
        except ValueError:
            continue
    return False

HOME_ROOT = str(Path.home())
BLOCKED_HOME_SUBFOLDERS = {"appdata", ".git", "ntuser.dat"}


def _is_within_home(path: str) -> bool:
    try:
        resolved = Path(path).resolve()
        home_resolved = Path(HOME_ROOT).resolve()
        relative_parts = resolved.relative_to(home_resolved).parts
    except ValueError:
        return False

    if relative_parts and relative_parts[0].lower() in BLOCKED_HOME_SUBFOLDERS:
        return False

    return True



QUARANTINE_LOG_PATH = os.path.join(QUARANTINE_FOLDER, "_quarantine_log.json")


def _load_quarantine_log():
    if not os.path.exists(QUARANTINE_LOG_PATH):
        return {}
    try:
        with open(QUARANTINE_LOG_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    except (OSError, json.JSONDecodeError):
        return {}


def _save_quarantine_log(log_data):
    os.makedirs(QUARANTINE_FOLDER, exist_ok=True)
    with open(QUARANTINE_LOG_PATH, "w", encoding="utf-8") as f:
        json.dump(log_data, f)


@app.post("/api/file-security/quarantine")
def quarantine_files(request: FileActionRequest):
    os.makedirs(QUARANTINE_FOLDER, exist_ok=True)
    log_data = _load_quarantine_log()
    results = []

    for path in request.paths:
        if not _is_path_allowed(path):
            results.append({"path": path, "status": "REJECTED", "reason": "Path outside scanned folders"})
            continue

        source = Path(path)
        if not source.exists():
            results.append({"path": path, "status": "NOT_FOUND"})
            continue

        try:
            quarantine_name = f"{int(time.time())}_{source.name}"
            destination = Path(QUARANTINE_FOLDER) / quarantine_name
            shutil.move(str(source), str(destination))

            log_data[quarantine_name] = {
                "original_path": str(source),
                "quarantined_at": time.time(),
            }

            # Persist to SQLite quarantine records & audit events
            try:
                stat = destination.stat()
                db.record_quarantine(
                    quarantine_name=quarantine_name,
                    original_path=str(source),
                    file_size=stat.st_size,
                    category="FILE_DEFENSE",
                )
                db.log_event(
                    event_type="SHIELD",
                    severity="WARNING",
                    title=f"File Quarantined: {source.name}",
                    description=f"Isolated from {source} into secure quarantine vault.",
                    source="FILE_SECURITY",
                )
            except Exception:
                pass

            results.append({"path": path, "status": "QUARANTINED", "new_location": str(destination)})
        except (OSError, PermissionError) as error:
            results.append({"path": path, "status": "FAILED", "reason": str(error)})

    _save_quarantine_log(log_data)
    return {"results": results}

@app.get("/api/file-security/quarantine/list")
def list_quarantine():
    os.makedirs(QUARANTINE_FOLDER, exist_ok=True)
    log_data = _load_quarantine_log()

    items = []
    for entry in os.scandir(QUARANTINE_FOLDER):
        if entry.is_file() and entry.name != "_quarantine_log.json":
            try:
                stat = entry.stat()
            except (OSError, PermissionError):
                continue

            log_entry = log_data.get(entry.name, {})

            items.append({
                "quarantine_name": entry.name,
                "original_path": log_entry.get("original_path", "Unknown"),
                "size": stat.st_size,
                "quarantined_at": log_entry.get("quarantined_at", stat.st_mtime),
            })

    items.sort(key=lambda x: x["quarantined_at"], reverse=True)

    return {
        "total_quarantined": len(items),
        "items": items,
    }


class QuarantineRestoreRequest(BaseModel):
    quarantine_names: List[str]


@app.post("/api/file-security/quarantine/restore")
def restore_quarantine(request: QuarantineRestoreRequest):
    log_data = _load_quarantine_log()
    results = []

    for quarantine_name in request.quarantine_names:
        source = Path(QUARANTINE_FOLDER) / quarantine_name
        if not source.exists():
            results.append({"quarantine_name": quarantine_name, "status": "NOT_FOUND"})
            continue

        log_entry = log_data.get(quarantine_name)
        if not log_entry:
            results.append({"quarantine_name": quarantine_name, "status": "NO_ORIGINAL_RECORD"})
            continue

        original_path = Path(log_entry["original_path"])

        try:
            os.makedirs(original_path.parent, exist_ok=True)

            destination = original_path
            if destination.exists():
                destination = original_path.parent / f"restored_{original_path.name}"

            shutil.move(str(source), str(destination))
            log_data.pop(quarantine_name, None)
            results.append({"quarantine_name": quarantine_name, "status": "RESTORED", "restored_to": str(destination)})
        except (OSError, PermissionError) as error:
            results.append({"quarantine_name": quarantine_name, "status": "FAILED", "reason": str(error)})

    _save_quarantine_log(log_data)
    return {"results": results}


class FileCreateRequest(BaseModel):
    folder: Literal["Downloads", "Desktop", "Documents"]
    filename: str
    content: str = ""


@app.post("/api/file-security/create-file")
def create_file(request: FileCreateRequest):
    folder_path = SCAN_FOLDERS[request.folder]
    os.makedirs(folder_path, exist_ok=True)

    safe_name = Path(request.filename).name
    target_path = Path(folder_path) / safe_name

    try:
        with open(target_path, "w", encoding="utf-8") as f:
            f.write(request.content)
        return {"status": "CREATED", "path": str(target_path)}
    except (OSError, PermissionError) as error:
        return {"status": "FAILED", "reason": str(error)}


@app.post("/api/file-security/delete")
def delete_files(request: FileActionRequest):
    results = []

    for path in request.paths:
        if not _is_path_allowed(path):
            results.append({"path": path, "status": "REJECTED", "reason": "Path outside scanned folders"})
            continue

        source = Path(path)
        if not source.exists():
            results.append({"path": path, "status": "NOT_FOUND"})
            continue

        try:
            send2trash(str(source))
            results.append({"path": path, "status": "DELETED"})
        except Exception as error:
            results.append({"path": path, "status": "FAILED", "reason": str(error)})

    return {"results": results}

# =========================================
# AURA VOICE ASSISTANT (LLM-powered)
# =========================================

VALID_MODULES = {
    "system-monitoring", "attack-surface", "risk-intelligence",
    "financial-risk", "what-if-engine", "investment-optimizer",
    "file-security",
}

LANGUAGE_INSTRUCTIONS = {
    "hindi": "Hindi, written in Devanagari script",
    "hinglish": "Hinglish — natural Hindi-English mix in Roman script, the way Indian students actually talk",
    "english": "English",
}

AURA_SYSTEM_PROMPT = """You are AURA, the voice assistant inside AURA SENTINEL, a cyber risk intelligence dashboard built for Smart India Hackathon 2026.

Personality: warm, confident, concise — like a sharp technical teammate, not a corporate chatbot. Keep replies to 1-3 short sentences since they are spoken aloud via text-to-speech.

You can open these modules by including an "action" field:
- "system-monitoring": live CPU/memory/disk/process telemetry
- "attack-surface": open network ports and exposed services
- "risk-intelligence": overall cyber risk score breakdown
- "financial-risk": financial impact of current risk
- "what-if-engine": simulate hypothetical system conditions
- "investment-optimizer": recommend security investment plans
- "file-security": scan files for junk/duplicate/sensitive content

You can also perform file operations inside the user's personal folders. The user's home folder is at: {home_path}
Standard subfolders: Desktop at {home_path}\\Desktop, Downloads at {home_path}\\Downloads, Documents at {home_path}\\Documents.

To perform a file operation, include a "file_action" field shaped like one of:
{{"type": "move", "source": "full path to file", "destination_folder": "full path to folder"}}
{{"type": "delete", "paths": ["full path to file", ...]}}
{{"type": "create_folder", "parent_folder": "full path", "folder_name": "name"}}

Rules for file_action:
- Only set it when you have matched an exact file from the known files list provided below, and the user's intent (move/delete/create_folder) is unambiguous. If details are missing or no match is found, ask a clarifying question in "reply" instead and set file_action to null.
- Match the "type" field EXACTLY to the user's verb: "move"/"shift"/"le jao" means type "move". "delete"/"remove"/"hatao" means type "delete". Never substitute one for the other.

Respond ONLY in this language: {language_instruction}

Respond with ONLY valid JSON, no markdown fences, no extra text, in exactly this shape:
{{"reply": "your spoken response here", "action": "module-name-or-null", "file_action": {{...}} or null}}

Only set an action if the user clearly wants to see/open/check that specific area. For greetings or general questions, set both action and file_action to null.
"""


class ChatMessage(BaseModel):
    role: str
    content: str


class AuraChatRequest(BaseModel):
    message: str
    language: str = "hinglish"
    history: List[ChatMessage] = []


def _validate_file_action(action):
    if not isinstance(action, dict):
        return None
    action_type = action.get("type")
    if action_type == "move" and action.get("source") and action.get("destination_folder"):
        return action
    if action_type == "delete" and isinstance(action.get("paths"), list) and action.get("paths"):
        return action
    if action_type == "create_folder" and action.get("parent_folder") and action.get("folder_name"):
        return action
    return None

def _get_known_files_context(max_files=60):
    entries = []
    for folder_label, folder_path in SCAN_FOLDERS.items():
        try:
            files = _walk_files(folder_path, max_depth=1)
        except Exception:
            files = []
        for f in files[:20]:
            entries.append(f"{f['name']} -> {f['path']}")
        if len(entries) >= max_files:
            break

    if not entries:
        return "No files found in Desktop, Downloads or Documents."

    return "\n".join(entries[:max_files])

@app.post("/api/aura-assistant/chat")
def aura_chat(request: AuraChatRequest):
    if not os.environ.get("GROQ_API_KEY"):
        return {"reply": "AURA's language engine isn't configured yet.", "action": None}

    language_instruction = LANGUAGE_INSTRUCTIONS.get(request.language, LANGUAGE_INSTRUCTIONS["hinglish"])
    system_prompt = AURA_SYSTEM_PROMPT.format(language_instruction=language_instruction, home_path=HOME_ROOT)
    known_files = _get_known_files_context()
    system_prompt += f"\n\nHere is the current list of files in the user's Desktop, Downloads and Documents folders (filename -> full path):\n{known_files}\n\nWhen the user asks to move or delete a file, you MUST match it against this list to find the exact filename and full path. If you cannot find a clear match, ask the user to clarify the exact filename in your reply, and set file_action to null. Never guess a file extension or path that isn't in this list."
    messages = [{"role": "system", "content": system_prompt}]
    for turn in request.history[-10:]:
        messages.append({"role": turn.role, "content": turn.content})
    messages.append({"role": "user", "content": request.message})

    raw = ""
    try:
        completion = groq_client.chat.completions.create( #type:ignore
            model="openai/gpt-oss-20b",
            messages=messages, #type: ignore
            temperature=0.6,
            max_tokens=300,
        )
        raw = (completion.choices[0].message.content or "").strip()

        if raw.startswith("```"):
            raw = raw.strip("`")
            if raw.lower().startswith("json"):
                raw = raw[4:].strip()

        parsed = json.loads(raw)
        reply = parsed.get("reply", "")
        action = parsed.get("action")
        if action not in VALID_MODULES:
            action = None

        file_action = _validate_file_action(parsed.get("file_action"))

        return {"reply": reply, "action": action, "file_action": file_action}

    except json.JSONDecodeError:
        return {"reply": raw or "Sorry, I couldn't process that.", "action": None}
    except Exception as error:
        print(f"[AURA CHAT ERROR] {error}")  # terminal mein turant dikhega
        return {"reply": "AURA is having trouble connecting right now.", "action": None, "error": str(error)}



class MoveFileRequest(BaseModel):
    source: str
    destination_folder: str


class CreateFolderRequest(BaseModel):
    parent_folder: str
    folder_name: str


@app.post("/api/file-ops/move")
def move_file(request: MoveFileRequest):
    if not _is_within_home(request.source) or not _is_within_home(request.destination_folder):
        return {"status": "REJECTED", "reason": "Path outside allowed area"}

    source = Path(request.source)
    destination_folder = Path(request.destination_folder)

    if not source.exists():
        return {"status": "NOT_FOUND"}

    try:
        os.makedirs(destination_folder, exist_ok=True)
        destination = destination_folder / source.name
        if destination.exists():
            destination = destination_folder / f"{destination.stem}_copy{destination.suffix}"
        shutil.move(str(source), str(destination))
        return {"status": "MOVED", "new_location": str(destination)}
    except (OSError, PermissionError) as error:
        return {"status": "FAILED", "reason": str(error)}


@app.post("/api/file-ops/create-folder")
def create_folder(request: CreateFolderRequest):
    if not _is_within_home(request.parent_folder):
        return {"status": "REJECTED", "reason": "Path outside allowed area"}

    safe_name = Path(request.folder_name).name
    target = Path(request.parent_folder) / safe_name

    try:
        target.mkdir(parents=True, exist_ok=False)
        return {"status": "CREATED", "path": str(target)}
    except FileExistsError:
        return {"status": "ALREADY_EXISTS", "path": str(target)}
    except (OSError, PermissionError) as error:
        return {"status": "FAILED", "reason": str(error)}


@app.post("/api/file-ops/delete")
def delete_file_broad(request: FileActionRequest):
    results = []
    for path in request.paths:
        if not _is_within_home(path):
            results.append({"path": path, "status": "REJECTED", "reason": "Path outside allowed area"})
            continue
        source = Path(path)
        if not source.exists():
            results.append({"path": path, "status": "NOT_FOUND"})
            continue
        try:
            send2trash(str(source))
            results.append({"path": path, "status": "DELETED"})
        except Exception as error:
            results.append({"path": path, "status": "FAILED", "reason": str(error)})
    return {"results": results}

def generate_vision_frames():
    cap = cv2.VideoCapture(0)
    if not cap.isOpened():
        print("Camera device not accessible")
        return
    
    try:
        while True:
            success, frame = cap.read()
            if not success:
                break

            results = yolo_model(frame, verbose=False, classes=[0]) #type: ignore
            rects = []

            for result in results:
                for box in result.boxes: #type:ignore
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    rects.append((x1, y1, x2, y2))

            # Centroid tracker update (AI Tracking Engine)
            tracked_entities = vision_tracker.update(rects)

            for entity in tracked_entities:
                x1, y1, x2, y2 = entity["bbox"]
                obj_id = entity["id"]
                dwell = entity["dwell_time"]

                # Draw bounding box & ID label
                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 200, 255), 2)
                label = f"Target #{obj_id} [{dwell:.0f}s]"
                cv2.putText(frame, label, (x1, y1 - 8),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 200, 255), 2)

            cv2.putText(frame, f"AURA VISION | TARGETS TRACKED: {len(tracked_entities)}", (15, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2)

            ok, buffer = cv2.imencode(".jpg", frame)
            if not ok:
                continue

            frame_bytes = buffer.tobytes()
            yield (b"--frame\r\nContent-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n")
    finally:
        cap.release()


@app.get("/api/vision/stream")
def vision_stream():
    return StreamingResponse(
        generate_vision_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame",
    )

# =========================================
# SOC ACTIVE DEFENSE & AUTOMATION
# =========================================

class ProcessKillRequest(BaseModel):
    pid: int

@app.post("/api/processes/kill")
def kill_process(request: ProcessKillRequest):
    pid = request.pid
    current_pid = os.getpid()

    if pid <= 4 or pid == current_pid:
        return {"status": "REJECTED", "reason": "Cannot terminate protected kernel or system server process."}

    try:
        proc = psutil.Process(pid)
        proc_name = proc.name()
        proc.terminate()
        try:
            proc.wait(timeout=1.5)
        except psutil.TimeoutExpired:
            proc.kill()

        # Audit mitigation to persistent SQLite database
        try:
            db.record_mitigation(
                action_type="KILL_PROCESS",
                target=f"PID {pid} ({proc_name})",
                details="Operator manual termination via SOC dashboard.",
                operator="OPERATOR_LEVEL_1",
                status="TERMINATED"
            )
            db.log_event(
                event_type="PROCESS",
                severity="WARNING",
                title=f"Host Process Terminated: {proc_name}",
                description=f"PID {pid} ({proc_name}) terminated by operator action.",
                source="PROCESS_WATCHDOG",
            )
        except Exception:
            pass

        return {"status": "TERMINATED", "pid": pid, "name": proc_name}
    except psutil.NoSuchProcess:
        return {"status": "NOT_FOUND", "reason": "Process does not exist or has already exited."}
    except psutil.AccessDenied:
        return {"status": "ACCESS_DENIED", "reason": "Administrative permissions required to terminate this process."}
    except Exception as e:
        return {"status": "FAILED", "reason": str(e)}

@app.get("/api/soc/alerts")
def get_soc_alerts():
    alerts = []
    now = time.time()

    # System telemetry checks
    try:
        cpu = psutil.cpu_percent(interval=0.1)
        mem = psutil.virtual_memory()

        # Check listening ports
        listening_conns = []
        for c in psutil.net_connections(kind="inet"):
            if c.status == psutil.CONN_LISTEN and c.laddr:
                listening_conns.append({
                    "port": c.laddr.port,
                    "host": c.laddr.ip,
                    "process": "System" if not c.pid else "Active Daemon",
                    "pid": c.pid,
                })

        # 1. AI Threat Detection Engine: High-risk vulnerable ports
        vulnerable_ports = threat_detector.inspect_listening_ports(listening_conns)
        for vp in vulnerable_ports:
            alerts.append({
                "id": f"port-vuln-{vp['port']}-{int(now)}",
                "severity": vp["risk"],
                "title": f"High-Risk Service Port Exposed (Port {vp['port']} - {vp['service']})",
                "source": "THREAT_DETECTOR",
                "timestamp": now,
                "action": vp["remediation"],
            })

        # 2. AI Anomaly Engine: Statistical Z-score & trend anomalies
        anomalies = system_anomaly_detector.detect_anomalies(cpu, mem.percent, len(listening_conns))
        for anom in anomalies:
            alerts.append({
                "id": anom["id"],
                "severity": anom["severity"],
                "title": anom["title"],
                "source": "AI_ANOMALY_ENGINE",
                "timestamp": now,
                "action": anom["action"],
            })

        # Standard threshold alerts
        if cpu > 75 and not any(a["source"] == "AI_ANOMALY_ENGINE" and "Compute" in a["title"] for a in alerts):
            alerts.append({
                "id": f"cpu-{int(now)}",
                "severity": "CRITICAL" if cpu > 90 else "WARNING",
                "title": f"Elevated Processor Load ({cpu}%)",
                "source": "KERNEL_TELEMETRY",
                "timestamp": now,
                "action": "Inspect high compute background processes.",
            })

        if mem.percent > 80 and not any(a["source"] == "AI_ANOMALY_ENGINE" and "Memory" in a["title"] for a in alerts):
            alerts.append({
                "id": f"mem-{int(now)}",
                "severity": "CRITICAL" if mem.percent > 90 else "WARNING",
                "title": f"High Memory Saturation ({mem.percent}%)",
                "source": "MEMORY_AUDIT",
                "timestamp": now,
                "action": "Examine memory-intensive applications.",
            })

        # Log alerts with severity WARNING or CRITICAL to SQLite
        for a in alerts:
            if a["severity"] in ["WARNING", "HIGH", "CRITICAL"]:
                try:
                    db.log_event(
                        event_type="IDS",
                        severity=a["severity"],
                        title=a["title"],
                        description=a["action"],
                        source=a["source"],
                    )
                except Exception:
                    pass

        # Nominal system status fallback
        if not alerts:
            alerts.append({
                "id": f"nominal-{int(now)}",
                "severity": "NOMINAL",
                "title": "All Subsystems Nominal — No Active Threats",
                "source": "AURA_SENTINEL",
                "timestamp": now,
                "action": "Continuous background monitoring engaged.",
            })

    except Exception as e:
        alerts.append({
            "id": f"err-{int(now)}",
            "severity": "INFO",
            "title": f"Telemetry check exception: {str(e)}",
            "source": "DIAGNOSTICS",
            "timestamp": now,
            "action": "Verify psutil permissions.",
        })

    return {"total_alerts": len(alerts), "alerts": alerts}

class AttackSimRequest(BaseModel):
    scenario: str = "brute_force"  # brute_force | ddos | port_scan | clear

@app.post("/api/soc/simulate-attack")
def simulate_attack(request: AttackSimRequest):
    scenario = request.scenario.lower()

    if scenario == "clear":
        try:
            db.log_event(
                event_type="SHIELD",
                severity="NOMINAL",
                title="Wargame Simulation Cleared",
                description="Perimeter normalized; all simulated threat vectors mitigated.",
                source="WARGAME_ENGINE"
            )
        except Exception:
            pass

        return {
            "simulation_active": False,
            "scenario": "NORMAL",
            "risk_score": 18,
            "threat_level": "LOW",
            "active_threats": [],
            "remediation_status": "System normalized. Countermeasures successfully applied.",
        }

    # Evaluate threat using AI Threat Detection Engine
    selected = threat_detector.evaluate_attack_scenario(scenario)

    # Persist simulation incident to SQLite database
    try:
        actor_ip = selected.get("simulated_actor_ip", "Unknown")
        db.log_event(
            event_type="ATTACK_SIM",
            severity=selected.get("threat_level", "HIGH"),
            title=f"Attack Simulation: {selected['threat_name']}",
            description=selected.get("mitigation_playbook", ""),
            source="WARGAME_ENGINE",
            ip_address=actor_ip,
            metadata={
                "targeted_ports": selected.get("targeted_ports", []),
                "financial_spike": selected.get("financial_loss_spike", 0),
                "mitre": selected.get("mitre_technique", ""),
            }
        )

        # Update threat actor tracking profile in SQLite
        db.upsert_threat_actor(
            ip_address=actor_ip,
            threat_score=selected.get("risk_score", 80),
            status="ATTACKING",
            notes=selected.get("threat_name", "")
        )
    except Exception:
        pass

    return {
        "simulation_active": True,
        "scenario": scenario.upper(),
        **selected,
        "timestamp": time.time(),
    }

# =========================================
# DATABASE & HISTORICAL TELEMETRY APIS
# =========================================

@app.get("/api/database/events")
def get_database_events(limit: int = 50, severity: str = "ALL", event_type: str = "ALL"):
    events = db.get_recent_events(limit=limit, severity=severity, event_type=event_type)
    return {
        "total": len(events),
        "events": events,
    }

@app.get("/api/database/stats")
def get_database_stats():
    return db.get_database_stats()

@app.get("/api/database/metrics-history")
def get_database_metrics_history(limit: int = 60):
    return {
        "history": db.get_metrics_history(limit=limit),
    }

@app.get("/api/database/threat-actors")
def get_database_threat_actors(limit: int = 20):
    return {
        "threat_actors": db.get_threat_actors(limit=limit),
    }

@app.get("/api/analytics/metrics")
def get_analytics_metrics():
    now = time.time()
    boot_time = psutil.boot_time()
    system_uptime = round(now - boot_time)
    backend_uptime = round(now - BACKEND_START_TIME)

    return {
        "backend_uptime_seconds": backend_uptime,
        "system_uptime_seconds": system_uptime,
        "system_uptime_formatted": f"{system_uptime // 3600}h {(system_uptime % 3600) // 60}m {system_uptime % 60}s",
        "cpu_count_logical": psutil.cpu_count(logical=True),
        "cpu_count_physical": psutil.cpu_count(logical=False),
        "platform": {
            "os": platform.system(),
            "release": platform.release(),
            "machine": platform.machine(),
            "processor": platform.processor(),
        },
        "active_sockets_count": len(psutil.net_connections(kind="inet")),
    }

# =========================================
# OPERATOR AUTHENTICATION & USER MANAGEMENT
# =========================================

class UserRegisterRequest(BaseModel):
    username: str
    full_name: str
    password: str
    role: str = "Level 1 - SOC Operator"
    face_descriptor: Optional[List[float]] = None

class UserLoginRequest(BaseModel):
    username: str
    password: str

class SaveBiometricsRequest(BaseModel):
    username: str
    descriptor: List[float]

@app.post("/api/auth/register")
def register_operator(request: UserRegisterRequest):
    username = request.username.strip().lower()
    if not username or len(username) < 3:
        return {"status": "ERROR", "message": "Username must be at least 3 characters."}
    if not request.password or len(request.password) < 4:
        return {"status": "ERROR", "message": "Password must be at least 4 characters."}

    # Check existing
    existing = db.get_user_by_username(username)
    if existing:
        return {"status": "ERROR", "message": f"Operator username '{username}' is already registered."}

    try:
        new_user = db.create_user(
            username=username,
            full_name=request.full_name or username,
            password=request.password,
            role=request.role or "Level 1 - SOC Operator",
            face_descriptor=request.face_descriptor,
        )
        return {
            "status": "SUCCESS",
            "message": f"Operator '{username}' registered with clearance {new_user['role']}.",
            "user": new_user,
        }
    except Exception as e:
        return {"status": "ERROR", "message": str(e)}

@app.post("/api/auth/login")
def login_operator(request: UserLoginRequest):
    user = db.verify_user(request.username, request.password)
    if not user:
        # Audit failed login
        try:
            db.log_event(
                event_type="AUTH",
                severity="WARNING",
                title=f"Failed Login Attempt: {request.username}",
                description="Invalid credentials submitted.",
                source="OPERATOR_AUTH"
            )
        except Exception:
            pass
        return {"status": "ERROR", "message": "Invalid username or security password."}

    return {
        "status": "SUCCESS",
        "message": f"Welcome back, Operator {user['full_name']}.",
        "user": user,
    }

@app.get("/api/auth/users")
def list_registered_operators():
    return {
        "total": len(db.list_users()),
        "operators": db.list_users(),
    }

@app.post("/api/auth/save-biometrics")
def save_operator_biometrics(request: SaveBiometricsRequest):
    success = db.save_user_face_descriptor(request.username, request.descriptor)
    if not success:
        return {"status": "ERROR", "message": "Operator not found or biometric update failed."}
    return {
        "status": "SUCCESS",
        "message": f"Biometric signature saved to database for {request.username}.",
    }

@app.get("/api/auth/biometrics/descriptors")
def get_biometrics_descriptors():
    return {
        "operators": db.get_users_with_biometrics(),
    }

