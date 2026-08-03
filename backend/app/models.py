import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, Float, JSON
from app.database import Base

class BagConfigurationHistory(Base):
    __tablename__ = "history"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True, default="default")
    config_json = Column(JSON, nullable=False)
    generated_prompt = Column(Text, nullable=False)
    image_url = Column(Text, nullable=False)
    model_used = Column(String, default="gemini-2.5-flash-image")
    is_favorite = Column(Boolean, default=False)
    generation_time_sec = Column(Float, default=1.2)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SavedConfiguration(Base):
    __tablename__ = "saved_configurations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    config_json = Column(JSON, nullable=False)
    thumbnail_url = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class PresetTemplate(Base):
    __tablename__ = "preset_templates"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    config_json = Column(JSON, nullable=False)
    preview_image_url = Column(Text, nullable=False)
    badge = Column(String, nullable=True)

class PromptLog(Base):
    __tablename__ = "prompt_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    input_specs = Column(JSON, nullable=False)
    compiled_prompt = Column(Text, nullable=False)
    status = Column(String, default="success") # success / error / cached / fallback
    response_metadata = Column(JSON, nullable=True)
    latency_ms = Column(Integer, default=0)

class ApiUsageCounter(Base):
    __tablename__ = "api_usage"

    id = Column(Integer, primary_key=True, index=True)
    total_generations = Column(Integer, default=0)
    gemini_api_calls = Column(Integer, default=0)
    fallback_generations = Column(Integer, default=0)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)
