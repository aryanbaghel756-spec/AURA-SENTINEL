from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional

class BaseLLMProvider(ABC):
    """Abstract Base Class for AURA LLM Providers (Groq, Ollama, HuggingFace, OpenAI)."""

    @abstractmethod
    def generate_chat_response(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.6,
        max_tokens: int = 350,
    ) -> Dict[str, Any]:
        """Generates a structured chat completion response."""
        pass
