import os
from pydantic_settings import BaseSettings
from typing import List, Any
import json

class Settings(BaseSettings):
    PROJECT_NAME: str = "PEGMA FIBC Bag Configurator & Visualizer"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # Environment & API Keys
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:////tmp/pegma_fibc.db")
    
    # CORS origins container
    CORS_ORIGINS: Any = [
        "*",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ]

    def get_cors_origins(self) -> List[str]:
        if isinstance(self.CORS_ORIGINS, list):
            return self.CORS_ORIGINS
        if isinstance(self.CORS_ORIGINS, str):
            try:
                parsed = json.loads(self.CORS_ORIGINS)
                if isinstance(parsed, list):
                    return parsed
            except Exception:
                pass
            return [s.strip() for s in self.CORS_ORIGINS.split(",") if s.strip()]
        return ["*"]

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
