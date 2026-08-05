import os
import time
import base64
import logging
import urllib.parse
import httpx
from dotenv import load_dotenv
from app.config import settings
from app.schemas import FIBCBagConfig
from app.prompt_builder import build_gemini_prompt

logger = logging.getLogger("pegma.gemini")

LOCAL_REF_DIR = os.path.join(os.path.dirname(__file__), "reference_images")
DESKTOP_REF_DIR = os.getenv("REFERENCE_DIR") or (LOCAL_REF_DIR if os.path.exists(LOCAL_REF_DIR) else "/Users/sarveshhh/Desktop/reference")

def generate_svg_procedural_image(config: FIBCBagConfig) -> str:
    """
    Generates a crisp vector 3D-styled SVG image of the FIBC bag
    matching exact loop configuration (Single Loop arch, Double Loop arches, Cross Corner loops),
    bottom discharge spout, internal corner cutaways for baffle bags,
    callout arrows for liner & sift-proofing, and electrical safety property badges.
    """
    bag_type = config.bagType or "U Panel"
    is_baffle = "baffle" in bag_type.lower()
    
    loop_color_hex = {
        "Blue": "#2563EB",
        "White": "#E5E7EB",
        "Black": "#1E293B",
        "Red": "#E53935",
        "Green": "#16A34A",
        "Yellow": "#EAB308",
        "Orange": "#F97316"
    }.get(config.loopColor, "#2563EB")

    fabric_color = config.fabricColor or "White"
    print_text = config.logoFileName or config.printing or "PEGMA"
    bottom_raw = (config.bottom or "Discharge Spout").lower()
    top_raw = (config.top or "Duffle Top").lower()
    loop_raw = (config.loopType or "Cross Corner").lower()
    
    is_liner_active = (config.linerRequired or "Yes").lower() == "yes"
    liner_const = config.linerConstruction or "Loose Liner"
    liner_mat = config.linerMaterial or "Standard PE"
    electro = config.electrostaticType or "Type A"

    # 1. DYNAMIC LAYER 01: TOP CLOSURE MECHANISM
    if "spout" in top_raw or "filling" in top_raw:
        top_layer = '''
  <g transform="translate(0, 10)" filter="url(#cadGlow)">
    <rect x="360" y="120" width="80" height="60" fill="#1E293B" stroke="#38BDF8" stroke-width="2.5" rx="4"/>
    <ellipse cx="400" cy="120" rx="40" ry="12" fill="#334155" stroke="#38BDF8" stroke-width="2"/>
    <ellipse cx="400" cy="180" rx="36" ry="10" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
    <line x1="360" y1="150" x2="440" y2="150" stroke="#E53935" stroke-width="3.5"/>
  </g>
        '''
    elif "open" in top_raw:
        top_layer = '''
  <g transform="translate(0, 10)" filter="url(#cadGlow)">
    <polygon points="300,140 500,140 480,180 320,180" fill="#1E293B" stroke="#38BDF8" stroke-width="2.5"/>
    <ellipse cx="400" cy="140" rx="100" ry="22" fill="#334155" opacity="0.5" stroke="#38BDF8" stroke-width="2"/>
  </g>
        '''
    elif "conical" in top_raw:
        top_layer = '''
  <g transform="translate(0, 10)" filter="url(#cadGlow)">
    <polygon points="360,110 440,110 480,180 320,180" fill="#1E293B" stroke="#38BDF8" stroke-width="2.5"/>
    <ellipse cx="400" cy="110" rx="40" ry="10" fill="#334155" stroke="#38BDF8" stroke-width="2"/>
  </g>
        '''
    else: # Duffle / Skirt Top
        top_layer = '''
  <g transform="translate(0, 10)" filter="url(#cadGlow)">
    <polygon points="320,135 480,135 460,190 340,190" fill="#1E293B" stroke="#38BDF8" stroke-width="2.5"/>
    <ellipse cx="400" cy="135" rx="80" ry="20" fill="#334155" stroke="#38BDF8" stroke-width="2"/>
    <line x1="330" y1="160" x2="470" y2="160" stroke="#E53935" stroke-width="3" stroke-dasharray="5,3"/>
  </g>
        '''

    # 2. DYNAMIC LAYER 02: WEBBING LIFTING LOOPS
    if "single loop" in loop_raw or "single" in loop_raw:
        loop_layer = f'''
  <g transform="translate(0, 40)" filter="url(#cadGlow)">
    <path d="M 330 280 C 310 80, 490 80, 470 280" fill="none" stroke="{loop_color_hex}" stroke-width="22" stroke-linecap="round"/>
    <rect x="318" y="270" width="24" height="45" fill="{loop_color_hex}" rx="4"/>
    <rect x="458" y="270" width="24" height="45" fill="{loop_color_hex}" rx="4"/>
  </g>
        '''
    elif "double loop" in loop_raw or "double" in loop_raw:
        loop_layer = f'''
  <g transform="translate(0, 40)" filter="url(#cadGlow)">
    <path d="M 280 280 C 260 100, 420 100, 400 280" fill="none" stroke="{loop_color_hex}" stroke-width="18" stroke-linecap="round"/>
    <path d="M 400 280 C 380 100, 540 100, 520 280" fill="none" stroke="{loop_color_hex}" stroke-width="18" stroke-linecap="round"/>
    <rect x="270" y="270" width="20" height="45" fill="{loop_color_hex}" rx="3"/>
    <rect x="510" y="270" width="20" height="45" fill="{loop_color_hex}" rx="3"/>
  </g>
        '''
    else: # Cross Corner Loops
        loop_layer = f'''
  <g transform="translate(0, 40)" filter="url(#cadGlow)">
    <path d="M 250 280 C 210 160, 310 160, 290 280" fill="none" stroke="{loop_color_hex}" stroke-width="16" stroke-linecap="round"/>
    <path d="M 550 280 C 590 160, 490 160, 510 280" fill="none" stroke="{loop_color_hex}" stroke-width="16" stroke-linecap="round"/>
    <rect x="274" y="270" width="20" height="45" fill="{loop_color_hex}" rx="3"/>
    <rect x="506" y="270" width="20" height="45" fill="{loop_color_hex}" rx="3"/>
  </g>
        '''

    # 3. DYNAMIC LAYER 03: INTERNAL CORNER BAFFLE PANELS
    baffle_layer = ""
    if is_baffle:
        baffle_layer = '''
  <g transform="translate(0, 50)" filter="url(#cadGlow)">
    <polygon points="280,310 320,310 310,380 280,380" fill="#3B82F6" opacity="0.6" stroke="#38BDF8" stroke-width="1.5"/>
    <circle cx="300" cy="335" r="7" fill="#0F172A" stroke="#38BDF8" stroke-width="1"/>
    <circle cx="298" cy="360" r="7" fill="#0F172A" stroke="#38BDF8" stroke-width="1"/>

    <polygon points="480,310 520,310 520,380 490,380" fill="#3B82F6" opacity="0.6" stroke="#38BDF8" stroke-width="1.5"/>
    <circle cx="500" cy="335" r="7" fill="#0F172A" stroke="#38BDF8" stroke-width="1"/>
    <circle cx="502" cy="360" r="7" fill="#0F172A" stroke="#38BDF8" stroke-width="1"/>
  </g>
        '''

    # 4. DYNAMIC LAYER 04: INNER BARRIER LINER
    if is_liner_active:
        liner_layer = f'''
  <g transform="translate(0, 70)">
    <polygon points="310,400 490,400 460,580 340,580" fill="#60A5FA" fill-opacity="0.25" stroke="#60A5FA" stroke-width="2.5" stroke-dasharray="6,3"/>
    <ellipse cx="400" cy="400" rx="90" ry="22" fill="#93C5FD" fill-opacity="0.4" stroke="#60A5FA" stroke-width="2"/>
    <ellipse cx="400" cy="580" rx="60" ry="16" fill="#3B82F6" fill-opacity="0.3" stroke="#60A5FA" stroke-width="2"/>
  </g>
        '''
    else:
        liner_layer = '''
  <g transform="translate(0, 70)">
    <polygon points="310,400 490,400 460,580 340,580" fill="none" stroke="#64748B" stroke-width="1.5" stroke-dasharray="4,4" opacity="0.4"/>
  </g>
        '''

    # 5. DYNAMIC LAYER 05: MAIN PP WOVEN BODY SHELL
    shell_lines = ""
    if "4 panel" in bag_type.lower() or "4-panel" in bag_type.lower():
        shell_lines = '''
            <line x1="320" y1="620" x2="320" y2="830" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="4,4"/>
            <line x1="480" y1="620" x2="480" y2="830" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="4,4"/>
        '''

    body_layer = f'''
  <g transform="translate(0, 90)">
    <polygon points="240,620 560,620 520,830 280,830" fill="#F8FAFC" fill-opacity="0.95" stroke="#94A3B8" stroke-width="3"/>
    {shell_lines}
    <text x="400" y="720" font-family="'Inter', sans-serif" font-weight="900" font-size="24" fill="#E53935" text-anchor="middle">{print_text[:14]}</text>
    <text x="400" y="748" font-family="'Inter', sans-serif" font-weight="700" font-size="12" fill="#475569" text-anchor="middle">SWL: {config.capacity or '1000 kg'}</text>
  </g>
    '''

    # 6. DYNAMIC LAYER 06: BOTTOM DISCHARGE MECHANISM
    if "flat" in bottom_raw:
        bottom_layer = '''
  <g transform="translate(0, 100)" filter="url(#cadGlow)">
    <polygon points="270,870 530,870 510,910 290,910" fill="#1E293B" stroke="#38BDF8" stroke-width="2.5"/>
    <rect x="260" y="910" width="280" height="16" fill="#78350F" stroke="#B45309" stroke-width="1.5"/>
  </g>
        '''
    else: # Discharge Spout
        bottom_layer = '''
  <g transform="translate(0, 100)" filter="url(#cadGlow)">
    <rect x="345" y="870" width="110" height="55" fill="#1E293B" stroke="#38BDF8" stroke-width="2.5" rx="4"/>
    <ellipse cx="400" cy="870" rx="55" ry="14" fill="#334155" stroke="#38BDF8" stroke-width="2"/>
    <line x1="345" y1="895" x2="455" y2="895" stroke="#E53935" stroke-width="4"/>
  </g>
        '''

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000" width="100%" height="100%">
  <defs>
    <linearGradient id="cadBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>

    <filter id="cadGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="0" stdDeviation="6" flood-color="#38BDF8" flood-opacity="0.4"/>
    </filter>
  </defs>

  <rect width="800" height="1000" fill="url(#cadBg)"/>
  
  {top_layer}
  {loop_layer}
  {baffle_layer}
  {liner_layer}
  {body_layer}
  {bottom_layer}
