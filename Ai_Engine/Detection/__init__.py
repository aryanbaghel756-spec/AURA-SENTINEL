"""
AURA SENTINEL - Threat Detection Package
Signatures and heuristic inspection for open network ports, attack scenarios, and processes.
"""

from .threat_detector import ThreatDetector
from .signatures import HIGH_RISK_PORTS, SUSPICIOUS_PROCESS_PATTERNS, ATTACK_SCENARIOS

__all__ = ["ThreatDetector", "HIGH_RISK_PORTS", "SUSPICIOUS_PROCESS_PATTERNS", "ATTACK_SCENARIOS"]
