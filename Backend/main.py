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
import subprocess

PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from Database import db
from blockchain_ledger import blockchain_ledger
from Ai_Engine import (
    risk_scorer,
    FinancialExposureEngine,
    SystemAnomalyDetector,
    ThreatDetector,
    CentroidTracker,
    ThreatActorTracker,
    GestureController,
    PresenceAutoLockEngine,
)

system_anomaly_detector = SystemAnomalyDetector(window_size=30)
threat_detector = ThreatDetector()
vision_tracker = CentroidTracker(max_disappeared=25, max_distance=90.0)
threat_actor_tracker = ThreatActorTracker()
gesture_controller = GestureController(enabled=True)
presence_lock_engine = PresenceAutoLockEngine(grace_period_seconds=5, enabled=True)

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
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
@app.get("/api")
@app.get("/api/health")
def home():
    return {
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

ADVANCED_PORT_THREAT_CATALOG = {
    445: {
        "threat_level": "CRITICAL",
        "service_name": "SMBv1/v2 File Sharing",
        "threat_title": "Ransomware Lateral Propagation (EternalBlue / WannaCry)",
        "cve_id": "CVE-2017-0144 / MS17-010",
        "cvss_score": 9.8,
        "mitre_technique": "T1021.002 - SMB/Windows Admin Shares",
        "attack_vector": "Remote unauthenticated attacker injects malformed SMB buffers over local network to achieve arbitrary code execution with NT AUTHORITY\\SYSTEM privileges.",
        "potential_impact": "Total ransomware file encryption & lateral infection of entire campus subnet.",
        "remediation": "Block inbound port 445 on public/Wi-Fi adapters immediately. Enforce SMB signing & disable legacy SMBv1.",
        "firewall_cmd": 'netsh advfirewall firewall add rule name="AURA_BLOCK_SMB_445" dir=in action=block protocol=TCP localport=445',
        "is_noise": False,
    },
    135: {
        "threat_level": "HIGH",
        "service_name": "MS-RPC Endpoint Mapper",
        "threat_title": "Remote DCOM / RPC Deserialization Vector",
        "cve_id": "CVE-2022-26809 / MS-RPC RCE",
        "cvss_score": 8.8,
        "mitre_technique": "T1021.003 - Distributed Component Object Model (DCOM)",
        "attack_vector": "Adversaries probe RPC endpoint mapper to enumerate active COM services and trigger unauthenticated remote memory corruption.",
        "potential_impact": "Lateral privilege escalation and domain host compromise.",
        "remediation": "Restrict TCP port 135 to trusted domain controllers; apply Windows Defender Firewall RPC ingress filters.",
        "firewall_cmd": 'netsh advfirewall firewall add rule name="AURA_BLOCK_RPC_135" dir=in action=block protocol=TCP localport=135',
        "is_noise": False,
    },
    139: {
        "threat_level": "HIGH",
        "service_name": "NetBIOS Session Service",
        "threat_title": "NetBIOS Name Service Poisoning (Responder Attack)",
        "cve_id": "CWE-200 / MITRE T1557.001",
        "cvss_score": 7.5,
        "mitre_technique": "T1557.001 - LLMNR/NBT-NS Poisoning",
        "attack_vector": "Adversary listens for broadcast NetBIOS queries and responds with rogue authentication challenges to capture hashes.",
        "potential_impact": "NTLMv2 password hash theft and offline cracking.",
        "remediation": "Disable NetBIOS over TCP/IP in network adapter IPv4 properties.",
        "firewall_cmd": 'netsh advfirewall firewall add rule name="AURA_BLOCK_NETBIOS_139" dir=in action=block protocol=TCP localport=139',
        "is_noise": False,
    },
    3389: {
        "threat_level": "CRITICAL",
        "service_name": "RDP Remote Desktop",
        "threat_title": "RDP Pre-Auth Remote Execution (BlueKeep)",
        "cve_id": "CVE-2019-0708 / BlueKeep",
        "cvss_score": 9.8,
        "mitre_technique": "T1021.001 - Remote Desktop Protocol",
        "attack_vector": "Crafted channel requests over port 3389 enable pre-authentication kernel memory corruption without user credentials.",
        "potential_impact": "Complete remote GUI desktop takeover and stealth rootkit installation.",
        "remediation": "Enforce Network Level Authentication (NLA), change default port, and require VPN gateway tunnel.",
        "firewall_cmd": 'netsh advfirewall firewall add rule name="AURA_BLOCK_RDP_3389" dir=in action=block protocol=TCP localport=3389',
        "is_noise": False,
    },
    23: {
        "threat_level": "CRITICAL",
        "service_name": "Telnet Terminal",
        "threat_title": "Cleartext Authentication & Keystroke Sniffing",
        "cve_id": "CWE-319 - Cleartext Transmission",
        "cvss_score": 9.0,
        "mitre_technique": "T1040 - Network Sniffing",
        "attack_vector": "Every administrator keystroke, credential, and command is broadcast in cleartext ASCII across the network.",
        "potential_impact": "Instant password interception via passive packet sniffers on shared Wi-Fi.",
        "remediation": "Disable Telnet server service immediately. Transition to OpenSSH with ed25519 key authentication.",
        "firewall_cmd": 'netsh advfirewall firewall add rule name="AURA_BLOCK_TELNET_23" dir=in action=block protocol=TCP localport=23',
        "is_noise": False,
    },
    21: {
        "threat_level": "HIGH",
        "service_name": "FTP Plaintext Daemon",
        "threat_title": "Cleartext File Transfer & Anonymous Write Vector",
        "cve_id": "CWE-319 / FTP Plaintext Auth",
        "cvss_score": 7.8,
        "mitre_technique": "T1552 - Unsecured Credentials",
        "attack_vector": "Cleartext authentication permits packet interception; frequently coupled with anonymous upload directories for web shells.",
        "potential_impact": "Confidential document exfiltration and staging malicious web payloads.",
        "remediation": "Migrate to SFTP (port 22) or FTPS with enforced TLS 1.3 encryption.",
        "firewall_cmd": 'netsh advfirewall firewall add rule name="AURA_BLOCK_FTP_21" dir=in action=block protocol=TCP localport=21',
        "is_noise": False,
    },
    6379: {
        "threat_level": "CRITICAL",
        "service_name": "Redis In-Memory DB",
        "threat_title": "Unauthenticated Redis Database RCE & Key Injection",
        "cve_id": "CVE-2022-0543 / Redis Sandbox Escape",
        "cvss_score": 9.8,
        "mitre_technique": "T1190 - Exploit Public-Facing Application",
        "attack_vector": "Redis bound to external IP without password auth allows adversaries to write unauthorized SSH keys directly to root filesystem.",
        "potential_impact": "Direct root server takeover and mass cache data extraction.",
        "remediation": "Bind Redis strictly to 127.0.0.1 and enable requirepass authentication in redis.conf.",
        "firewall_cmd": 'netsh advfirewall firewall add rule name="AURA_BLOCK_REDIS_6379" dir=in action=block protocol=TCP localport=6379',
        "is_noise": False,
    },
    27017: {
        "threat_level": "HIGH",
        "service_name": "MongoDB NoSQL DB",
        "threat_title": "Unauthenticated NoSQL Database Exposure",
        "cve_id": "CWE-306 - Missing Authentication",
        "cvss_score": 8.6,
        "mitre_technique": "T1530 - Data from Database Storage",
        "attack_vector": "Exposed MongoDB instance allowing unauthenticated cluster commands to dump sensitive collections or wipe databases.",
        "potential_impact": "Mass student/enterprise PII exfiltration and extortion ransomware.",
        "remediation": "Enable security.authorization in mongod.cfg and bind IP strictly to 127.0.0.1.",
        "firewall_cmd": 'netsh advfirewall firewall add rule name="AURA_BLOCK_MONGO_27017" dir=in action=block protocol=TCP localport=27017',
        "is_noise": False,
    },
    5900: {
        "threat_level": "HIGH",
        "service_name": "VNC Desktop Sharing",
        "threat_title": "VNC Weak DES Authentication & Screen Spying",
        "cve_id": "CWE-287 - Improper Authentication",
        "cvss_score": 8.0,
        "mitre_technique": "T1021.005 - VNC Protocol",
        "attack_vector": "Legacy 8-character DES password scheme susceptible to rapid brute-forcing and unencrypted screen stream sniffing.",
        "potential_impact": "Live screen monitoring, keystroke logging, and remote mouse hijacking.",
        "remediation": "Tunnel VNC sessions exclusively over encrypted SSH tunnels or corporate VPNs.",
        "firewall_cmd": 'netsh advfirewall firewall add rule name="AURA_BLOCK_VNC_5900" dir=in action=block protocol=TCP localport=5900',
        "is_noise": False,
    },
    4444: {
        "threat_level": "CRITICAL",
        "service_name": "Metasploit / Reverse TCP Shell",
        "threat_title": "Active Reverse Shell / C2 Backdoor Listener",
        "cve_id": "MITRE T1059 - Command and Scripting Interpreter",
        "cvss_score": 9.9,
        "mitre_technique": "T1059 / T1071 - Command & Control Ingress",
        "attack_vector": "Rogue interactive reverse shell connection detected. Allows remote adversary to execute arbitrary system commands with host privileges.",
        "potential_impact": "Complete host takeover, ransomware deployment, credential theft.",
        "remediation": "Immediately terminate host PID and quarantine offending binary.",
        "firewall_cmd": 'netsh advfirewall firewall add rule name="AURA_BLOCK_REVERSESHELL_4444" dir=in action=block protocol=TCP localport=4444',
        "is_noise": False,
    },
}

def classify_port_threat(port: int, host: str, process: str) -> dict:
    """Classifies an open port into deep threat intelligence and detects benign ephemeral noise."""
    # 1. Known high risk signatures catalog
    if port in ADVANCED_PORT_THREAT_CATALOG:
        return ADVANCED_PORT_THREAT_CATALOG[port]

    # 2. Relational and key-value databases
    if port in (3306, 5432, 1433, 1521):
        db_names = {3306: "MySQL", 5432: "PostgreSQL", 1433: "MS SQL Server", 1521: "Oracle DB"}
        svc = db_names.get(port, "Database")
        is_loopback = host in ("127.0.0.1", "::1", "localhost")
        return {
            "threat_level": "MEDIUM" if is_loopback else "HIGH",
            "service_name": f"{svc} Database",
            "threat_title": f"{svc} Enterprise Database Listener",
            "cve_id": "CWE-284 - Improper Access Control",
            "cvss_score": 5.2 if is_loopback else 8.4,
            "mitre_technique": "T1190 - Exploit Public-Facing Application",
            "attack_vector": f"Active {svc} listener exposed. " + ("Bound to loopback." if is_loopback else "Vulnerable to remote password brute-forcing and SQL injection pivot from external network!"),
            "potential_impact": "Database extraction, unauthorized record manipulation, data leakage.",
            "remediation": "Enforce strong authentication, disable remote root, and apply firewall binding to 127.0.0.1.",
            "firewall_cmd": f'netsh advfirewall firewall add rule name="AURA_BLOCK_{svc}_{port}" dir=in action=block protocol=TCP localport={port}',
            "is_noise": False,
        }

    # 3. Web & Application daemons
    if port == 80:
        return {
            "threat_level": "MEDIUM",
            "service_name": "HTTP Web Server",
            "threat_title": "Unencrypted HTTP Plaintext Protocol",
            "cve_id": "CWE-319 - Cleartext Data Transport",
            "cvss_score": 6.5,
            "mitre_technique": "T1040 - Network Sniffing",
            "attack_vector": "HTTP traffic is unencrypted. Attackers on shared campus Wi-Fi can capture session cookies and inject malicious payloads.",
            "potential_impact": "Session hijacking and credential interception via MITM attacks.",
            "remediation": "Upgrade all services to HTTPS (TLS 1.3 on port 443) and enforce HSTS headers.",
            "firewall_cmd": 'netsh advfirewall firewall add rule name="AURA_BLOCK_HTTP_80" dir=in action=block protocol=TCP localport=80',
            "is_noise": False,
        }

    if port == 22:
        return {
            "threat_level": "MEDIUM",
            "service_name": "SSH Remote Terminal",
            "threat_title": "Secure Shell Daemon Exposure",
            "cve_id": "MITRE T1110.001 - Password Guessing",
            "cvss_score": 6.2,
            "mitre_technique": "T1021.004 - SSH Protocol",
            "attack_vector": "Automated reconnaissance botnets continuously spray dictionary passwords against exposed port 22.",
            "potential_impact": "Unauthorized terminal access if weak credentials exist.",
            "remediation": "Disable password authentication, enforce SSH ed25519 keys, and activate fail2ban rate-limiting.",
            "firewall_cmd": 'netsh advfirewall firewall add rule name="AURA_BLOCK_SSH_22" dir=in action=block protocol=TCP localport=22',
            "is_noise": False,
        }

    if port in (3000, 5000, 8000, 8080, 8888, 9000):
        return {
            "threat_level": "MEDIUM",
            "service_name": f"App/Dev Server (Port {port})",
            "threat_title": "Development REST API / Staging Endpoint",
            "cve_id": "CWE-215 - Info Exposure via Debug Interface",
            "cvss_score": 5.8,
            "mitre_technique": "T1046 - Network Service Scanning",
            "attack_vector": "Application frameworks in development mode may leak stack traces, debug credentials, or internal REST APIs.",
            "potential_impact": "Internal application logic leakage and backend environment compromise.",
            "remediation": "Ensure debug mode is disabled and credentials are not hardcoded in development builds.",
            "firewall_cmd": f'netsh advfirewall firewall add rule name="AURA_BLOCK_APP_{port}" dir=in action=block protocol=TCP localport={port}',
            "is_noise": False,
        }

    if port == 443:
        return {
            "threat_level": "LOW",
            "service_name": "HTTPS Encrypted Web",
            "threat_title": "Encrypted Web TLS Endpoint",
            "cve_id": "N/A (Encrypted Standard)",
            "cvss_score": 2.1,
            "mitre_technique": "T1071.001 - Web Protocols",
            "attack_vector": "Standard encrypted transport. Low attack surface when patched with modern TLS ciphers.",
            "potential_impact": "Minimal when certificates are valid.",
            "remediation": "Ensure modern TLS 1.3 cipher suites and valid SSL certificate authority chains.",
            "firewall_cmd": 'netsh advfirewall firewall add rule name="AURA_BLOCK_HTTPS_443" dir=in action=block protocol=TCP localport=443',
            "is_noise": False,
        }

    if port == 5173:
        return {
            "threat_level": "LOW",
            "service_name": "AURA SOC Command UI",
            "threat_title": "AURA Sentinel Local Command Center",
            "cve_id": "N/A (Authorized Management)",
            "cvss_score": 1.5,
            "mitre_technique": "Authorized Management",
            "attack_vector": "Platform management user interface. Intended for local security operator access.",
            "potential_impact": "Authorized operational interface.",
            "remediation": "Operational service. Keep monitored.",
            "firewall_cmd": 'netsh advfirewall firewall add rule name="AURA_BLOCK_UI_5173" dir=in action=block protocol=TCP localport=5173',
            "is_noise": False,
        }

    # 4. Ephemeral & Low-value system background noise ("Bekar" ports)
    proc_lower = (process or "").lower()
    if port >= 49152 or ("svchost" in proc_lower and port > 1024) or ("system" in proc_lower and port > 10000):
        return {
            "threat_level": "NOISE",
            "service_name": "Dynamic System RPC",
            "threat_title": "Harmless Dynamic OS Loopback",
            "cve_id": "N/A (Benign System Noise)",
            "cvss_score": 0.0,
            "mitre_technique": "Internal Windows RPC",
            "attack_vector": "Dynamic high port allocated by Windows kernel for internal IPC. Zero inbound vulnerability from external networks.",
            "potential_impact": "None. Harmless background OS noise.",
            "remediation": "Automatically filtered from active threat calculations to maintain clean SOC telemetry.",
            "firewall_cmd": f'netsh advfirewall firewall add rule name="AURA_BLOCK_NOISE_{port}" dir=in action=block protocol=TCP localport={port}',
            "is_noise": True,
        }

    return {
        "threat_level": "LOW",
        "service_name": f"Daemon ({process or 'Socket'})",
        "threat_title": f"Generic Local Daemon (Port {port})",
        "cve_id": "Generic Socket",
        "cvss_score": 3.2,
        "mitre_technique": "T1046 - Network Scanning",
        "attack_vector": f"Standard socket connection bound to {host}:{port}.",
        "potential_impact": "Low. Continuous passive monitoring.",
        "remediation": "Verify service necessity and enforce least-privilege host binding.",
        "firewall_cmd": f'netsh advfirewall firewall add rule name="AURA_BLOCK_PORT_{port}" dir=in action=block protocol=TCP localport={port}',
        "is_noise": False,
    }

# ==========================================
# ACTIVE DEFENSE PORT REMEDIATION ENGINE (SIH26105)
# ==========================================

# Tracks ports actively mitigated/blocked by AURA Sentinel
# Format: { port: { "method": str, "timestamp": float, "rule_name": str, "pid": int, "details": str } }
MITIGATED_PORTS = {}
DEMO_BACKDOOR_PROCESS = None

class PortRemediationRequest(BaseModel):
    port: int
    pid: Optional[int] = None
    process_name: Optional[str] = "Unknown"
    action: str = "AUTO"  # "AUTO" | "FIREWALL_BLOCK" | "KILL_PROCESS" | "RESTORE" | "SPAWN_DEMO" | "KILL_DEMO"

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

            classification = classify_port_threat(conn.laddr.port, conn.laddr.ip, process_name)
            is_mitigated = conn.laddr.port in MITIGATED_PORTS
            mitigation_info = MITIGATED_PORTS.get(conn.laddr.port)

            threat_lvl = "SHIELDED" if is_mitigated else classification["threat_level"]
            cvss = 0.0 if is_mitigated else classification.get("cvss_score", 0.0)

            connections.append({
                "port": conn.laddr.port,
                "host": conn.laddr.ip,
                "pid": conn.pid,
                "process": process_name,
                "status": "SHIELDED" if is_mitigated else "LISTENING",
                "threat_level": threat_lvl,
                "service_name": classification["service_name"],
                "threat_title": classification.get("threat_title", "Network Listener"),
                "cve_id": classification.get("cve_id", "N/A"),
                "cvss_score": cvss,
                "mitre_technique": classification.get("mitre_technique", "N/A"),
                "attack_vector": classification.get("attack_vector", classification.get("description", "")),
                "potential_impact": classification.get("potential_impact", ""),
                "description": classification.get("description", classification.get("attack_vector", "")),
                "remediation": classification["remediation"],
                "firewall_cmd": classification.get("firewall_cmd", ""),
                "is_noise": False if is_mitigated else classification["is_noise"],
                "is_mitigated": is_mitigated,
                "mitigation_info": mitigation_info,
            })

        except (psutil.AccessDenied, OSError):
            continue

    # Severity priority order: CRITICAL (0) -> HIGH (1) -> MEDIUM (2) -> LOW (3) -> NOISE (4) -> SHIELDED (5)
    severity_order = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3, "NOISE": 4, "SHIELDED": 5}
    connections.sort(key=lambda c: (severity_order.get(c["threat_level"], 6), -c.get("cvss_score", 0), c["port"]))

    threat_count = sum(1 for c in connections if c["threat_level"] in ("CRITICAL", "HIGH") and not c.get("is_mitigated"))
    noise_count = sum(1 for c in connections if c["is_noise"])
    mitigated_count = len(MITIGATED_PORTS)

    # Calculate dynamic attack surface risk score (0-100)
    risk_score = min(100, max(5, int(15 + (threat_count * 18) + (len(connections) - noise_count - mitigated_count) * 2)))

    demo_running = bool(DEMO_BACKDOOR_PROCESS and DEMO_BACKDOOR_PROCESS.get("proc") and DEMO_BACKDOOR_PROCESS["proc"].poll() is None)

    return {
        "total_open_ports": len(connections),
        "threat_ports_count": threat_count,
        "noise_ports_count": noise_count,
        "mitigated_ports_count": mitigated_count,
        "monitored_ports_count": len(connections) - noise_count,
        "attack_surface_risk_score": risk_score,
        "demo_threat_active": demo_running,
        "ports": connections,
    }

