import time
from typing import Dict, Any, List, Optional

class ThreatActorTracker:
    """
    Tracks remote IP threat actors across observation states:
    OBSERVED -> PROBING -> ATTACKING -> NEUTRALIZED.
    """

    def __init__(self):
        self.in_memory_actors: Dict[str, Dict[str, Any]] = {}

    def observe_activity(
        self,
        ip_address: str,
        activity_type: str,
        threat_points: int = 10,
        notes: str = ""
    ) -> Dict[str, Any]:
        """
        Updates the tracking profile of a threat actor IP.
        """
        now = time.time()
        if ip_address not in self.in_memory_actors:
            self.in_memory_actors[ip_address] = {
                "ip_address": ip_address,
                "threat_score": threat_points,
                "status": "OBSERVED",
                "first_seen": now,
                "last_seen": now,
                "hit_count": 1,
                "activities": [activity_type],
                "notes": notes,
            }
        else:
            actor = self.in_memory_actors[ip_address]
            actor["threat_score"] = min(actor["threat_score"] + threat_points, 100)
            actor["last_seen"] = now
            actor["hit_count"] += 1
            if activity_type not in actor["activities"]:
                actor["activities"].append(activity_type)

            # State transition
            if actor["status"] != "BLOCKED":
                if actor["threat_score"] >= 75:
                    actor["status"] = "ATTACKING"
                elif actor["threat_score"] >= 35:
                    actor["status"] = "PROBING"

        return self.in_memory_actors[ip_address]

    def block_actor(self, ip_address: str, reason: str = "IPTABLES autonomous rule") -> Dict[str, Any]:
        """Marks a threat actor as blocked/neutralized."""
        now = time.time()
        if ip_address in self.in_memory_actors:
            actor = self.in_memory_actors[ip_address]
            actor["status"] = "BLOCKED"
            actor["last_seen"] = now
            actor["notes"] = f"Blocked: {reason}"
            return actor
        else:
            actor = {
                "ip_address": ip_address,
                "threat_score": 100,
                "status": "BLOCKED",
                "first_seen": now,
                "last_seen": now,
                "hit_count": 1,
                "activities": ["ADMIN_BLOCK"],
                "notes": reason,
            }
            self.in_memory_actors[ip_address] = actor
            return actor

    def get_tracked_actors(self) -> List[Dict[str, Any]]:
        """Returns list of tracked threat actors ordered by severity."""
        return sorted(self.in_memory_actors.values(), key=lambda x: x["threat_score"], reverse=True)
