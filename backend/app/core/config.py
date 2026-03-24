import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = r"sqlite:///C:\Users\jlyra\Documents\Sistema de Votação\backend\data\voting.db"
    ALLOWED_IPS: list[str] = ["127.0.0.1","::1", "192.168.6.146", "192.168.7.137", "192.168.7.114"]
    ADMIN_SECRET: str = "CIPADMIN2026" # Example, should be env var
    PROJECT_NAME: str = "CIPA Voting System"

    class Config:
        env_file = ".env"

settings = Settings()