@app.post("/api/attack-surface/remediate")
def remediate_attack_surface_port(request: PortRemediationRequest):
    global DEMO_BACKDOOR_PROCESS
    port = request.port
    pid = request.pid
    proc_name = request.process_name or "Unknown"
    action = request.action.upper()
    now = time.time()
    rule_name = f"AURA_BLOCK_PORT_{port}"

    # 1. Spawn Demo Threat (Port 4444 Backdoor)
    if action == "SPAWN_DEMO":
        try:
            MITIGATED_PORTS.pop(4444, None)
            try:
                subprocess.run('netsh advfirewall firewall delete rule name="AURA_BLOCK_PORT_4444"', shell=True, capture_output=True)
            except Exception:
                pass

            if DEMO_BACKDOOR_PROCESS and DEMO_BACKDOOR_PROCESS.get("proc"):
                try:
                    DEMO_BACKDOOR_PROCESS["proc"].kill()
                except Exception:
                    pass
            code = "import socket, time; s = socket.socket(); s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1); s.bind(('0.0.0.0', 4444)); s.listen(5); time.sleep(3600)"
            proc = subprocess.Popen([sys.executable, "-c", code], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            DEMO_BACKDOOR_PROCESS = {"proc": proc, "port": 4444, "pid": proc.pid}

            db.log_event(
                event_type="ATTACK_SURFACE",
                severity="CRITICAL",
                title="Simulated Reverse Shell Backdoor Spawned",
                description=f"Rogue listener bound on port 4444 (PID {proc.pid}) for SIH demonstration.",
                source="WARGAME_ENGINE"
            )
            return {
                "status": "SPAWNED",
                "port": 4444,
                "pid": proc.pid,
                "message": f"Simulated Rogue Backdoor spawned on Port 4444 (PID {proc.pid}). Live detection active!"
            }
        except Exception as e:
            return {"status": "ERROR", "message": str(e)}

    # 2. Restore / Unblock Port
    if action == "RESTORE":
        if port in MITIGATED_PORTS:
            MITIGATED_PORTS.pop(port, None)
        try:
            subprocess.run(f'netsh advfirewall firewall delete rule name="{rule_name}"', shell=True, capture_output=True)
        except Exception:
            pass

        # Mine unblock action to blockchain
        blockchain_ledger.mine_block("PORT_RESTORED", {
            "port": port,
            "rule_name": rule_name,
            "action": "RESTORE_INSPECTION",
            "timestamp": now,
        })
        db.log_event(
            event_type="DEFENSE",
            severity="INFO",
            title=f"Port {port} Shield Removed",
            description=f"Port {port} perimeter block deleted. Sockets restored to standard telemetry.",
            source="AURA_AUTONOMOUS"
        )
        return {"status": "RESTORED", "port": port, "message": f"Port {port} unblocked. Telemetry restored."}

    # Auto-resolve PID if missing or 0
    if not pid:
        if DEMO_BACKDOOR_PROCESS and DEMO_BACKDOOR_PROCESS.get("port") == port:
            pid = DEMO_BACKDOOR_PROCESS.get("pid")
        else:
            try:
                for c in psutil.net_connections(kind="inet"):
                    if c.laddr and c.laddr.port == port and c.pid:
                        pid = c.pid
                        break
            except Exception:
                pass

    if pid and (not proc_name or proc_name == "Unknown"):
        try:
            proc_name = psutil.Process(pid).name()
        except Exception:
            pass

    # 3. Kill Process (for user/application processes)
    proc_lower = (proc_name or "").lower()
    is_protected_kernel = (pid is not None and pid <= 4) or "system" in proc_lower or "svchost" in proc_lower or pid == os.getpid()

    if action in ("KILL_PROCESS", "TERMINATE") and not is_protected_kernel and pid:
        try:
            p = psutil.Process(pid)
            p_name = p.name()
            p.terminate()
            try:
                p.wait(timeout=1.5)
            except psutil.TimeoutExpired:
                p.kill()

            if DEMO_BACKDOOR_PROCESS and DEMO_BACKDOOR_PROCESS.get("pid") == pid:
                DEMO_BACKDOOR_PROCESS = None

            MITIGATED_PORTS.pop(port, None)

            db.record_mitigation(
                action_type="KILL_PROCESS",
                target=f"Port {port} (PID {pid} - {p_name})",
                details="Direct process termination executed by AURA Threat Remediation.",
                operator="AURA_AUTONOMOUS",
                status="TERMINATED"
            )
            blockchain_ledger.mine_block("PROCESS_TERMINATION", {
                "port": port,
                "pid": pid,
                "process_name": p_name,
                "remediation": "SIGKILL_EXECUTION",
                "timestamp": now
            })
            db.log_event(
                event_type="PROCESS",
                severity="SUCCESS",
                title=f"Rogue Process Terminated: {p_name}",
                description=f"PID {pid} listening on port {port} has been killed.",
                source="AURA_AUTONOMOUS"
            )
            return {
                "status": "TERMINATED",
                "port": port,
                "pid": pid,
                "method": "SIGKILL",
                "message": f"Process '{p_name}' (PID {pid}) terminated successfully. Socket closed."
            }
        except Exception as e:
            return {"status": "ERROR", "message": f"Process kill failed: {str(e)}"}

    # 4. Host Firewall Perimeter Block (for Kernel/System services like 445 SMB, 135 RPC, 139 NetBIOS, or AUTO/TERMINATE)
    firewall_cmd = f'netsh advfirewall firewall add rule name="{rule_name}" dir=in action=block protocol=TCP localport={port}'
    fw_executed = False
    fw_output = ""
    try:
        res = subprocess.run(firewall_cmd, shell=True, capture_output=True, text=True)
        fw_output = res.stdout.strip() or res.stderr.strip()
        if res.returncode == 0:
            fw_executed = True
    except Exception as e:
        fw_output = str(e)

    MITIGATED_PORTS[port] = {
        "timestamp": now,
        "rule_name": rule_name,
        "pid": pid,
        "process": proc_name,
        "method": "FIREWALL_INBOUND_BLOCK",
        "elevation_confirmed": fw_executed,
        "firewall_cmd": firewall_cmd,
    }

    db.record_mitigation(
        action_type="FIREWALL_BLOCK",
        target=f"Port {port} ({proc_name})",
        details=f"Inbound TCP block deployed. Target was {'Windows Kernel PID 4 (BSOD Protected)' if is_protected_kernel else 'Application Service'}.",
        operator="AURA_AUTONOMOUS",
        status="BLOCKED"
    )
    blockchain_ledger.mine_block("PORT_REMEDIATION", {
        "port": port,
        "pid": pid,
        "process": proc_name,
        "rule_name": rule_name,
        "method": "FIREWALL_INBOUND_BLOCK",
        "timestamp": now
    })
    db.log_event(
        event_type="SHIELD",
        severity="SUCCESS",
        title=f"Threat Neutralized: Port {port} Blocked",
        description=f"Inbound traffic blocked for Port {port} ({proc_name}). Cryptographic audit block sealed.",
        source="AURA_AUTONOMOUS"
    )

    reason = "Target is Windows NT Kernel (System/RPC). Direct SIGKILL safely redirected to Inbound Host Firewall termination to prevent OS crash (BSOD)." if is_protected_kernel else "Inbound perimeter block rule deployed."

    return {
        "status": "TERMINATED" if action in ("TERMINATE", "KILL_PROCESS") else "NEUTRALIZED",
        "port": port,
        "pid": pid,
        "method": "PERIMETER_TERMINATION" if action in ("TERMINATE", "KILL_PROCESS") else "FIREWALL_INBOUND_BLOCK",
        "rule_name": rule_name,
        "firewall_cmd": firewall_cmd,
        "elevation_confirmed": fw_executed,
        "reason": reason,
        "message": f"Threat on Port {port} successfully {'TERMINATED' if action in ('TERMINATE', 'KILL_PROCESS') else 'NEUTRALIZED'}. Inbound socket blocked & logged to Blockchain Ledger."
    }

# ==============================================================================
# DANGER PORT TERMINATION ENGINE (AUTONOMOUS KILL & SHIELD)
# ==============================================================================

class TerminateDangerPortsRequest(BaseModel):
    ports: Optional[List[int]] = None  # None = Scan & terminate all active danger ports
    force_kill: Optional[bool] = False  # If True, aggressively kills application PIDs

@app.post("/api/attack-surface/terminate-danger-ports")
def terminate_danger_ports(request: Optional[TerminateDangerPortsRequest] = None):
    """
    Scans all listening sockets, detects active high/critical danger ports,
    and terminates rogue processes or deploys host perimeter firewall rules safely.
    """
    global DEMO_BACKDOOR_PROCESS
    now = time.time()
    current_pid = os.getpid()

    # List of known critical & high threat ports to eliminate
    CRITICAL_DANGER_PORTS = {
        4444: "Metasploit / Reverse TCP Shell",
        1337: "Elite Backdoor Listener",
        31337: "Back Orifice Trojan C2",
        6667: "IRC Botnet C2 Channel",
        5555: "Exposed Rogue ADB Daemon",
        23: "Cleartext Telnet Terminal",
        21: "Plaintext FTP Daemon",
        445: "SMBv1/v2 Lateral Propagation",
        135: "MS-RPC Remote Endpoint Mapper",
        139: "NetBIOS Session Spoofing",
        3389: "RDP Remote Desktop Exposure",
        5900: "VNC Desktop Hijack Listener",
        6379: "Unauthenticated Redis Database",
        27017: "Exposed MongoDB Database",
    }

    # AURA internal protected ports that must never be terminated
    SAFE_SYSTEM_PORTS = {8000, 5173, 5174}

    target_ports_filter = set(request.ports) if (request and request.ports) else None

    terminated_list = []
    shielded_list = []
    skipped_list = []
    scanned_count = 0

    try:
        connections = psutil.net_connections(kind="inet")
    except Exception as e:
        return {"status": "ERROR", "message": f"Failed to inspect network sockets: {str(e)}"}

    for conn in connections:
        if conn.status != psutil.CONN_LISTEN or not conn.laddr:
            continue

        port = conn.laddr.port
        pid = conn.pid
        scanned_count += 1

        # Skip safe AURA internal ports
        if port in SAFE_SYSTEM_PORTS:
            continue

        # Check if port matches danger signatures
        is_in_danger_catalog = port in CRITICAL_DANGER_PORTS or port in ADVANCED_PORT_THREAT_CATALOG
        if target_ports_filter is not None:
            should_terminate = port in target_ports_filter
        else:
            should_terminate = is_in_danger_catalog

        if not should_terminate:
            continue

        service_info = CRITICAL_DANGER_PORTS.get(
            port, 
            ADVANCED_PORT_THREAT_CATALOG.get(port, {}).get("service_name", f"Danger Port {port}")
        )

        proc_name = "Unknown"
        if pid:
            try:
                proc_name = psutil.Process(pid).name()
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                proc_name = "Unknown"

        proc_lower = proc_name.lower()
        is_protected_kernel = (
            pid is None 
            or pid <= 4 
            or pid == current_pid 
            or "system" in proc_lower 
            or "svchost" in proc_lower
        )

        # -------------------------------------------------------------
        # Action 1: Kill User-Space Rogue Process (e.g. Backdoor, Reverse Shell)
        # -------------------------------------------------------------
        if not is_protected_kernel and pid:
            try:
                proc = psutil.Process(pid)
                actual_name = proc.name()
                proc.terminate()
                try:
                    proc.wait(timeout=1.5)
                except psutil.TimeoutExpired:
                    proc.kill()

                # Clean up demo backdoor reference if matched
                if DEMO_BACKDOOR_PROCESS and DEMO_BACKDOOR_PROCESS.get("pid") == pid:
                    DEMO_BACKDOOR_PROCESS = None

                # Log to SQLite DB
                try:
                    db.record_mitigation(
                        action_type="KILL_PROCESS",
                        target=f"Port {port} (PID {pid} - {actual_name})",
                        details=f"Terminated rogue process bound to danger port {port} ({service_info}).",
                        operator="AURA_AUTONOMOUS_HUNTER",
                        status="TERMINATED"
                    )
                    db.log_event(
                        event_type="PROCESS",
                        severity="SUCCESS",
                        title=f"Danger Port Killed: :{port}",
                        description=f"Process '{actual_name}' (PID {pid}) on danger port {port} was successfully killed.",
                        source="DANGER_PORT_HUNTER"
                    )
                except Exception:
                    pass

                # Mine block into Blockchain Ledger
                try:
                    blockchain_ledger.mine_block("DANGER_PORT_TERMINATED", {
                        "port": port,
                        "pid": pid,
                        "service": service_info,
                        "process_name": actual_name,
                        "method": "SIGKILL",
                        "timestamp": now,
                    })
                except Exception:
                    pass

                terminated_list.append({
                    "port": port,
                    "pid": pid,
                    "process_name": actual_name,
                    "service": service_info,
                    "action": "SIGKILL_TERMINATED",
                })
                continue

            except psutil.NoSuchProcess:
                skipped_list.append({"port": port, "reason": "Process exited before SIGKILL"})
                continue
            except Exception as err:
                skipped_list.append({"port": port, "pid": pid, "reason": f"Kill error: {str(err)}"})

        # -------------------------------------------------------------
        # Action 2: Protected System Service -> Inbound Firewall Shield
        # -------------------------------------------------------------
        rule_name = f"AURA_BLOCK_DANGER_PORT_{port}"
        firewall_cmd = f'netsh advfirewall firewall add rule name="{rule_name}" dir=in action=block protocol=TCP localport={port}'
        fw_success = False

        try:
            res = subprocess.run(firewall_cmd, shell=True, capture_output=True, text=True)
            if res.returncode == 0:
                fw_success = True
        except Exception:
            pass

        MITIGATED_PORTS[port] = {
            "timestamp": now,
            "rule_name": rule_name,
            "pid": pid,
            "process": proc_name,
            "method": "FIREWALL_INBOUND_BLOCK",
            "elevation_confirmed": fw_success,
            "firewall_cmd": firewall_cmd,
        }

        # Log to Database
        try:
            db.record_mitigation(
                action_type="FIREWALL_BLOCK",
                target=f"Port {port} ({proc_name})",
                details=f"Inbound firewall block applied to danger port {port} ({service_info}). Direct SIGKILL bypassed to avoid OS crash.",
                operator="AURA_AUTONOMOUS_HUNTER",
                status="BLOCKED"
            )
            db.log_event(
                event_type="SHIELD",
                severity="SUCCESS",
                title=f"Danger Port Shielded: :{port}",
                description=f"Inbound firewall perimeter drop rule enforced for danger port {port} ({proc_name}).",
                source="DANGER_PORT_HUNTER"
            )
        except Exception:
            pass

        # Mine block into Blockchain Ledger
        try:
            blockchain_ledger.mine_block("DANGER_PORT_SHIELDED", {
                "port": port,
                "pid": pid,
                "service": service_info,
                "rule_name": rule_name,
                "method": "FIREWALL_DROP",
                "timestamp": now,
            })
        except Exception:
            pass

        shielded_list.append({
            "port": port,
            "pid": pid,
            "process_name": proc_name,
            "service": service_info,
            "action": "FIREWALL_RULE_APPLIED",
            "rule_name": rule_name,
        })

    return {
        "status": "COMPLETED",
        "total_listening_scanned": scanned_count,
        "terminated_count": len(terminated_list),
        "shielded_count": len(shielded_list),
        "terminated_processes": terminated_list,
        "shielded_services": shielded_list,
        "skipped": skipped_list,
        "timestamp": now,
        "message": f"Remediation finished: {len(terminated_list)} rogue processes terminated, {len(shielded_list)} system ports shielded via Firewall."
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
    resp = build_investment_response(
        monthly_budget=data.monthly_budget,
        systems=data.systems,
        data_value=data.data_value,
        business_type=data.business_type,
    )
    try:
        rec_plan = resp.get("recommended_plan", {})
        blockchain_ledger.mine_block(
            event_type="INVESTMENT_OPTIMIZATION",
            data={
                "business_type": data.business_type,
                "monthly_budget_inr": data.monthly_budget,
                "systems_count": data.systems,
                "data_value_inr": data.data_value,
                "recommended_plan": rec_plan.get("name", "Custom Defense"),
                "projected_risk_reduction_pct": rec_plan.get("risk_reduction", 0),
                "expected_annual_savings_inr": rec_plan.get("savings", 0),
                "rosi_roi_pct": rec_plan.get("rosi", 0),
            },
        )
    except Exception as e:
        print(f"Blockchain auto-mine error: {e}")
    return resp


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

    # Cryptographically seal quarantine action in Blockchain ledger
    quarantined_success = [r for r in results if r.get("status") == "QUARANTINED"]
    if quarantined_success:
        try:
            blockchain_ledger.mine_block(
                event_type="THREAT_QUARANTINE",
                data={
                    "quarantined_files_count": len(quarantined_success),
                    "file_names": [Path(r["path"]).name for r in quarantined_success],
                    "vault_target": QUARANTINE_FOLDER,
                    "action": "AUTOMATED_CONTAINMENT_SEAL",
                },
            )
        except Exception as e:
            print(f"Blockchain quarantine log error: {e}")

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
    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 1280)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 720)
    if not cap.isOpened():
        print("Camera device not accessible")
        return
    
    try:
        while True:
            success, frame = cap.read()
            if not success:
                break

            # Flip horizontally for natural mirror feel
            frame = cv2.flip(frame, 1)

            # YOLO Person Detection
            results = yolo_model(frame, verbose=False, classes=[0]) #type: ignore
            rects = []

            for result in results:
                for box in result.boxes: #type:ignore
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    rects.append((x1, y1, x2, y2))

            # Centroid tracker update (AI Tracking Engine)
            tracked_entities = vision_tracker.update(rects)
            operator_present = len(tracked_entities) > 0

            # Update Presence & Auto-Lock
            presence_info = presence_lock_engine.update(operator_present)
            if presence_info.get("should_lock"):
                try:
                    db.log_event(
                        event_type="ZERO_TRUST",
                        severity="CRITICAL",
                        title="Operator Absent - Zero Trust Lock",
                        description=f"Operator absent for {presence_lock_engine.grace_period}s. Workstation secured.",
                        source="VISION_INTELLIGENCE"
                    )
                except Exception:
                    pass

            # Hand Gesture & Mouse Automation Processing
            if gesture_controller.enabled:
                try:
                    frame = gesture_controller.process_frame(frame)
                    if gesture_controller.active_gesture not in ("NONE", "SEARCHING"):
                        presence_lock_engine.last_seen_time = time.time()
                except Exception:
                    pass

            # Draw bounding boxes & ID label
            for entity in tracked_entities:
                x1, y1, x2, y2 = entity["bbox"]
                obj_id = entity["id"]
                dwell = entity["dwell_time"]

                cv2.rectangle(frame, (x1, y1), (x2, y2), (0, 200, 255), 2)
                label = f"Operator #{obj_id} [{dwell:.0f}s]"
                cv2.putText(frame, label, (x1, max(20, y1 - 8)),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.55, (0, 200, 255), 2)

            h, w, _ = frame.shape

            # Top HUD Bar
            cv2.rectangle(frame, (0, 0), (w, 40), (10, 15, 25), -1)
            cv2.line(frame, (0, 40), (w, 40), (0, 240, 255), 1)

            status_label = f"AURA VISION AI | OPERATOR: {'ENGAGED' if operator_present else 'ABSENT'}"
            cv2.putText(frame, status_label, (15, 26),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 2)

            # Active Gesture Pill
            if gesture_controller.active_gesture not in ("NONE", "SEARCHING"):
                cv2.rectangle(frame, (w - 280, 6), (w - 10, 34), (0, 180, 255), -1)
                cv2.putText(frame, f"GESTURE: {gesture_controller.active_gesture}", (w - 270, 25),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (10, 15, 25), 2)

            # Operator Absence Countdown Warning
            if not operator_present and presence_lock_engine.enabled:
                countdown = presence_info.get("countdown", 0)
                banner_color = (0, 0, 255) if countdown <= 2 else (0, 140, 255)
                cv2.rectangle(frame, (w // 2 - 250, h // 2 - 35), (w // 2 + 250, h // 2 + 35), (10, 10, 30), -1)
                cv2.rectangle(frame, (w // 2 - 250, h // 2 - 35), (w // 2 + 250, h // 2 + 35), banner_color, 2)
                
                if presence_info.get("is_locked"):
                    alert_msg = "WORKSTATION LOCKED - ZERO TRUST TRIGGERED"
                else:
                    alert_msg = f"OPERATOR ABSENT! AUTO-LOCK IN {countdown}s"
                
                cv2.putText(frame, alert_msg, (w // 2 - 230, h // 2 + 8),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.6, banner_color, 2)

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


class VisionSettingsRequest(BaseModel):
    auto_lock_enabled: Optional[bool] = None
    grace_period_seconds: Optional[int] = None
    gesture_control_enabled: Optional[bool] = None


@app.get("/api/vision/settings")
def get_vision_settings():
    return {
        "auto_lock_enabled": presence_lock_engine.enabled,
        "grace_period_seconds": presence_lock_engine.grace_period,
        "gesture_control_enabled": gesture_controller.enabled,
        "is_locked": presence_lock_engine.is_locked,
        "total_locks_triggered": presence_lock_engine.total_locks_triggered,
        "active_gesture": gesture_controller.active_gesture,
    }


@app.post("/api/vision/settings")
def update_vision_settings(request: VisionSettingsRequest):
    if request.auto_lock_enabled is not None:
        presence_lock_engine.enabled = request.auto_lock_enabled
    if request.grace_period_seconds is not None:
        presence_lock_engine.grace_period = max(2, min(60, request.grace_period_seconds))
    if request.gesture_control_enabled is not None:
        gesture_controller.enabled = request.gesture_control_enabled

    return {
        "status": "SUCCESS",
        "settings": {
            "auto_lock_enabled": presence_lock_engine.enabled,
            "grace_period_seconds": presence_lock_engine.grace_period,
            "gesture_control_enabled": gesture_controller.enabled,
        }
    }


@app.post("/api/vision/lock-workstation")
def lock_workstation_now():
    success = presence_lock_engine.force_lock()
    try:
        db.log_event(
            event_type="ZERO_TRUST",
            severity="CRITICAL",
            title="Manual Operator Lockout Triggered",
            description="Workstation locked on command.",
            source="VISION_INTELLIGENCE"
        )
    except Exception:
        pass
    return {"status": "SUCCESS" if success else "FAILED", "is_locked": True}

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


# ==========================================
# BLOCKCHAIN AUDIT LEDGER ENDPOINTS (SIH26105)
# ==========================================

class MineBlockRequest(BaseModel):
    event_type: str
    data: dict

class TamperDemoRequest(BaseModel):
    block_index: Optional[int] = 1


@app.get("/api/blockchain/ledger")
def get_blockchain_ledger():
    """Returns full cryptographic audit ledger, blocks, and network status."""
    return blockchain_ledger.get_ledger_summary()


@app.get("/api/blockchain/verify")
def verify_blockchain_integrity():
    """Performs deep cryptographic verification across SHA-256 headers & Merkle trees."""
    return blockchain_ledger.verify_integrity()


@app.post("/api/blockchain/mine")
def mine_blockchain_block(request: MineBlockRequest):
    """Mines a new cryptographic block with Proof-of-Work and Merkle root."""
    new_block = blockchain_ledger.mine_block(request.event_type, request.data)
    return {
        "status": "SUCCESS",
        "message": f"Block #{new_block.index} ({request.event_type}) cryptographically sealed.",
        "block": new_block.to_dict(),
        "integrity": blockchain_ledger.verify_integrity(),
    }


@app.post("/api/blockchain/tamper-demo")
def tamper_blockchain_demo(request: TamperDemoRequest):
    """Simulates an insider attack altering financial records to test AURA tamper detection."""
    idx = request.block_index if request.block_index is not None else 1
    result = blockchain_ledger.simulate_tamper_attack(idx)
    integrity = blockchain_ledger.verify_integrity()
    return {
        **result,
        "integrity": integrity,
    }


@app.post("/api/blockchain/restore")
def restore_blockchain_consensus():
    """Restores the blockchain ledger to pristine state via consensus backup snapshot."""
    result = blockchain_ledger.restore_consensus()
    integrity = blockchain_ledger.verify_integrity()
    return {
        **result,
        "integrity": integrity,
        "ledger": blockchain_ledger.get_ledger_summary(),
    }


# ==========================================
# MODULE 11: FINANCIAL INTELLIGENCE & MARKET ANALYSIS (SIH26105)
# ==========================================

from services.market_data import market_data_service
from services.financial_engine import financial_engine
from Database.finance_models import (
    init_finance_db,
    SessionLocal,
    FinancialProfile,
    MarketSnapshot,
    AnalysisResult,
    SimulationResult,
)

# Initialize SQLAlchemy tables on startup
try:
    init_finance_db()
except Exception as e:
    print(f"Warning: Finance DB initialization exception: {e}")


class FinanceProfileRequest(BaseModel):
    investment_amount: float
    duration_years: int
    risk_profile: Literal["conservative", "moderate", "aggressive"]
    liquidity_requirement: Literal["low", "medium", "high"]
    goal: Literal["capital_preservation", "balanced_growth", "growth"]


class FinanceAnalyzeRequest(BaseModel):
    profile_id: Optional[int] = None
    investment_amount: Optional[float] = 50000.0
    duration_years: Optional[int] = 3
    risk_profile: Optional[Literal["conservative", "moderate", "aggressive"]] = "moderate"
    liquidity_requirement: Optional[Literal["low", "medium", "high"]] = "medium"
    goal: Optional[Literal["capital_preservation", "balanced_growth", "growth"]] = "balanced_growth"


class FinanceSimulateRequest(BaseModel):
    initial_amount: float
    duration_years: int
    selected_category: Optional[str] = "government_backed"
    historical_volatility: Optional[float] = None
    scenario_type: Optional[str] = "all"


@app.get("/api/finance/health")
def get_finance_health():
    """Reports market data provider status, mock/live mode, sync timestamp, and API availability."""
    provider_status = market_data_service.get_provider_status()
    db_status = "CONNECTED"
    try:
        sess = SessionLocal()
        sess.execute(__import__("sqlalchemy").text("SELECT 1"))
        sess.close()
    except Exception as e:
        db_status = f"ERROR: {str(e)}"

    return {
        **provider_status,
        "database_status": db_status,
        "service": "AURA Financial Intelligence & Market Analysis",
        "compliance_mode": "DECISION_SUPPORT_ONLY",
    }


@app.post("/api/finance/profile")
def save_finance_profile(request: FinanceProfileRequest):
    """Validates user financial preferences, persists to SQLAlchemy database, and returns normalized profile."""
    if request.investment_amount <= 0:
        return {"status": "ERROR", "message": "Investment amount must be a positive number greater than zero."}
    if request.duration_years < 1 or request.duration_years > 50:
        return {"status": "ERROR", "message": "Investment duration must be between 1 and 50 years."}

    session = SessionLocal()
    try:
        profile = FinancialProfile(
            investment_amount=float(request.investment_amount),
            duration_years=int(request.duration_years),
            risk_profile=request.risk_profile.lower(),
            liquidity_requirement=request.liquidity_requirement.lower(),
            goal=request.goal.lower(),
        )
        session.add(profile)
        session.commit()
        session.refresh(profile)
        profile_data = profile.to_dict()

        # Audit log in AURA core database
        try:
            db.log_event(
                event_type="FINANCE",
                severity="INFO",
                title="User Financial Profile Saved",
                description=f"Profile #{profile.id} registered: ₹{profile.investment_amount:,.2f} ({profile.duration_years}y, {profile.risk_profile}).",
                source="FINANCE_INTELLIGENCE"
            )
        except Exception:
            pass

        return {
            "status": "SUCCESS",
            "message": "Financial preferences normalized and persisted successfully.",
            "profile": profile_data,
        }
    except Exception as e:
        session.rollback()
        return {"status": "ERROR", "message": f"Database persistence failed: {str(e)}"}
    finally:
        session.close()


@app.get("/api/finance/market")
def get_finance_market_snapshot():
    """Returns structured snapshot of benchmark government securities vs market-linked instruments."""
    snapshot = market_data_service.get_market_snapshot()
    vol_data = market_data_service.get_market_volatility()
    price_changes = market_data_service.get_price_change()
    volume_data = market_data_service.get_volume_data()

    # Persist snapshot to database
    session = SessionLocal()
    try:
        record = MarketSnapshot(
            provider=snapshot["metadata"]["data_source"],
            is_mock=snapshot["metadata"]["is_mock"],
            snapshot_json=json.dumps(snapshot),
            volatility_index=float(snapshot["metadata"]["volatility_index"]),
        )
        session.add(record)
        session.commit()
    except Exception:
        session.rollback()
    finally:
        session.close()

    return {
        "status": "SUCCESS",
        **snapshot,
        "volatility_indicators": vol_data,
        "price_changes": price_changes,
        "liquidity_indicators": volume_data,
    }


@app.post("/api/finance/compare")
def compare_finance_categories(request: Optional[FinanceAnalyzeRequest] = None):
    """
    Compares Government Securities vs Market-Linked categories across risk, volatility, liquidity, and drawdown.
    Does not declare an automatic winner; highlights key trade-offs objectively.
    """
    snapshot = market_data_service.get_market_snapshot()
    gov = snapshot["government_category"]
    mkt = snapshot["market_category"]

    return {
        "status": "SUCCESS",
        "data_source": snapshot["metadata"]["data_source"],
        "is_mock": snapshot["metadata"]["is_mock"],
        "timestamp": snapshot["metadata"]["timestamp"],
        "comparison_title": "Government Securities vs. Market-Linked Instruments Comparison",
        "government_category": {
            "category_name": gov["category_name"],
            "description": gov["description"],
            "risk_profile": gov["risk_rating"],
            "credit_rating": gov["credit_rating"],
            "annualized_volatility": f"{gov['annualized_volatility_pct']}% (Low)",
            "benchmark_yield": f"{gov['benchmark_yield_pct']}% annualized",
            "liquidity_rating": gov["liquidity_rating"],
            "stability_score": gov["stability_score"],
            "max_historical_drawdown": f"{gov['max_historical_drawdown_pct']}%",
            "instruments": gov["instruments"],
        },
        "market_category": {
            "category_name": mkt["category_name"],
            "description": mkt["description"],
            "risk_profile": mkt["risk_rating"],
            "credit_rating": mkt["credit_rating"],
            "annualized_volatility": f"{mkt['annualized_volatility_pct']}% (Elevated)",
            "benchmark_return": f"{mkt['benchmark_annualized_return_pct']}% historical CAGR",
            "liquidity_rating": mkt["liquidity_rating"],
            "stability_score": mkt["stability_score"],
            "max_historical_drawdown": f"{mkt['max_historical_drawdown_pct']}%",
            "instruments": mkt["instruments"],
        },
        "analytical_summary": (
            "Government securities provide sovereign principal preservation with low volatility (~2.5%) "
            "and minimal historical drawdowns. Market-linked instruments offer cyclical appreciation potential "
            "accompanied by elevated volatility (~15.7%) and historical drawdowns (~28.4%). "
            "Decision depends on time horizon and risk tolerance."
        ),
        "compliance_disclaimer": "Historical performance does not guarantee future results. Final allocation decision remains with the user.",
    }


@app.post("/api/finance/analyze")
def analyze_finance_suitability(request: FinanceAnalyzeRequest):
    """
    Performs transparent suitability evaluation based on configurable weights:
    Risk Match (45%) + Stability (30%) + Liquidity (25%).
    Generates dynamic AI explanation derived from computed metrics.
    """
    profile_dict = request.dict()
    analysis = financial_engine.calculate_suitability(profile_dict)

    # Persist analysis result to SQLAlchemy
    session = SessionLocal()
    try:
        record = AnalysisResult(
            profile_id=request.profile_id,
            category="GOV_VS_MARKET_SUITABILITY",
            suitability_score=float(analysis["government_category"]["suitability_score"]),
            risk_match=float(analysis["government_category"]["risk_match"]),
            stability_score=float(analysis["government_category"]["stability_score"]),
            liquidity_score=float(analysis["government_category"]["liquidity_score"]),
            explanation=analysis["analytical_explanation"],
            breakdown_json=json.dumps(analysis["weights"]),
        )
        session.add(record)
        session.commit()
    except Exception:
        session.rollback()
    finally:
        session.close()

    return {
        "status": "SUCCESS",
        "profile_evaluated": profile_dict,
        **analysis,
    }


@app.post("/api/finance/simulate")
def simulate_finance_scenarios(request: FinanceSimulateRequest):
    """
    Executes scenario simulations (Conservative, Base, High-Volatility) over the specified time horizon.
    Clearly labeled with ILLUSTRATIVE SIMULATION badge.
    """
    if request.initial_amount <= 0:
        return {"status": "ERROR", "message": "Initial investment amount must be greater than zero."}
    if request.duration_years < 1 or request.duration_years > 40:
        return {"status": "ERROR", "message": "Simulation duration must be between 1 and 40 years."}

    sim = financial_engine.simulate_scenarios(
        initial_amount=request.initial_amount,
        duration_years=request.duration_years,
        category=request.selected_category or "government_backed",
        historical_volatility=request.historical_volatility,
    )

    # Persist simulation to database
    session = SessionLocal()
    try:
        rec = SimulationResult(
            initial_amount=float(request.initial_amount),
            duration_years=int(request.duration_years),
            category=request.selected_category or "government_backed",
            simulation_json=json.dumps(sim),
        )
        session.add(rec)
        session.commit()
    except Exception:
        session.rollback()
    finally:
        session.close()

    return {
        "status": "SUCCESS",
        **sim,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


