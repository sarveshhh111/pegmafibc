import os
import time
import base64
import logging
import urllib.parse
import httpx
from dotenv import load_dotenv
from app.config import settings
from app.schemas import FIBCBagConfig
from app.prompt_builder import build_exploded_view_prompt

logger = logging.getLogger("pegma.gemini")

def generate_svg_procedural_image(config: FIBCBagConfig) -> str:
    """
    Generates a crisp vector 3D-styled SVG image of the FIBC bag
    with bottom discharge spout positioned strictly at the bottom center base.
    """
    bag_type = config.bagType or "U-Panel"
    loop_color_hex = {
        "Blue": "#2563EB",
        "White": "#E5E7EB",
        "Black": "#1E293B",
        "Red": "#E53935",
        "Green": "#16A34A"
    }.get(config.loopColor, "#2563EB")

    fabric_bg = {
        "White": "#F8FAFC",
        "Beige / Tan": "#F5EBE0",
        "Black": "#334155",
        "Blue": "#DBEAFE",
        "Green": "#DCFCE7"
    }.get(config.fabricColor, "#F8FAFC")
    
    fabric_stroke = "#CBD5E1" if config.fabricColor == "White" else "#94A3B8"
    
    print_color_hex = {
        "Red": "#E53935",
        "Black": "#1A1A1A",
        "Blue": "#2563EB",
        "Green": "#16A34A"
    }.get(config.printingColor, "#E53935")

    print_text = config.printing if config.printing and config.printing != "No Printing" else ""
    
    has_liner = "PE Liner" in config.accessories or config.peLiner or (config.linerType and config.linerType != "No Liner")
    has_pouch = "Document Pouch" in config.accessories or config.documentPouch
    has_un = "UN Certified" in config.accessories or config.unCertified
    has_felt = "Dust Proof Stitching" in config.accessories or config.dustProofStitching

    top_element = ""
    if "Duffle" in config.top:
        top_element = '''
            <path d="M 280 230 C 310 190, 490 190, 520 230 Z" fill="#EEF2F6" stroke="#94A3B8" stroke-width="2"/>
            <ellipse cx="400" cy="205" rx="55" ry="14" fill="#E2E8F0" stroke="#64748B" stroke-width="2"/>
            <path d="M 385 205 Q 400 220 415 205" fill="none" stroke="#E53935" stroke-width="3" stroke-dasharray="4,3"/>
        '''
    elif "Spout" in config.top:
        top_element = '''
            <rect x="360" y="160" width="80" height="70" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2" rx="4"/>
            <ellipse cx="400" cy="160" rx="40" ry="10" fill="#CBD5E1" stroke="#64748B" stroke-width="2"/>
            <line x1="360" y1="195" x2="440" y2="195" stroke="#E53935" stroke-width="3"/>
        '''

    # BOTTOM DISCHARGE SPOUT POSITIONED STRICTLY AT BASE CENTER
    bottom_element = ""
    if "Spout" in config.bottom or "Discharge" in config.bottom:
        bottom_element = '''
            <g transform="translate(0, -10)">
              <!-- Base Discharge Spout extending straight down from center base panel -->
              <path d="M 350 580 L 350 665 C 350 680, 450 680, 450 665 L 450 580 Z" fill="#E2E8F0" stroke="#1E293B" stroke-width="3"/>
              <ellipse cx="400" cy="665" rx="50" ry="12" fill="#94A3B8" stroke="#1E293B" stroke-width="2.5"/>
              <!-- Red Tie Cord gathered at center spout -->
              <line x1="350" y1="630" x2="450" y2="630" stroke="#E53935" stroke-width="5"/>
              <!-- Bright Callout Badge at Base -->
              <rect x="325" y="618" width="150" height="24" fill="#E53935" rx="5"/>
              <text x="400" y="634" font-family="sans-serif" font-size="10" font-weight="900" fill="#FFFFFF" text-anchor="middle">BOTTOM DISCHARGE SPOUT</text>
            </g>
        '''

    stitch_stroke = "#EF4444" if has_felt else "#94A3B8"
    stitch_dash = "4 4" if has_felt else "none"

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="100%" stop-color="#F1F5F9"/>
    </linearGradient>

    <linearGradient id="frontShade" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="{fabric_bg}" stop-opacity="1"/>
      <stop offset="50%" stop-color="#FFFFFF" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="{fabric_bg}" stop-opacity="0.95"/>
    </linearGradient>

    <linearGradient id="sideShade" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#CBD5E1" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#94A3B8" stop-opacity="0.3"/>
    </linearGradient>

    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="25" stdDeviation="20" flood-color="#0F172A" flood-opacity="0.12"/>
    </filter>

    <pattern id="weavePattern" width="16" height="16" patternUnits="userSpaceOnUse">
      <path d="M 0 8 L 16 8 M 8 0 L 8 16" stroke="#94A3B8" stroke-width="0.75" stroke-opacity="0.15"/>
    </pattern>
  </defs>

  <rect width="800" height="800" fill="url(#bgGrad)" />

  <ellipse cx="400" cy="695" rx="260" ry="35" fill="#0F172A" opacity="0.12" filter="blur(10px)"/>
  <ellipse cx="400" cy="690" rx="190" ry="20" fill="#0F172A" opacity="0.18" filter="blur(5px)"/>

  <g filter="url(#dropShadow)">
    {top_element}

    <path d="M 270 235 C 250 100, 310 90, 330 235" fill="none" stroke="{loop_color_hex}" stroke-width="16" stroke-linecap="round" opacity="0.8"/>
    <path d="M 470 235 C 490 90, 550 100, 530 235" fill="none" stroke="{loop_color_hex}" stroke-width="16" stroke-linecap="round" opacity="0.8"/>

    <path d="M 260 230 L 540 230 L 520 600 L 280 600 Z" fill="url(#frontShade)" stroke="{fabric_stroke}" stroke-width="2"/>
    <path d="M 260 230 L 540 230 L 520 600 L 280 600 Z" fill="url(#weavePattern)"/>

    <path d="M 260 230 L 210 260 L 230 580 L 280 600 Z" fill="url(#sideShade)" stroke="{fabric_stroke}" stroke-width="2"/>

    {bottom_element}

    <line x1="260" y1="230" x2="280" y2="600" stroke="{stitch_stroke}" stroke-width="3" stroke-dasharray="{stitch_dash}"/>
    <line x1="540" y1="230" x2="520" y2="600" stroke="{stitch_stroke}" stroke-width="3" stroke-dasharray="{stitch_dash}"/>
    <line x1="260" y1="230" x2="210" y2="260" stroke="{stitch_stroke}" stroke-width="2"/>

    <path d="M 245 270 C 230 110, 315 110, 290 230" fill="none" stroke="{loop_color_hex}" stroke-width="18" stroke-linecap="round"/>
    <rect x="268" y="230" width="18" height="60" fill="{loop_color_hex}" rx="2"/>

    <path d="M 510 230 C 485 110, 570 110, 555 270" fill="none" stroke="{loop_color_hex}" stroke-width="18" stroke-linecap="round"/>
    <rect x="514" y="230" width="18" height="60" fill="{loop_color_hex}" rx="2"/>

    '''
    
    if print_text:
        svg_content += f'''
        <g transform="translate(400, 390)">
          <g transform="translate(-65, -60) scale(0.35)">
            <path d="M 180 10 C 270 10, 340 55, 340 135 C 340 210, 240 240, 150 240 C 60 240 10 195 10 125 C 10 50, 90 10, 180 10 Z" fill="{print_color_hex}"/>
            <g fill="#FFFFFF">
              <path d="M 50 120 V 175 H 58 V 148 H 77 C 86 148 92 142 92 133 V 128 C 92 119 86 113 77 113 H 50 Z" />
              <path d="M 102 133 C 102 120 110 113 122 113 H 139 V 120 H 122 Z" />
            </g>
          </g>
          <text x="0" y="32" font-family="'Inter', sans-serif" font-weight="700" font-size="20" fill="#1E293B" text-anchor="middle" letter-spacing="0.5">{print_text}</text>
          <text x="0" y="52" font-family="'Inter', sans-serif" font-weight="500" font-size="11" fill="#64748B" text-anchor="middle" letter-spacing="1">BULK PACKAGING SOLUTIONS</text>
          <text x="0" y="72" font-family="'Inter', sans-serif" font-weight="600" font-size="13" fill="#E53935" text-anchor="middle">SWL: {config.capacity}</text>
        </g>
        '''

    if has_pouch:
        svg_content += '''
        <rect x="440" y="260" width="65" height="85" fill="#FFFFFF" fill-opacity="0.6" stroke="#94A3B8" stroke-width="1.5" rx="3" stroke-dasharray="3,2"/>
        '''

    svg_content += f'''
    <rect x="620" y="30" width="150" height="48" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" rx="8" filter="url(#dropShadow)"/>
    <text x="635" y="50" font-family="'Inter', sans-serif" font-weight="600" font-size="11" fill="#64748B">SPECIFICATION</text>
    <text x="635" y="66" font-family="'Inter', sans-serif" font-weight="700" font-size="13" fill="#0F172A">{config.bagType} • {config.gsm}</text>
  </g>
</svg>'''

    encoded_svg = urllib.parse.quote(svg_content)
    return f"data:image/svg+xml;utf8,{encoded_svg}"


def generate_svg_exploded_view(config: FIBCBagConfig) -> str:
    """
    Generates a ultra-sleek, professional 5-layer 3D CAD Exploded Assembly SVG diagram.
    """
    loop_color_hex = {
        "Blue": "#2563EB", "White": "#E5E7EB", "Black": "#1E293B", "Red": "#E53935", "Green": "#16A34A"
    }.get(config.loopColor, "#2563EB")
    
    fabric_bg = {
        "White": "#F8FAFC", "Beige / Tan": "#F5EBE0", "Black": "#334155", "Blue": "#DBEAFE", "Green": "#DCFCE7"
    }.get(config.fabricColor, "#F8FAFC")

    print_text = config.printing or "PEGMA"

    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1050" width="100%" height="100%">
  <defs>
    <linearGradient id="expBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#1E293B"/>
    </linearGradient>

    <linearGradient id="cyanGlow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="#818CF8" stop-opacity="0.9"/>
    </linearGradient>

    <filter id="cadGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#38BDF8" flood-opacity="0.35"/>
    </filter>
  </defs>

  <rect width="800" height="1050" fill="url(#expBg)" rx="16"/>

  <!-- Grid Blueprint Lines -->
  <line x1="400" y1="60" x2="400" y2="980" stroke="#38BDF8" stroke-width="2" stroke-dasharray="8,5" opacity="0.45"/>
  <line x1="200" y1="100" x2="200" y2="950" stroke="#334155" stroke-width="1" stroke-dasharray="4,4"/>
  <line x1="600" y1="100" x2="600" y2="950" stroke="#334155" stroke-width="1" stroke-dasharray="4,4"/>

  <!-- 1. TOP CLOSURE SKIRT (Y=120) -->
  <g transform="translate(0, 0)" filter="url(#cadGlow)">
    <polygon points="320,110 480,110 520,160 280,160" fill="#1E293B" stroke="#38BDF8" stroke-width="2"/>
    <ellipse cx="400" cy="110" rx="80" ry="20" fill="#334155" stroke="#38BDF8" stroke-width="2"/>
    <line x1="330" y1="135" x2="470" y2="135" stroke="#E53935" stroke-width="3" stroke-dasharray="5,3"/>
    
    <text x="620" y="135" font-family="monospace" font-size="13" font-weight="black" fill="#38BDF8">01. TOP CLOSURE SKIRT</text>
    <line x1="490" y1="135" x2="610" y2="135" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="3,3"/>
    <circle cx="490" cy="135" r="4" fill="#38BDF8"/>
  </g>

  <!-- 2. LIFTING WEBBING LOOPS (Y=240) -->
  <g transform="translate(0, 20)">
    <path d="M 250 260 C 210 140, 310 140, 290 260" fill="none" stroke="{loop_color_hex}" stroke-width="16" stroke-linecap="round" filter="url(#cadGlow)"/>
    <path d="M 550 260 C 590 140, 490 140, 510 260" fill="none" stroke="{loop_color_hex}" stroke-width="16" stroke-linecap="round" filter="url(#cadGlow)"/>
    <rect x="274" y="250" width="20" height="45" fill="{loop_color_hex}" rx="3"/>
    <rect x="506" y="250" width="20" height="45" fill="{loop_color_hex}" rx="3"/>

    <text x="180" y="235" font-family="monospace" font-size="13" font-weight="black" fill="#38BDF8" text-anchor="end">02. WEBBING LIFTING LOOPS</text>
    <line x1="190" y1="235" x2="270" y2="235" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="3,3"/>
    <circle cx="270" cy="235" r="4" fill="#38BDF8"/>
  </g>

  <!-- 3. INNER BARRIER LINER (Y=390) -->
  <g transform="translate(0, 30)">
    <polygon points="310,360 490,360 460,540 340,540" fill="#60A5FA" fill-opacity="0.2" stroke="#60A5FA" stroke-width="2.5" stroke-dasharray="6,3"/>
    <ellipse cx="400" cy="360" rx="90" ry="22" fill="#93C5FD" fill-opacity="0.3" stroke="#60A5FA" stroke-width="2"/>
    <ellipse cx="400" cy="540" rx="60" ry="16" fill="#3B82F6" fill-opacity="0.3" stroke="#60A5FA" stroke-width="2"/>

    <text x="620" y="450" font-family="monospace" font-size="13" font-weight="black" fill="#60A5FA">03. INNER BARRIER LINER</text>
    <line x1="475" y1="450" x2="610" y2="450" stroke="#60A5FA" stroke-width="1.5" stroke-dasharray="3,3"/>
    <circle cx="475" cy="450" r="4" fill="#60A5FA"/>
  </g>

  <!-- 4. MAIN BODY FABRIC SHELL (Y=600) -->
  <g transform="translate(0, 40)">
    <polygon points="240,580 560,580 520,800 280,800" fill="{fabric_bg}" fill-opacity="0.95" stroke="#94A3B8" stroke-width="3"/>
    <polygon points="240,580 190,610 220,780 280,800" fill="#475569" fill-opacity="0.6" stroke="#94A3B8" stroke-width="2"/>
    
    <line x1="240" y1="580" x2="280" y2="800" stroke="#E53935" stroke-width="3" stroke-dasharray="5,3"/>
    <line x1="560" y1="580" x2="520" y2="800" stroke="#E53935" stroke-width="3" stroke-dasharray="5,3"/>

    <text x="400" y="680" font-family="'Inter', sans-serif" font-weight="900" font-size="24" fill="#E53935" text-anchor="middle">{print_text}</text>
    <text x="400" y="708" font-family="'Inter', sans-serif" font-weight="700" font-size="12" fill="#475569" text-anchor="middle">SWL: {config.capacity}</text>

    <text x="180" y="690" font-family="monospace" font-size="13" font-weight="black" fill="#38BDF8" text-anchor="end">04. PP WOVEN BODY SHELL</text>
    <line x1="190" y1="690" x2="250" y2="690" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="3,3"/>
    <circle cx="250" cy="690" r="4" fill="#38BDF8"/>
  </g>

  <!-- 5. BOTTOM DISCHARGE SPOUT (CENTERED AT Y=880) -->
  <g transform="translate(0, 50)" filter="url(#cadGlow)">
    <rect x="345" y="870" width="110" height="55" fill="#1E293B" stroke="#38BDF8" stroke-width="2.5" rx="4"/>
    <ellipse cx="400" cy="870" rx="55" ry="14" fill="#334155" stroke="#38BDF8" stroke-width="2"/>
    <ellipse cx="400" cy="925" rx="50" ry="12" fill="#0F172A" stroke="#38BDF8" stroke-width="2"/>
    <line x1="345" y1="895" x2="455" y2="895" stroke="#E53935" stroke-width="4"/>

    <text x="620" y="895" font-family="monospace" font-size="13" font-weight="black" fill="#38BDF8">05. BOTTOM DISCHARGE SPOUT</text>
    <line x1="460" y1="895" x2="610" y2="895" stroke="#38BDF8" stroke-width="1.5" stroke-dasharray="3,3"/>
    <circle cx="460" cy="895" r="4" fill="#38BDF8"/>
  </g>

  <!-- Title Badge -->
  <rect x="30" y="30" width="340" height="50" fill="#1E293B" stroke="#38BDF8" stroke-width="1.5" rx="10"/>
  <text x="50" y="52" font-family="sans-serif" font-weight="extrabold" font-size="13" fill="#38BDF8">PEGMA EXPLODED CAD ASSEMBLY</text>
  <text x="50" y="68" font-family="sans-serif" font-size="11" fill="#94A3B8">{config.bagType} • {config.capacity}</text>

</svg>'''

    encoded_svg = urllib.parse.quote(svg_content)
    return f"data:image/svg+xml;utf8,{encoded_svg}"


async def generate_gemini_image(config: FIBCBagConfig, prompt: str) -> dict:
    """
    Invokes Google Gemini API models using Google GenAI SDK.
    Passes official product reference image assets as multimodal inputs to Gemini API.
    """
    start_time = time.time()
    
    # Reload .env dynamically
    load_dotenv(override=True)
    
    api_key = os.getenv("GEMINI_API_KEY", "") or settings.GEMINI_API_KEY
    if api_key:
        api_key = api_key.strip().strip('"').strip("'")

    print(f"\n==========================================")
    print(f"[PEGMA GEMINI SERVICE] API Key Detected: {bool(api_key and len(api_key) > 5)} (Length: {len(api_key)})")
    print(f"==========================================")

    exploded_prompt = build_exploded_view_prompt(config)
    exploded_url = generate_svg_exploded_view(config)

    if api_key and len(api_key) > 5:
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=api_key)
            
            models_to_try = [
                "gemini-2.5-flash-image",
                "gemini-3.1-flash-image",
                "gemini-3-pro-image",
                "gemini-2.5-flash"
            ]

            # Prepare multimodal reference image inputs
            contents_payload = []
            
            try:
                ref_path = os.path.join(os.path.dirname(__file__), "assets", "pegma_logo_ref.jpg")
                if os.path.exists(ref_path):
                    with open(ref_path, "rb") as f:
                        ref_bytes = f.read()
                        contents_payload.append(
                            types.Part.from_bytes(data=ref_bytes, mime_type="image/jpeg")
                        )
            except Exception as ref_err:
                print(f"[PEGMA GEMINI SERVICE] Reference image load note: {ref_err}")

            contents_payload.append(
                f"Generate a realistic 3D studio product photograph of a white FIBC bulk bag, adhering strictly to these specifications: {prompt}"
            )

            for model_name in models_to_try:
                print(f"[PEGMA GEMINI SERVICE] Calling Google GenAI SDK with model '{model_name}'...")
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
                                    "exploded_image_url": exploded_url,
                                    "exploded_prompt": exploded_prompt,
                                    "model_used": model_name,
                                    "latency": latency,
                                    "is_fallback": False
                                }
                except Exception as model_err:
                    print(f"[PEGMA GEMINI SERVICE] Model '{model_name}' failed: {model_err}")
                    # Secondary try with plain text prompt string
                    try:
                        res = client.models.generate_content(
                            model=model_name,
                            contents=f"Generate a realistic 3D studio product photograph of a white FIBC bulk bag matching specs: {prompt}"
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
                                        "exploded_image_url": exploded_url,
                                        "exploded_prompt": exploded_prompt,
                                        "model_used": model_name,
                                        "latency": latency,
                                        "is_fallback": False
                                    }
                    except Exception as text_err:
                        print(f"[PEGMA GEMINI SERVICE] Plain text fallback for '{model_name}' failed: {text_err}")

        except Exception as e:
            print(f"[PEGMA GEMINI SERVICE] Google GenAI SDK error: {e}")

    # Fallback output
    print("[PEGMA GEMINI SERVICE] Returning 3D vector visualizer & exploded CAD output.")
    image_url = generate_svg_procedural_image(config)
    latency = round(time.time() - start_time, 2)

    return {
        "image_url": image_url,
        "exploded_image_url": exploded_url,
        "exploded_prompt": exploded_prompt,
        "model_used": "pegma-vector-render-v1",
        "latency": latency,
        "is_fallback": True
    }
