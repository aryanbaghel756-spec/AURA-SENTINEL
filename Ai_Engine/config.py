import os
from dotenv import load_dotenv

load_dotenv()

class AIEngineConfig:
    GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
    DEFAULT_MODEL = "openai/gpt-oss-20b"
    FALLBACK_MODEL = "llama-3.3-70b-versatile"
    TEMPERATURE = 0.6
    MAX_TOKENS = 350

    # Risk Engine Default Weights
    CPU_HIGH_THRESHOLD = 75
    CPU_CRITICAL_THRESHOLD = 90
    MEM_HIGH_THRESHOLD = 80
    MEM_CRITICAL_THRESHOLD = 90
    DISK_CRITICAL_THRESHOLD = 85
    PORTS_ELEVATED_THRESHOLD = 8
