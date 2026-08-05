from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import time
from app.database import get_db
from app.schemas import GenerationRequest, GenerationResponse, FIBCBagConfig
from app.prompt_builder import build_gemini_prompt
from app.gemini_service import generate_gemini_image
from app.models import BagConfigurationHistory, PromptLog, ApiUsageCounter

router = APIRouter(prefix="", tags=["Generator"])

@router.post("/generate", response_model=GenerationResponse)
async def generate_fibc_image(
    payload: GenerationRequest,
    db: Session = Depends(get_db)
):
    start_time = time.time()
    config = payload.config

    # 1. Compile prompt using Python Prompt Engine
    compiled_prompt = build_gemini_prompt(config)

    # 2. Execute Gemini Image generation
    result = generate_gemini_image(config, compiled_prompt)
    image_url = result["image_url"]
    model_used = result["model_used"]
    is_fallback = result["is_fallback"]
    generation_sec = round(time.time() - start_time, 2)

    # 3. Store in History DB
    history_record = BagConfigurationHistory(
        session_id=payload.session_id or "default",
        config_json=config.dict(),
        generated_prompt=compiled_prompt,
        image_url=image_url,
        model_used=model_used,
        generation_time_sec=generation_sec
    )
    db.add(history_record)
    db.commit()
    db.refresh(history_record)

    # 4. Audit Log for Admin
    prompt_log = PromptLog(
        input_specs=config.dict(),
        compiled_prompt=compiled_prompt,
        status="fallback" if is_fallback else "success",
        latency_ms=int(generation_sec * 1000)
    )
    db.add(prompt_log)

    # 5. Update API usage counter
    counter = db.query(ApiUsageCounter).first()
    if not counter:
        counter = ApiUsageCounter(total_generations=0, gemini_api_calls=0, fallback_generations=0)
        db.add(counter)
    
    counter.total_generations += 1
    if is_fallback:
        counter.fallback_generations += 1
    else:
        counter.gemini_api_calls += 1
    
    db.commit()

    return GenerationResponse(
        id=history_record.id,
        image_url=image_url,
        prompt=compiled_prompt,
        generation_time_sec=generation_sec,
        model_used=model_used,
        is_cached=False,
        created_at=history_record.created_at
    )
