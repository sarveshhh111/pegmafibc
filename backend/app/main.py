import sys
import os

# Ensure backend directory and parent directory are on sys.path for Render deployment
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.insert(0, os.path.abspath("backend"))
sys.path.insert(0, os.path.abspath("."))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from app.config import settings
from app.database import engine, Base
from app.routers import generator, history, templates, admin

# Initialize DB tables safely
try:
    Base.metadata.create_all(bind=engine)
except Exception as db_err:
    print(f"[PEGMA DB INIT WARNING] {db_err}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers under /api prefix
app.include_router(generator.router, prefix=settings.API_PREFIX)
app.include_router(history.router, prefix=settings.API_PREFIX)
app.include_router(templates.router, prefix=settings.API_PREFIX)
app.include_router(admin.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "company": "PEGMA",
        "service": "FIBC Bag Configurator & Gemini AI Image Visualizer",
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/test-history")
def test_history():
    import traceback
    from app.database import SessionLocal
    from app.models import BagConfigurationHistory
    from app.schemas import HistoryItemResponse
    try:
        db = SessionLocal()
        items = db.query(BagConfigurationHistory).limit(10).all()
        result = [HistoryItemResponse.model_validate(it).model_dump() for it in items]
        return {"success": True, "count": len(result), "items": result}
    except Exception as e:
        return {"success": False, "error": str(e), "traceback": traceback.format_exc()}

@app.get("/api/test-generate")
def test_generate():
    import traceback
    from app.schemas import FIBCBagConfig
    from app.gemini_service import generate_gemini_image
    try:
        cfg = FIBCBagConfig(bagType="Baffle Bag", capacity="1000 kg")
        res = generate_gemini_image(cfg)
        return {"success": True, "result": res}
    except Exception as e:
        return {"success": False, "error": str(e), "traceback": traceback.format_exc()}

@app.get("/api/debug-env")
def debug_env():
    import os
    from app.config import settings
    k = os.getenv("GEMINI_API_KEY", "") or settings.GEMINI_API_KEY
    if k:
        k = k.strip().strip('"').strip("'")
    return {
        "gemini_key_detected": bool(k and len(k) > 5),
        "key_length": len(k) if k else 0,
        "key_prefix": k[:4] + "..." if (k and len(k) > 4) else "NOT_SET"
    }

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
