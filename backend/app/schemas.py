from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

class FIBCBagConfig(BaseModel):
    bagType: str = Field(default="U-Panel", description="Type of FIBC construction (U-Panel, 4-Panel, Circular, Baffle, Conical)")
    capacity: str = Field(default="1000 kg", description="Safe Working Load capacity")
    fabricColor: str = Field(default="White", description="Main body fabric color")
    gsm: str = Field(default="180 GSM", description="Fabric density / weight")
    top: str = Field(default="Duffle Top", description="Top opening mechanism")
    bottom: str = Field(default="Discharge Spout", description="Bottom discharge mechanism")
    loopType: str = Field(default="Cross Corner", description="Lifting loop configuration")
    loopColor: str = Field(default="Blue", description="Lifting loop strap color")
    printing: str = Field(default="PEGMA", description="Brand printing text/logo")
    printingColor: str = Field(default="Red", description="Print ink color")
    printingPosition: str = Field(default="Center Front", description="Positioning of print")
    accessories: List[str] = Field(default_factory=lambda: ["PE Liner", "Document Pouch"], description="Specialized features/add-ons")
    
    # Extended product list attributes
    electrostaticType: Optional[str] = "Type A (Standard)"
    siftProofing: Optional[str] = "Standard Stitching"
    baffleType: Optional[str] = "Standard (No Baffles)"
    linerType: Optional[str] = "Standard PE Liner"

    # Flags derived or requested directly
    foodGrade: Optional[bool] = False
    unCertified: Optional[bool] = False
    baffle: Optional[bool] = False
    peLiner: Optional[bool] = False
    documentPouch: Optional[bool] = False
    dustProofStitching: Optional[bool] = False
    barcodeLabel: Optional[bool] = False

class GenerationRequest(BaseModel):
    config: FIBCBagConfig
    session_id: Optional[str] = "default"

class GenerationResponse(BaseModel):
    id: Optional[int] = None
    image_url: str
    prompt: str
    exploded_image_url: Optional[str] = None
    exploded_prompt: Optional[str] = None
    generation_time_sec: float
    model_used: str
    is_cached: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

class HistoryItemResponse(BaseModel):
    id: int
    session_id: str
    config_json: Dict[str, Any]
    generated_prompt: str
    image_url: str
    model_used: str
    is_favorite: bool
    generation_time_sec: float
    created_at: datetime

    class Config:
        from_attributes = True

class SaveConfigPayload(BaseModel):
    title: str
    description: Optional[str] = ""
    config_json: Dict[str, Any]
    thumbnail_url: Optional[str] = None

class TemplateResponse(BaseModel):
    id: int
    title: str
    category: str
    description: str
    config_json: Dict[str, Any]
    preview_image_url: str
    badge: Optional[str] = None

class AdminLogResponse(BaseModel):
    id: int
    timestamp: datetime
    input_specs: Dict[str, Any]
    compiled_prompt: str
    status: str
    latency_ms: int

    class Config:
        from_attributes = True

class ApiStatsResponse(BaseModel):
    total_generations: int
    gemini_api_calls: int
    fallback_generations: int
    active_key: bool
