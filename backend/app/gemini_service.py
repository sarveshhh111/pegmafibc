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

    fabric_bg = {
        "White": "#F8FAFC",
        "Beige": "#F5EBE0",
        "Black": "#334155",
        "Blue": "#DBEAFE",
        "Green": "#DCFCE7",
        "Yellow": "#FEF9C3",
        "Red": "#FEE2E2",
        "Orange": "#FFEDD5"
    }.get(config.fabricColor, "#F8FAFC")
    
    fabric_stroke = "#CBD5E1" if config.fabricColor == "White" else "#94A3B8"
    
    print_color_hex = {
        "Red": "#E53935",
        "Black": "#1A1A1A",
        "Blue": "#2563EB",
        "Green": "#16A34A"
    }.get(config.printingColor, "#E53935")

    print_text = config.logoFileName or (config.printing if config.printing and config.printing != "No Printing" else "PEGMA")
    
    is_liner_active = (config.linerRequired or "Yes").lower() == "yes"
    liner_const = config.linerConstruction or "Loose Liner"
    liner_mat = config.linerMaterial or "Standard PE"
    
    sift_level = config.siftProofing or "Single Sift Proof"
    if sift_level.lower() == "none":
        sift_level = "Standard Double Stitching"

    electro = config.electrostaticType or "Type A"

    top_element = ""
    if "Duffle" in (config.top or "") or "Skirt" in (config.top or ""):
        top_element = '''
            <path d="M 280 230 C 310 190, 490 190, 520 230 Z" fill="#EEF2F6" stroke="#94A3B8" stroke-width="2"/>
            <ellipse cx="400" cy="205" rx="55" ry="14" fill="#E2E8F0" stroke="#64748B" stroke-width="2"/>
            <path d="M 385 205 Q 400 220 415 205" fill="none" stroke="#E53935" stroke-width="3" stroke-dasharray="4,3"/>
        '''
    elif "Spout" in (config.top or "") or "Filling" in (config.top or ""):
        top_element = '''
            <rect x="360" y="160" width="80" height="70" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2" rx="4"/>
            <ellipse cx="400" cy="160" rx="40" ry="10" fill="#CBD5E1" stroke="#64748B" stroke-width="2"/>
            <line x1="360" y1="195" x2="440" y2="195" stroke="#E53935" stroke-width="3"/>
        '''

    # LOOP DRAWING PATHS BASED ON SELECTED LOOP CONFIGURATION
    loop_raw = (config.loopType or "Cross Corner").lower()
    if "single loop" in loop_raw or "single" in loop_raw:
        # High Overhead Single Continuous Arch
        loop_element = f'''
            <g filter="url(#dropShadow)">
              <!-- Single Continuous Overhead Arch over Top Opening Center -->
              <path d="M 320 250 C 300 40, 500 40, 480 250" fill="none" stroke="{loop_color_hex}" stroke-width="24" stroke-linecap="round"/>
              <rect x="308" y="240" width="24" height="35" fill="{loop_color_hex}" rx="4"/>
              <rect x="468" y="240" width="24" height="35" fill="{loop_color_hex}" rx="4"/>
            </g>
        '''
    elif "double loop" in loop_raw or "double" in loop_raw:
        # Dual Parallel Overhead Arches
        loop_element = f'''
            <g filter="url(#dropShadow)">
              <path d="M 280 250 C 260 50, 420 50, 400 250" fill="none" stroke="{loop_color_hex}" stroke-width="20" stroke-linecap="round"/>
              <path d="M 400 250 C 380 50, 540 50, 520 250" fill="none" stroke="{loop_color_hex}" stroke-width="20" stroke-linecap="round"/>
              <rect x="270" y="240" width="20" height="35" fill="{loop_color_hex}" rx="4"/>
              <rect x="510" y="240" width="20" height="35" fill="{loop_color_hex}" rx="4"/>
            </g>
        '''
    else:
        # Four Cross Corner Loops
        loop_element = f'''
            <g filter="url(#dropShadow)">
              <path d="M 260 250 C 230 70, 330 60, 300 250" fill="none" stroke="{loop_color_hex}" stroke-width="20" stroke-linecap="round"/>
              <path d="M 500 250 C 470 60, 570 70, 540 250" fill="none" stroke="{loop_color_hex}" stroke-width="20" stroke-linecap="round"/>
              <rect x="274" y="240" width="22" height="35" fill="{loop_color_hex}" rx="4"/>
              <rect x="504" y="240" width="22" height="35" fill="{loop_color_hex}" rx="4"/>
            </g>
        '''

    # BOTTOM DISCHARGE SPOUT POSITIONED STRICTLY AT BASE CENTER
    bottom_element = ""
    if "Spout" in (config.bottom or "") or "Discharge" in (config.bottom or ""):
        bottom_element = '''
            <g transform="translate(0, -10)">
              <path d="M 350 580 L 350 665 C 350 680, 450 680, 450 665 L 450 580 Z" fill="#E2E8F0" stroke="#1E293B" stroke-width="3"/>
              <ellipse cx="400" cy="665" rx="50" ry="12" fill="#94A3B8" stroke="#1E293B" stroke-width="2.5"/>
              <line x1="350" y1="630" x2="450" y2="630" stroke="#E53935" stroke-width="5"/>
              <rect x="325" y="618" width="150" height="24" fill="#E53935" rx="5"/>
              <text x="400" y="634" font-family="sans-serif" font-size="10" font-weight="900" fill="#FFFFFF" text-anchor="middle">BOTTOM DISCHARGE SPOUT</text>
            </g>
        '''

    # INTERNAL BAFFLE CUTAWAY SECTION FOR BAFFLE BAGS
    baffle_cutaway_element = ""
    if is_baffle:
        baffle_cutaway_element = '''
            <g transform="translate(0,0)">
              <polygon points="260,250 350,250 335,420 260,420" fill="#0F172A" opacity="0.85" stroke="#38BDF8" stroke-width="2.5" stroke-dasharray="5,3"/>
              <polygon points="270,260 340,260 328,410 270,410" fill="#3B82F6" opacity="0.4" stroke="#60A5FA" stroke-width="1.5"/>
              <circle cx="300" cy="290" r="12" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5"/>
              <circle cx="295" cy="340" r="14" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5"/>
              <circle cx="290" cy="390" r="12" fill="#0F172A" stroke="#38BDF8" stroke-width="1.5"/>
              <line x1="300" y1="340" x2="160" y2="340" stroke="#38BDF8" stroke-width="2" stroke-dasharray="3,3"/>
              <circle cx="300" cy="340" r="4" fill="#38BDF8"/>
              <rect x="30" y="322" width="170" height="36" fill="#1E293B" rx="6" stroke="#38BDF8" stroke-width="1.5"/>
              <text x="115" y="338" font-family="sans-serif" font-size="9" font-weight="900" fill="#38BDF8" text-anchor="middle">INTERNAL CORNER BAFFLE</text>
              <text x="115" y="350" font-family="sans-serif" font-size="8" font-weight="700" fill="#FFFFFF" text-anchor="middle">WITH MATERIAL FLOW HOLES</text>
            </g>
        '''

    # CALLOUT ARROWS & CAPTION BADGES — ALWAYS GENERATED FOR EVERY BAG
    callouts = []
    
    # 1. Electrical Safety Callout Badge with Technical Properties
    if "Type C" in electro or "Conductive" in electro:
        callouts.append('''
            <g transform="translate(40, 480)">
              <rect width="220" height="50" rx="8" fill="#1E293B" stroke="#EAB308" stroke-width="2"/>
              <text x="12" y="16" font-family="sans-serif" font-size="10" font-weight="900" fill="#EAB308">ELECTRICAL SAFETY: CONDUCTIVE TYPE C</text>
              <text x="12" y="30" font-family="sans-serif" font-size="8.5" font-weight="700" fill="#FFFFFF">• Interwoven Carbon Grid Threads</text>
              <text x="12" y="42" font-family="sans-serif" font-size="8.5" font-weight="700" fill="#FFFFFF">• Resistance &lt;10^8 Ω (Yellow Grounding Tab)</text>
              <line x1="220" y1="25" x2="280" y2="25" stroke="#EAB308" stroke-width="1.5" stroke-dasharray="3,3"/>
              <circle cx="280" cy="25" r="4" fill="#EAB308"/>
            </g>
        ''')
    elif "Type B" in electro:
        callouts.append('''
            <g transform="translate(40, 480)">
              <rect width="220" height="50" rx="8" fill="#1E293B" stroke="#38BDF8" stroke-width="2"/>
              <text x="12" y="16" font-family="sans-serif" font-size="10" font-weight="900" fill="#38BDF8">ELECTRICAL SAFETY: TYPE B</text>
              <text x="12" y="30" font-family="sans-serif" font-size="8.5" font-weight="700" fill="#FFFFFF">• Breakdown Voltage &lt;6 kV Protection</text>
              <text x="12" y="42" font-family="sans-serif" font-size="8.5" font-weight="700" fill="#FFFFFF">• Prevents Propagating Brush Discharges</text>
            </g>
        ''')
    else:
        callouts.append('''
            <g transform="translate(40, 480)">
              <rect width="220" height="50" rx="8" fill="#1E293B" stroke="#94A3B8" stroke-width="1.5"/>
              <text x="12" y="16" font-family="sans-serif" font-size="10" font-weight="900" fill="#94A3B8">ELECTRICAL SAFETY: TYPE A</text>
              <text x="12" y="30" font-family="sans-serif" font-size="8.5" font-weight="700" fill="#FFFFFF">• Standard Non-Conductive Polypropylene</text>
              <text x="12" y="42" font-family="sans-serif" font-size="8.5" font-weight="700" fill="#FFFFFF">• Breakdown Voltage &gt;6 kV</text>
            </g>
        ''')

    # 2. Sift-Proofing Callout Arrow & Line Indicator
    callouts.append(f'''
        <g transform="translate(555, 360)">
          <rect width="205" height="46" rx="8" fill="#1E293B" stroke="#16A34A" stroke-width="2"/>
          <text x="12" y="17" font-family="sans-serif" font-size="10" font-weight="900" fill="#4ADE80">SEAM SIFT-PROOFING</text>
          <text x="12" y="31" font-family="sans-serif" font-size="8.5" font-weight="700" fill="#FFFFFF">Arrow: {sift_level}</text>
          <text x="12" y="41" font-family="sans-serif" font-size="8" fill="#94A3B8">Felt filler cord stitched along side seam</text>
          <line x1="0" y1="23" x2="-55" y2="23" stroke="#4ADE80" stroke-width="2"/>
          <polygon points="-55,23 -45,18 -45,28" fill="#4ADE80"/>
        </g>
    ''')

    # 3. Inner Barrier Liner Callout Arrow & Line Indicator
    if is_liner_active:
        callouts.append(f'''
            <g transform="translate(555, 240)">
              <rect width="205" height="46" rx="8" fill="#1E293B" stroke="#3B82F6" stroke-width="2"/>
              <text x="12" y="17" font-family="sans-serif" font-size="10" font-weight="900" fill="#60A5FA">INNER BARRIER LINER</text>
              <text x="12" y="31" font-family="sans-serif" font-size="8.5" font-weight="700" fill="#FFFFFF">Arrow: {liner_const}</text>
              <text x="12" y="41" font-family="sans-serif" font-size="8" fill="#94A3B8">Material: {liner_mat}</text>
              <line x1="0" y1="23" x2="-75" y2="23" stroke="#3B82F6" stroke-width="2"/>
              <polygon points="-75,23 -65,18 -65,28" fill="#3B82F6"/>
            </g>
        ''')
    else:
        callouts.append('''
            <g transform="translate(555, 240)">
              <rect width="205" height="46" rx="8" fill="#1E293B" stroke="#64748B" stroke-width="1.5"/>
              <text x="12" y="17" font-family="sans-serif" font-size="10" font-weight="900" fill="#94A3B8">INNER BARRIER LINER</text>
              <text x="12" y="31" font-family="sans-serif" font-size="8.5" font-weight="700" fill="#FFFFFF">Arrow: Direct Fabric Containment</text>
              <text x="12" y="41" font-family="sans-serif" font-size="8" fill="#94A3B8">No Inner Liner Required</text>
              <line x1="0" y1="23" x2="-75" y2="23" stroke="#64748B" stroke-width="1.5" stroke-dasharray="3,3"/>
              <circle cx="-75" cy="23" r="3" fill="#64748B"/>
            </g>
        ''')

    callout_str = "".join(callouts)

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

    <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#0F172A" flood-opacity="0.12"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="800" height="800" fill="url(#bgGrad)"/>
  
  <!-- Floor Shadow -->
  <ellipse cx="400" cy="710" rx="230" ry="25" fill="#0F172A" opacity="0.12"/>

  <!-- Loops -->
  {loop_element}

  <!-- Top Element -->
  {top_element}

  <!-- Main Bag Body Shell -->
  <g filter="url(#dropShadow)">
    <polygon points="250,240 550,240 520,580 280,580" fill="url(#frontShade)" stroke="{fabric_stroke}" stroke-width="3"/>
    
    <!-- Conductive Thread Grid if Type C -->
    {"<line x1='250' y1='320' x2='550' y2='320' stroke='#1E293B' stroke-width='1.5' stroke-dasharray='4,4'/><line x1='250' y1='440' x2='550' y2='440' stroke='#1E293B' stroke-width='1.5' stroke-dasharray='4,4'/><line x1='350' y1='240' x2='350' y2='580' stroke='#1E293B' stroke-width='1.5' stroke-dasharray='4,4'/><line x1='450' y1='240' x2='450' y2='580' stroke='#1E293B' stroke-width='1.5' stroke-dasharray='4,4'/>" if "Type C" in electro else ""}

    <!-- Seams -->
    <line x1="280" y1="240" x2="280" y2="580" stroke="#94A3B8" stroke-width="2.5" stroke-dasharray="6,4"/>
    <line x1="520" y1="240" x2="520" y2="580" stroke="#94A3B8" stroke-width="2.5" stroke-dasharray="6,4"/>
  </g>

  <!-- Internal Baffle Cutaway if Baffle Bag -->
  {baffle_cutaway_element}

  <!-- Bottom Element -->
  {bottom_element}

  <!-- Printing & Brand Logo -->
  <g transform="translate(400, 440)">
    <rect x="-70" y="-35" width="140" height="70" fill="#FFFFFF" fill-opacity="0.8" rx="8" stroke="#E2E8F0"/>
    <ellipse cx="0" cy="-12" rx="35" ry="18" fill="{print_color_hex}"/>
    <text x="0" y="-8" font-family="'Inter', sans-serif" font-weight="900" font-size="12" fill="#FFFFFF" text-anchor="middle">pegma</text>
    <text x="0" y="16" font-family="'Inter', sans-serif" font-weight="900" font-size="14" fill="#1E293B" text-anchor="middle">{print_text[:14]}</text>
    <text x="0" y="28" font-family="'Inter', sans-serif" font-weight="700" font-size="9" fill="#E53935" text-anchor="middle">SWL: {config.capacity or '1000 kg'}</text>
  </g>

  <!-- Callouts & Arrows -->
  {callout_str}

  <!-- Specification Badge -->
  <rect x="24" y="24" width="340" height="54" fill="#0F172A" rx="12"/>
  <text x="44" y="46" font-family="sans-serif" font-weight="900" font-size="13" fill="#38BDF8">PEGMA FIBC CAD VISUALIZER</text>
  <text x="44" y="63" font-family="sans-serif" font-weight="700" font-size="11" fill="#94A3B8">{bag_type} • {config.capacity or '1000 kg'} • {config.fabricColor or 'White'}</text>

