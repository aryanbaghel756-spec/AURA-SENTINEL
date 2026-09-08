from typing import List, Dict
import time

class ConversationMemory:
    """Manages short-term conversation context, token trimming, and memory purging."""
    def __init__(self, max_turns: int = 10):
        self.max_turns = max_turns
        self.history: List[Dict[str, str]] = []
        self.created_at = time.time()

    def add_turn(self, role: str, content: str):
        self.history.append({"role": role, "content": content})
        if len(self.history) > self.max_turns * 2:
            self.history = self.history[-(self.max_turns * 2):]

    def get_history(self) -> List[Dict[str, str]]:
        return self.history

    def clear(self):
        self.history = []
        self.created_at = time.time()
