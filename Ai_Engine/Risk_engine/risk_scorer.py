from typing import Dict, Any, Optional
from ..config import AIEngineConfig

class RiskScorer:
    """
    Multi-dimensional Cyber Risk Scorer for AURA SENTINEL.
    Synthesizes processor load, memory pressure, storage utilization,
    and attack surface exposure into a unified 0-100 risk index.
    """

    def __init__(self, config: Optional[AIEngineConfig] = None):
        self.config = config or AIEngineConfig

    def calculate_technical_risk(
        self,
        cpu_percent: float,
        memory_percent: float,
        disk_percent: float,
        open_ports_count: int,
        active_anomalies_count: int = 0
    ) -> Dict[str, Any]:
        """
        Calculates normalized risk score and categorical classification.
        """
        score = 0
        breakdown = {}

        # 1. CPU Component (up to 25 pts)
        if cpu_percent > self.config.CPU_CRITICAL_THRESHOLD:
            cpu_pts = 25
        elif cpu_percent > self.config.CPU_HIGH_THRESHOLD:
            cpu_pts = 15
        elif cpu_percent > 60:
            cpu_pts = 8
        else:
            cpu_pts = 0
        score += cpu_pts
        breakdown["cpu_contribution"] = cpu_pts

        # 2. Memory Component (up to 25 pts)
        if memory_percent > self.config.MEM_CRITICAL_THRESHOLD:
            mem_pts = 25
        elif memory_percent > self.config.MEM_HIGH_THRESHOLD:
            mem_pts = 15
        elif memory_percent > 70:
            mem_pts = 8
        else:
            mem_pts = 0
        score += mem_pts
        breakdown["memory_contribution"] = mem_pts

        # 3. Disk Component (up to 20 pts)
        if disk_percent > 95:
            disk_pts = 20
        elif disk_percent > self.config.DISK_CRITICAL_THRESHOLD:
            disk_pts = 12
        elif disk_percent > 75:
            disk_pts = 6
        else:
            disk_pts = 0
        score += disk_pts
        breakdown["disk_contribution"] = disk_pts

        # 4. Attack Surface / Ports Component (up to 30 pts)
        if open_ports_count > 15:
            port_pts = 30
        elif open_ports_count > self.config.PORTS_ELEVATED_THRESHOLD:
            port_pts = 20
        elif open_ports_count > 3:
            port_pts = 10
        else:
            port_pts = 0
        score += port_pts
        breakdown["ports_contribution"] = port_pts

        # 5. Anomaly Penalty (up to 15 bonus pts)
        if active_anomalies_count > 0:
            anom_pts = min(active_anomalies_count * 5, 15)
            score += anom_pts
            breakdown["anomaly_contribution"] = anom_pts

        score = min(round(score), 100)

        # Classification
        if score >= 80:
            level = "CRITICAL"
        elif score >= 60:
            level = "HIGH"
        elif score >= 30:
            level = "MODERATE"
        elif score >= 15:
            level = "LOW"
        else:
            level = "NOMINAL"

        return {
            "risk_score": score,
            "risk_level": level,
            "breakdown": breakdown,
            "cpu_usage": round(cpu_percent, 1),
            "memory_usage": round(memory_percent, 1),
            "disk_usage": round(disk_percent, 1),
            "open_ports": open_ports_count,
        }

# Global singleton instance
risk_scorer = RiskScorer()