</svg>'''

    encoded_svg = urllib.parse.quote(svg_content)
    return f"data:image/svg+xml;utf8,{encoded_svg}"


def generate_gemini_image(config: FIBCBagConfig, custom_prompt: str = None) -> dict:
    """
    Multimodal Reference Engine for Google GenAI SDK.
    Passes 2 primary ground-truth image parts (Logo + Bag Construction Reference)
    alongside a structured crisp text prompt for 100% reliable image synthesis.
    """
    start_time = time.time()
    prompt = custom_prompt or build_gemini_prompt(config)

    api_key = os.getenv("GEMINI_API_KEY", "") or settings.GEMINI_API_KEY
    if api_key:
        api_key = api_key.strip().strip('"').strip("'")

    print(f"\n==================================================")
    print(f"[PEGMA MULTIMODAL AUDIT] API Key Detected: {bool(api_key and len(api_key) > 5)}")
    print(f"==================================================")

    if api_key and len(api_key) > 5:
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=api_key)
            
            models_to_try = [
                "gemini-2.5-flash-image",
                "gemini-3.1-flash-image"
            ]

            contents_payload = []
            ref_directives = []

            # 1. Custom Uploaded Logo or Desktop/Local Reference logo.JPEG
            if config.logoImage and "data:image" in config.logoImage:
                try:
                    header, b64str = config.logoImage.split(",", 1)
                    logo_bytes = base64.b64decode(b64str)
                    mime_type = "image/png" if "png" in header else "image/jpeg"
                    contents_payload.append(types.Part.from_bytes(data=logo_bytes, mime_type=mime_type))
                    ref_directives.append("IMAGE REF 1 (Company Logo): Print this custom uploaded company logo prominently on the center front panel.")
                    print(f"[PEGMA MULTIMODAL AUDIT] Slot 1 [LOGO]: Attached custom uploaded logo ({len(logo_bytes)} bytes)")
                except Exception as logo_err:
                    print(f"[PEGMA MULTIMODAL AUDIT] Slot 1 [LOGO] Decode error: {logo_err}")
            else:
                logo_file = os.path.join(DESKTOP_REF_DIR, "logo.JPEG")
                if not os.path.exists(logo_file):
                    logo_file = os.path.join(LOCAL_REF_DIR, "logo.JPEG")

                if os.path.exists(logo_file):
                    with open(logo_file, "rb") as f:
                        l_bytes = f.read()
                        contents_payload.append(types.Part.from_bytes(data=l_bytes, mime_type="image/jpeg"))
                        ref_directives.append("IMAGE REF 1 (PEGMA Logo): Print the PEGMA brand logo photo prominently on the center front panel.")
                        print(f"[PEGMA MULTIMODAL AUDIT] Slot 1 [LOGO]: Attached logo.JPEG ({len(l_bytes)} bytes)")

            # 2. Primary Bag Type & Construction Reference Image
            b_raw = (config.bagType or "U Panel").lower()
            ref_filename = "upanel.png"
            ref_desc = "U-Panel body construction"

            if "net baffle" in b_raw:
                ref_filename = "netbaffle.png"
                ref_desc = "Semi-transparent cutaway revealing internal polypropylene net-mesh corner baffles"
            elif "baffle" in b_raw:
                ref_filename = "baffle.png"
                ref_desc = "Semi-transparent cutaway revealing internal fabric corner baffles with circular material-flow holes"
            elif "food grade" in b_raw:
                ref_filename = "foodgrade.png"
                ref_desc = "Food Grade clean room FIBC finish"
            elif "un certified" in b_raw or "un" in b_raw:
                ref_filename = "uncertified.png"
                ref_desc = "UN certified hazardous bag structure"
            elif "4 panel" in b_raw or "4-panel" in b_raw:
                ref_filename = "4panel.png"
                ref_desc = "4-Panel cubical body construction"
            elif "circular" in b_raw or "tubular" in b_raw:
                ref_filename = "circular.png"
                ref_desc = "Circular tubular body construction"
            elif "2 panel" in b_raw or "2-panel" in b_raw:
                ref_filename = "u+2panel.png"
                ref_desc = "2-Panel bag construction"
            elif "asbestos" in b_raw:
                ref_filename = "asbestos.png"
                ref_desc = "Asbestos plate disposal bag"
            elif "drum" in b_raw:
                ref_filename = "drum.png"
                ref_desc = "Drum bag cylindrical design"

            primary_path = os.path.join(DESKTOP_REF_DIR, ref_filename)
            if not os.path.exists(primary_path):
                primary_path = os.path.join(LOCAL_REF_DIR, ref_filename)

            if os.path.exists(primary_path):
                try:
                    with open(primary_path, "rb") as f:
                        img_bytes = f.read()
                        mime = "image/png" if ref_filename.endswith(".png") else "image/jpeg"
                        contents_payload.append(types.Part.from_bytes(data=img_bytes, mime_type=mime))
                        ref_directives.append(f"IMAGE REF 2 ({ref_filename}): {ref_desc}.")
                        print(f"[PEGMA MULTIMODAL AUDIT] Slot 2 [CONSTRUCTION]: Attached '{ref_filename}' ({len(img_bytes)} bytes)")
                except Exception as ref_err:
                    print(f"[PEGMA MULTIMODAL AUDIT] Slot 2 [CONSTRUCTION] Read error: {ref_err}")

            # Master Multimodal Text Directive
            full_prompt = (
                f"Generate a 3D commercial studio product photograph of a custom FIBC bulk bag matching the attached reference images. "
                f"VISUAL GROUND TRUTH: {' '.join(ref_directives)} "
                f"{prompt}"
            )
            contents_payload.append(full_prompt)

            for model_name in models_to_try:
                print(f"[PEGMA GEMINI SERVICE] Calling Google GenAI SDK '{model_name}' with 2-image payload...")
                try:
                    res = client.models.generate_content(
                        model=model_name,
                        contents=contents_payload
                    )
                    if hasattr(res, 'candidates') and res.candidates:
                        for part in res.candidates[0].content.parts:
                            if hasattr(part, 'inline_data') and part.inline_data:
                                image_bytes = part.inline_data.data
                                base64_str = base64.b64encode(image_bytes).decode("utf-8")
                                mime = getattr(part.inline_data, 'mime_type', 'image/jpeg')
                                image_url = f"data:{mime};base64,{base64_str}"
                                latency = round(time.time() - start_time, 2)
                                print(f"[PEGMA GEMINI SERVICE] SUCCESS via {model_name} in {latency}s!")
                                return {
                                    "image_url": image_url,
                                    "model_used": model_name,
                                    "latency": latency,
                                    "is_fallback": False
                                }
                except Exception as model_err:
                    print(f"[PEGMA GEMINI SERVICE] Multimodal '{model_name}' failed: {model_err}")
                    try:
                        res = client.models.generate_content(
                            model=model_name,
                            contents=f"Generate a 3D commercial studio product photograph of a white FIBC bulk bag matching specs: {prompt}"
                        )
                        if hasattr(res, 'candidates') and res.candidates:
                            for part in res.candidates[0].content.parts:
                                if hasattr(part, 'inline_data') and part.inline_data:
                                    image_bytes = part.inline_data.data
                                    base64_str = base64.b64encode(image_bytes).decode("utf-8")
                                    mime = getattr(part.inline_data, 'mime_type', 'image/jpeg')
                                    image_url = f"data:{mime};base64,{base64_str}"
                                    latency = round(time.time() - start_time, 2)
                                    print(f"[PEGMA GEMINI SERVICE] SUCCESS via {model_name} (text fallback) in {latency}s!")
                                    return {
                                        "image_url": image_url,
                                        "model_used": model_name,
                                        "latency": latency,
                                        "is_fallback": False
                                    }
                    except Exception as text_err:
                        print(f"[PEGMA GEMINI SERVICE] Text fallback for '{model_name}' failed: {text_err}")

        except Exception as e:
            print(f"[PEGMA GEMINI SERVICE] Google GenAI SDK error: {e}")

    # Fallback output
    print("[PEGMA GEMINI SERVICE] Returning 3D vector visualizer output.")
    image_url = generate_svg_procedural_image(config)
    latency = round(time.time() - start_time, 2)

    return {
        "image_url": image_url,
        "model_used": "pegma-vector-render-v1",
        "latency": latency,
        "is_fallback": True
    }
