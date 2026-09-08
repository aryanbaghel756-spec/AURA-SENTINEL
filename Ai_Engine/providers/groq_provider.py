import json
from typing import List, Dict, Any
from groq import Groq
from .base import BaseLLMProvider
from ..config import AIEngineConfig

class GroqLLMProvider(BaseLLMProvider):
    def __init__(self, api_key: str = None, model: str = None):
        self.api_key = api_key or AIEngineConfig.GROQ_API_KEY
        self.model = model or AIEngineConfig.DEFAULT_MODEL
        self.client = Groq(api_key=self.api_key) if self.api_key else None

    def generate_chat_response(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.6,
        max_tokens: int = 350,
    ) -> Dict[str, Any]:
        if not self.client:
            return {
                "reply": "AURA neural core is offline. Please configure your GROQ_API_KEY in Backend/.env.",
                "action": None,
                "file_action": None,
            }

        try:
            completion = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=temperature,
                max_tokens=max_tokens,
            )
            raw = (completion.choices[0].message.content or "").strip()

            if raw.startswith("```"):
                raw = raw.strip("`")
                if raw.lower().startswith("json"):
                    raw = raw[4:].strip()

            parsed = json.loads(raw)
            return {
                "reply": parsed.get("reply", ""),
                "action": parsed.get("action"),
                "file_action": parsed.get("file_action"),
            }
        except json.JSONDecodeError:
            return {"reply": raw or "AURA parsed non-JSON output.", "action": None, "file_action": None}
        except Exception as err:
            return {"reply": "AURA core encountered an execution exception.", "action": None, "error": str(err)}
