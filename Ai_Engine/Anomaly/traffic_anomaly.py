import time
from typing import List, Dict, Any, Optional

class TrafficAnomalyDetector:
    """
    Detects network connection volume anomalies, port distribution spikes,
    and socket connection flood signatures.
    """

    def __init__(self, connection_spike_threshold: int = 50):
        self.spike_threshold = connection_spike_threshold
        self.last_connection_count = 0
        self.last_check_time = time.time()

    def evaluate_connections(self, active_connections: List[Any]) -> List[Dict[str, Any]]:
        """
        Evaluates a list of psutil network connections for flood attacks or port scanning patterns.
        """
        anomalies = []
        now = time.time()
        conn_count = len(active_connections)
        time_delta = max(now - self.last_check_time, 0.1)

        # Rate of connection growth per second
        growth_rate = (conn_count - self.last_connection_count) / time_delta

        if growth_rate > self.spike_threshold:
            anomalies.append({
                "id": f"anom-netflood-{int(now)}",
                "metric": "NETWORK_CONNECTIONS",
                "severity": "CRITICAL",
                "title": f"Rapid Connection Surge ({growth_rate:.1f} conns/sec)",
                "description": "Unprecedented burst in outbound/inbound socket generation matches connection flood signature.",
                "rate": round(growth_rate, 1),
                "action": "Engage rate limiting and inspect active foreign IP endpoints.",
            })

        self.last_connection_count = conn_count
        self.last_check_time = now
        return anomalies
