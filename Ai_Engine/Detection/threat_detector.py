import time
from typing import List, Dict, Any, Optional
from .signatures import HIGH_RISK_PORTS, SUSPICIOUS_PROCESS_PATTERNS, ATTACK_SCENARIOS

class ThreatDetector:
    """
    Multi-vector Threat Detection Engine for AURA SENTINEL.
    Correlates open network ports, active process signatures, and attack scenarios.
    """

    def __init__(self):
        self.signatures = HIGH_RISK_PORTS
        self.process_patterns = SUSPICIOUS_PROCESS_PATTERNS

    def inspect_listening_ports(self, port_list: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Scans a list of open ports and flags those matching known vulnerable service signatures.
        """
        flagged_ports = []
        for p in port_list:
            port_num = p.get("port")
            if port_num in self.signatures:
                sig = self.signatures[port_num]
                flagged_ports.append({
                    "port": port_num,
                    "service": sig["service"],
                    "risk": sig["risk"],
                    "process": p.get("process", "Unknown"),
                    "host": p.get("host", "0.0.0.0"),
                    "description": sig["description"],
                    "remediation": sig["remediation"],
                })
        return flagged_ports

    def inspect_processes(self, processes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Inspects process names and telemetry for suspicious malware/crypto-mining signatures.
        """
        threats = []
        for proc in processes:
            name = (proc.get("name") or "").lower()
            cpu = proc.get("cpu_percent", 0)

            # Check known malicious names
            for pattern in self.process_patterns:
                if pattern in name:
                    threats.append({
                        "pid": proc.get("pid"),
                        "name": proc.get("name"),
                        "threat_type": "SUSPICIOUS_BINARY",
                        "severity": "CRITICAL",
                        "confidence": 0.95,
                        "details": f"Process matches known malicious pattern '{pattern}'.",
                        "recommended_action": "TERMINATE_PROCESS",
                    })
                    break

            # Heuristic check for extreme background CPU consumption (>90% for single process)
            if cpu > 90.0 and proc.get("pid") > 4:
                threats.append({
                    "pid": proc.get("pid"),
                    "name": proc.get("name"),
                    "threat_type": "COMPUTE_EXHAUSTION",
                    "severity": "WARNING",
                    "confidence": 0.75,
                    "details": f"Process '{proc.get('name')}' is consuming {cpu:.1f}% CPU capacity.",
                    "recommended_action": "INSPECT_PROCESS",
                })

        return threats

    def evaluate_attack_scenario(self, scenario_name: str) -> Dict[str, Any]:
        """
        Retrieves deep threat analysis and tactical countermeasures for an attack simulation.
        """
        key = scenario_name.lower().strip()
        scenario_data = ATTACK_SCENARIOS.get(key, ATTACK_SCENARIOS["brute_force"])
        return {
            "scenario": key.upper(),
            **scenario_data,
            "timestamp": time.time(),
        }
