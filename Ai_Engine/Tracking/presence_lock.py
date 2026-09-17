"""
AURA SENTINEL - Zero-Trust Operator Presence & Auto-Lock Engine (SIH26105)
Monitors continuous physical presence in front of the terminal camera.
If the registered operator leaves or is missing beyond the grace period,
instantly triggers Windows workstation lock (ctypes LockWorkStation) and logs SOC event.
"""

import time
import ctypes
from typing import Dict, Any, Optional

class PresenceAutoLockEngine:
    def __init__(self, grace_period_seconds: int = 5, enabled: bool = True):
        self.grace_period = grace_period_seconds
        self.enabled = enabled
        self.last_seen_time = time.time()
        self.is_locked = False
        self.total_locks_triggered = 0

    def update(self, operator_present: bool) -> Dict[str, Any]:
        """
        Updates presence status. If operator is absent beyond grace_period,
        locks the workstation immediately via Windows API.
        """
        now = time.time()

        if operator_present:
            self.last_seen_time = now
            self.is_locked = False
            return {
                "status": "OPERATOR_PRESENT",
                "seconds_away": 0.0,
                "countdown": self.grace_period,
                "should_lock": False,
                "is_locked": False,
            }

        seconds_away = now - self.last_seen_time
        countdown = max(0, int(self.grace_period - seconds_away))
        should_lock = self.enabled and (seconds_away >= self.grace_period) and not self.is_locked

        if should_lock:
            self.is_locked = True
            self.total_locks_triggered += 1
            try:
                # Native Windows Lock
                ctypes.windll.user32.LockWorkStation()
            except Exception as e:
                print(f"Workstation lock error: {e}")

        return {
            "status": "OPERATOR_AWAY",
            "seconds_away": round(seconds_away, 1),
            "countdown": countdown,
            "should_lock": should_lock,
            "is_locked": self.is_locked,
        }

    def force_lock(self) -> bool:
        """Manually trigger workstation lock."""
        try:
            ctypes.windll.user32.LockWorkStation()
            self.is_locked = True
            self.total_locks_triggered += 1
            return True
        except Exception as e:
            print(f"Force lock failed: {e}")
            return False
