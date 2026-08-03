from fastapi import APIRouter
from typing import List, Dict, Any

router = APIRouter(prefix="", tags=["Templates"])

PRESET_TEMPLATES: List[Dict[str, Any]] = [
    {
        "id": 1,
        "title": "Pharma & Food Grade Bag",
        "category": "Pharma / Food",
        "badge": "Food Grade",
        "description": "Ultra-clean room manufactured FIBC with food grade certification, PE inner liner, and dust-proof ultrasonic seals.",
        "config_json": {
            "bagType": "U-Panel",
            "capacity": "1000 kg",
            "fabricColor": "White",
            "gsm": "180 GSM",
            "top": "Duffle Top",
            "bottom": "Discharge Spout",
            "loopType": "Cross Corner",
            "loopColor": "Blue",
            "printing": "PEGMA Pharma Standard",
            "printingColor": "Blue",
            "printingPosition": "Center Front",
            "accessories": ["Food Grade", "PE Liner", "Document Pouch", "Dust Proof Stitching"],
            "foodGrade": True,
            "peLiner": True,
            "documentPouch": True,
            "dustProofStitching": True
        },
        "preview_image_url": ""
    },
    {
        "id": 2,
        "title": "Chemical UN Certified Q-Bag",
        "category": "Hazardous Chemicals",
        "badge": "UN Hazardous",
        "description": "Square-form Baffle Bag with internal baffles to prevent bulging. UN certified for hazardous powder transport.",
        "config_json": {
            "bagType": "Baffle Bag (Q-Bag)",
            "capacity": "1250 kg",
            "fabricColor": "White",
            "gsm": "200 GSM",
            "top": "Filling Spout",
            "bottom": "Discharge Spout with Petal Closure",
            "loopType": "Corner Loops",
            "loopColor": "Black",
            "printing": "PEGMA Chemical Spec",
            "printingColor": "Red",
            "printingPosition": "Center Front",
            "accessories": ["UN Certified", "Baffle", "PE Liner", "Dust Proof Stitching", "Barcode"],
            "unCertified": True,
            "baffle": True,
            "peLiner": True,
            "dustProofStitching": True,
            "barcodeLabel": True
        },
        "preview_image_url": ""
    },
    {
        "id": 3,
        "title": "Mining & Heavy Ore Bag",
        "category": "Mining & Minerals",
        "badge": "2000 KG SWL",
        "description": "Extremely high-density 4-Panel bag engineered for maximum tensile load capacity and rough abrasive minerals.",
        "config_json": {
            "bagType": "4-Panel",
            "capacity": "2000 kg",
            "fabricColor": "Beige / Tan",
            "gsm": "220 GSM",
            "top": "Open Top",
            "bottom": "Flat Bottom",
            "loopType": "Cross Corner",
            "loopColor": "Red",
            "printing": "PEGMA Heavy Duty",
            "printingColor": "Black",
            "printingPosition": "Center Front",
            "accessories": ["Document Pouch", "Dust Proof Stitching"],
            "documentPouch": True,
            "dustProofStitching": True
        },
        "preview_image_url": ""
    },
    {
        "id": 4,
        "title": "Agri Grain & Seed Container",
        "category": "Agriculture",
        "badge": "Standard Agri",
        "description": "Seamless circular woven tubular bag designed for seeds, grains, pulses, and agricultural bulk produce.",
        "config_json": {
            "bagType": "Circular / Tubular",
            "capacity": "1000 kg",
            "fabricColor": "White",
            "gsm": "160 GSM",
            "top": "Duffle Top",
            "bottom": "Discharge Spout",
            "loopType": "Cross Corner",
            "loopColor": "Green",
            "printing": "PEGMA Agri Bulk",
            "printingColor": "Green",
            "printingPosition": "Center Front",
            "accessories": ["Document Pouch"],
            "documentPouch": True
        },
        "preview_image_url": ""
    }
]

@router.get("/templates")
def get_preset_templates():
    return PRESET_TEMPLATES
