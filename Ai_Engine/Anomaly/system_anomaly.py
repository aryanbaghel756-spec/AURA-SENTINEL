import time
import math
from typing import List, Dict, Any, Optional
from collections import deque

class SystemAnomalyDetector:
    """
    Statistical and heuristic anomaly detector for real-time operating system telemetry.
    Uses sliding window Z-scores, rate-of-change derivatives, and trend slopes.
    """

    def __init__(self, window_size: int = 30):
        self.window_size = window_size
        self.cpu_history = deque(maxlen=window_size)
        self.memory_history = deque(maxlen=window_size)
        self.port_history = deque(maxlen=window_size)
        self.timestamps = deque(maxlen=window_size)

    def record_snapshot(self, cpu: float, memory: float, open_ports: int, timestamp: Optional[float] = None):
        """Records a point in the time-series circular buffer."""
        ts = timestamp or time.time()
        self.cpu_history.append(float(cpu))
        self.memory_history.append(float(memory))
        self.port_history.append(int(open_ports))
        self.timestamps.append(ts)

    def _calculate_stats(self, values: deque) -> Dict[str, float]:
        if not values:
            return {"mean": 0.0, "std": 0.0}
        n = len(values)
        mean = sum(values) / n
        if n < 2:
            return {"mean": mean, "std": 1.0}
        variance = sum((x - mean) ** 2 for x in values) / (n - 1)
        return {"mean": mean, "std": math.sqrt(variance)}

    def detect_anomalies(
        self,
        current_cpu: float,
        current_mem: float,
        current_ports: int
    ) -> List[Dict[str, Any]]:
        """
        Evaluates current metrics against rolling baselines.
        Returns a list of detected anomalies.
        """
        anomalies = []
        now = time.time()

        # Update buffer with current observation
        self.record_snapshot(current_cpu, current_mem, current_ports, now)

        if len(self.cpu_history) >= 5:
            # 1. CPU Surge Anomaly (Z-Score + Surge Rate)
            cpu_stats = self._calculate_stats(self.cpu_history)
            cpu_std = max(cpu_stats["std"], 2.0)  # avoid division by zero
            cpu_z = (current_cpu - cpu_stats["mean"]) / cpu_std

            if current_cpu >= 80.0 and cpu_z > 2.0:
                severity = "CRITICAL" if current_cpu > 92.0 else "HIGH"
                anomalies.append({
                    "id": f"anom-cpu-{int(now)}",
                    "metric": "CPU_UTILIZATION",
                    "severity": severity,
                    "title": f"Sudden Compute Surge Detected ({current_cpu:.1f}%)",
                    "description": f"CPU is operating {cpu_z:.2f} standard deviations above the recent {cpu_stats['mean']:.1f}% baseline.",
                    "z_score": round(cpu_z, 2),
                    "current_val": current_cpu,
                    "baseline_mean": round(cpu_stats["mean"], 1),
                    "action": "Audit top resource consuming processes via SOC Process Watchdog.",
                })

            # 2. Memory Creep / Saturation Trend
            if len(self.memory_history) >= 6:
                recent_mem = list(self.memory_history)[-6:]
                # Check for continuous monotonically increasing trend (potential memory leak)
                is_increasing = all(recent_mem[i] <= recent_mem[i+1] for i in range(len(recent_mem)-1))
                mem_growth = recent_mem[-1] - recent_mem[0]

                if current_mem > 75.0 and is_increasing and mem_growth >= 3.0:
                    anomalies.append({
                        "id": f"anom-mem-{int(now)}",
                        "metric": "MEMORY_SATURATION",
                        "severity": "WARNING" if current_mem < 90.0 else "CRITICAL",
                        "title": f"Memory Creep Trend Detected (+{mem_growth:.1f}% surge)",
                        "description": f"RAM consumption is consistently climbing across consecutive telemetry ticks. Current usage: {current_mem:.1f}%.",
                        "z_score": 1.8,
                        "current_val": current_mem,
                        "baseline_mean": round(recent_mem[0], 1),
                        "action": "Inspect background service memory allocations for active memory leaks.",
                    })

            # 3. Port Expansion Anomaly
            port_stats = self._calculate_stats(self.port_history)
            port_std = max(port_stats["std"], 1.0)
            port_z = (current_ports - port_stats["mean"]) / port_std

            if current_ports > port_stats["mean"] + 3:
                anomalies.append({
                    "id": f"anom-ports-{int(now)}",
                    "metric": "ATTACK_SURFACE",
                    "severity": "WARNING",
                    "title": f"Unusual Inbound Sockets Detected (+{current_ports - int(port_stats['mean'])} ports)",
                    "description": f"Active listening sockets increased to {current_ports} (historical baseline: {port_stats['mean']:.1f}).",
                    "z_score": round(port_z, 2),
                    "current_val": current_ports,
                    "baseline_mean": round(port_stats["mean"], 1),
                    "action": "Inspect network daemon bindings with Attack Surface Radar.",
                })

        return anomalies