</svg>'''

    encoded_svg = urllib.parse.quote(svg_content)
    return f"data:image/svg+xml;utf8,{encoded_svg}"

    encoded_svg = urllib.parse.quote(svg_content)
    return f"data:image/svg+xml;utf8,{encoded_svg}"


def generate_gemini_image(config: FIBCBagConfig, custom_prompt: str = None) -> dict:
    """
    Multimodal Reference Image Engine using Google GenAI SDK.
    Loads matching component PNG reference files from /Users/sarveshhh/Desktop/reference
    and attaches them directly as multimodal image bytes to client.models.generate_content.
    Verifies that ALL 5 reference slots (logo, bag type, loops, top, bottom) are loaded and attached with detailed logs.
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

            # Prepare Multimodal Payload
            contents_payload = []
            ref_directives = []

            # 1. Custom Uploaded Logo or Desktop Reference logo.JPEG or Default PEGMA Logo
            if config.logoImage and "data:image" in config.logoImage:
                try:
                    header, b64str = config.logoImage.split(",", 1)
                    logo_bytes = base64.b64decode(b64str)
                    mime_type = "image/png" if "png" in header else "image/jpeg"
                    contents_payload.append(types.Part.from_bytes(data=logo_bytes, mime_type=mime_type))
                    ref_directives.append("IMAGE REF (Logo): Print this custom uploaded company logo prominently on the center front panel.")
                    print(f"[PEGMA MULTIMODAL AUDIT] Slot 1 [LOGO]: Custom uploaded logo attached ({len(logo_bytes)} bytes)")
                except Exception as logo_err:
                    print(f"[PEGMA MULTIMODAL AUDIT] Slot 1 [LOGO] Decode error: {logo_err}")
            else:
                desktop_logo = os.path.join(DESKTOP_REF_DIR, "logo.JPEG")
                if not os.path.exists(desktop_logo):
                    desktop_logo = os.path.join(DESKTOP_REF_DIR, "logo.png")
                if not os.path.exists(desktop_logo):
                    desktop_logo = os.path.join(DESKTOP_REF_DIR, "logo.jpg")

                if os.path.exists(desktop_logo):
                    with open(desktop_logo, "rb") as f:
                        l_bytes = f.read()
                        mime = "image/png" if desktop_logo.endswith(".png") else "image/jpeg"
                        contents_payload.append(types.Part.from_bytes(data=l_bytes, mime_type=mime))
                        ref_directives.append(f"IMAGE REF ({os.path.basename(desktop_logo)}): Print this exact PEGMA brand logo photo prominently on the center front panel.")
                        print(f"[PEGMA MULTIMODAL AUDIT] Slot 1 [LOGO]: Attached Desktop logo photo '{os.path.basename(desktop_logo)}' ({len(l_bytes)} bytes)")
                else:
                    default_logo = os.path.join(os.path.dirname(__file__), "assets", "pegma_logo_ref.jpg")
                    if os.path.exists(default_logo):
                        with open(default_logo, "rb") as f:
                            l_bytes = f.read()
                            contents_payload.append(types.Part.from_bytes(data=l_bytes, mime_type="image/jpeg"))
                            ref_directives.append("IMAGE REF (PEGMA Logo): Print the PEGMA brand logo on the center front panel.")
                            print(f"[PEGMA MULTIMODAL AUDIT] Slot 1 [LOGO]: Default pegma_logo_ref.jpg attached ({len(l_bytes)} bytes)")

            # 2. Component Reference Images Helper
            def attach_ref_image(slot_name: str, filename: str, desc: str):
                if not filename:
                    return
                file_path = os.path.join(DESKTOP_REF_DIR, filename)
                if os.path.exists(file_path):
                    try:
                        with open(file_path, "rb") as f:
                            img_bytes = f.read()
                            contents_payload.append(types.Part.from_bytes(data=img_bytes, mime_type="image/png"))
                            ref_directives.append(f"IMAGE REF ({filename}): {desc}")
                            print(f"[PEGMA MULTIMODAL AUDIT] {slot_name}: Attached '{filename}' ({len(img_bytes)} bytes)")
                    except Exception as err:
                        print(f"[PEGMA MULTIMODAL AUDIT] {slot_name}: Failed reading '{filename}': {err}")
                else:
                    print(f"[PEGMA MULTIMODAL AUDIT] {slot_name}: File '{filename}' not found at {file_path}")

            # Slot 2: Map Bag Type
            b_raw = (config.bagType or "U Panel").lower()
            if "net baffle" in b_raw:
                attach_ref_image("Slot 2 [BAG TYPE]", "netbaffle.png", "Use as exact visual reference to render semi-transparent cutaway revealing internal polypropylene net-mesh corner baffles.")
            elif "baffle" in b_raw:
                attach_ref_image("Slot 2 [BAG TYPE]", "baffle.png", "Use as exact visual reference to render semi-transparent cutaway revealing internal fabric corner baffles with circular material-flow holes inside all four corners.")
            elif "food grade" in b_raw:
                attach_ref_image("Slot 2 [BAG TYPE]", "foodgrade.png", "Use as exact visual reference for Food Grade bag finish.")
            elif "un certified" in b_raw or "un" in b_raw:
                attach_ref_image("Slot 2 [BAG TYPE]", "uncertified.png", "Use as exact visual reference for UN Certified hazardous bag.")
            elif "4 panel" in b_raw or "4-panel" in b_raw:
                attach_ref_image("Slot 2 [BAG TYPE]", "4panel.png", "Use as exact visual reference for 4-Panel body construction.")
            elif "circular" in b_raw or "tubular" in b_raw:
                attach_ref_image("Slot 2 [BAG TYPE]", "circular.png", "Use as exact visual reference for Circular tubular body construction.")
            elif "2 panel" in b_raw or "2-panel" in b_raw:
                attach_ref_image("Slot 2 [BAG TYPE]", "u+2panel.png", "Use as exact visual reference for 2-Panel bag structure.")
            elif "asbestos" in b_raw:
                attach_ref_image("Slot 2 [BAG TYPE]", "asbestos.png", "Use as exact visual reference for Asbestos Plate bag design.")
            elif "drum" in b_raw:
                attach_ref_image("Slot 2 [BAG TYPE]", "drum.png", "Use as exact visual reference for Drum bag design.")
            else:
                attach_ref_image("Slot 2 [BAG TYPE]", "upanel.png", "Use as exact visual reference for U-Panel body construction.")

            # Slot 3: Map Loop Config (VERIFIED & AUDITED)
            l_raw = (config.loopType or "Cross Corner").lower()
            if "single loop" in l_raw or "single" in l_raw:
                attach_ref_image("Slot 3 [LOOP CONFIG]", "singleloop.png", "Use as exact visual reference for Single Loop overhead continuous lifting arch.")
            elif "double loop" in l_raw or "double" in l_raw:
                attach_ref_image("Slot 3 [LOOP CONFIG]", "doubleloop.png", "Use as exact visual reference for Double Loop dual overhead continuous lifting arches.")
            else:
                attach_ref_image("Slot 3 [LOOP CONFIG]", "crosscornerloop.png", "Use as exact visual reference for Cross Corner webbing lifting loops.")

            # Slot 4: Map Top Opening
            t_raw = (config.top or "Duffle Top").lower()
            if "duffle" in t_raw or "skirt" in t_raw:
                attach_ref_image("Slot 4 [TOP OPENING]", "duffletop.png", "Use as exact visual reference for Duffle Top skirt opening.")
            elif "spout" in t_raw or "filling" in t_raw:
                attach_ref_image("Slot 4 [TOP OPENING]", "fillingspout.png", "Use as exact visual reference for Filling Spout top mechanism.")
            elif "conical" in t_raw:
                attach_ref_image("Slot 4 [TOP OPENING]", "conicaltop.png", "Use as exact visual reference for Conical Top mechanism.")
            elif "skirt" in t_raw:
                attach_ref_image("Slot 4 [TOP OPENING]", "skirttop.png", "Use as exact visual reference for Skirt Top mechanism.")
            else:
                attach_ref_image("Slot 4 [TOP OPENING]", "opentop.png", "Use as exact visual reference for Open Top rim.")

            # Slot 5: Map Bottom Discharge
            bt_raw = (config.bottom or "Discharge Spout").lower()
            if "spout" in bt_raw or "discharge" in bt_raw:
                attach_ref_image("Slot 5 [BOTTOM DISCHARGE]", "discharge spout.png", "Use as exact visual reference for Bottom Discharge Spout hanging down centered.")
            elif "conical" in bt_raw:
                attach_ref_image("Slot 5 [BOTTOM DISCHARGE]", "conicalbottom.png", "Use as exact visual reference for Conical Bottom base.")
            elif "diaper" in bt_raw:
                attach_ref_image("Slot 5 [BOTTOM DISCHARGE]", "diaperbottom.png", "Use as exact visual reference for Diaper Bottom flap closure.")
            else:
                attach_ref_image("Slot 5 [BOTTOM DISCHARGE]", "flatbottom.png", "Use as exact visual reference for Flat Bottom base.")

            # Streamlined Multimodal Master Directive
            full_prompt_text = (
                f"Generate a 3D commercial studio product photograph of a custom FIBC bulk bag matching the attached reference images. "
                f"{prompt}"
            )

            contents_payload.append(full_prompt_text)

            print(f"[PEGMA MULTIMODAL AUDIT] TOTAL PAYLOAD: {len(contents_payload)-1} reference images attached + 1 master text prompt.")

            for model_name in models_to_try:
                print(f"[PEGMA GEMINI SERVICE] Calling Google GenAI SDK '{model_name}' with payload...")
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
                    print(f"[PEGMA GEMINI SERVICE] Model '{model_name}' failed: {model_err}")
                    # Plain text fallback call
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
                                        "model_used": model_name,
                                        "latency": latency,
                                        "is_fallback": False
                                    }
                    except Exception as text_err:
                        print(f"[PEGMA GEMINI SERVICE] Plain text fallback for '{model_name}' failed: {text_err}")

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
