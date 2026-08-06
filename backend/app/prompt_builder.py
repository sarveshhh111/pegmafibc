from app.schemas import FIBCBagConfig

def is_selected(val: str) -> bool:
    """Helper to check if a spec option is explicitly selected by the user."""
    if not val:
        return False
    v = str(val).strip().lower()
    return v not in ["not selected", "notselected", "none", "no", "false", ""]

def build_gemini_prompt(config: FIBCBagConfig) -> str:
    """
    Crisp, punchy prompt generator for Google Gemini 2.5 Flash Image.
    Only includes directives for options explicitly selected by the user.
    Unselected options are completely omitted.
    """
    parts = []

    # 1. Base Bag Type & Reference File Binding
    if is_selected(config.bagType):
        b_type = config.bagType.strip()
        if "Net Baffle" in b_type:
            parts.append("Bag Type: Net Baffle Bag (Q-Bag). Follow attached netbaffle.png reference for internal net-mesh corner baffles.")
        elif "Baffle" in b_type or "Q-Bag" in b_type:
            parts.append("Bag Type: Baffle Bag (Q-Bag). Follow attached baffle.png reference for internal fabric corner baffles with circular flow holes.")
        elif "Food Grade" in b_type:
            parts.append("Bag Type: Food Grade FIBC. Follow attached foodgrade.png reference for clean room finish.")
        elif "UN Certified" in b_type:
            parts.append("Bag Type: UN Certified FIBC. Follow attached uncertified.png reference.")
        elif "4-Panel" in b_type or "4 Panel" in b_type:
            parts.append("Bag Type: 4-Panel FIBC. Follow attached 4panel.png reference for 4 vertical edge seams.")
        elif "Circular" in b_type or "Tubular" in b_type:
            parts.append("Bag Type: Circular FIBC. Follow attached circular.png reference for tubular seamless body.")
        elif "2 Panel" in b_type or "2-Panel" in b_type:
            parts.append("Bag Type: 2-Panel FIBC. Follow attached u+2panel.png reference.")
        elif "Asbestos" in b_type:
            parts.append("Bag Type: Asbestos Plate Disposal Container Box. 3D CONTAINER GEOMETRY: This is a LOW-PROFILE 3D RECTANGULAR CONTAINER BOX (low height container box with ~20-30 cm structured vertical side walls, long rectangular horizontal proportions, exactly like attached asbestos.png reference image). It has noticeable 3D height and thickness (not paper flat), rectangular box shape, flat bound side seams, and full top flap closure. DO NOT render a tall 1-meter vertical cube bag. DO NOT render a completely flat 2D sheet with 0 height. It MUST have a distinct low-profile 3D rectangular box volume with ~20-30 cm height, matching attached asbestos.png.")
        elif "Drum" in b_type:
            parts.append("Bag Type: Drum Bag. Follow attached drum.png reference.")
        else:
            parts.append(f"Bag Type: {b_type}. Follow attached upanel.png reference for U-Panel body.")
    else:
        parts.append("Bag Type: White FIBC Bulk Bag.")

    # 2. Capacity, Fabric & GSM
    spec_tokens = []
    if is_selected(config.capacity):
        spec_tokens.append(f"SWL {config.capacity.strip()}")
    
    color = config.fabricColor.strip() if is_selected(config.fabricColor) else "White"
    gsm = config.gsm.strip() if is_selected(config.gsm) else ""
    spec_tokens.append(f"{color} {gsm} woven polypropylene fabric".strip())

    parts.append(f"Spec: {' | '.join(spec_tokens)}.")

    # 3. Lifting Loop Configuration & Reference
    if is_selected(config.loopType):
        l_type = config.loopType.strip()
        l_color = config.loopColor.strip().upper() if is_selected(config.loopColor) else "BLUE"
        
        if "single loop" in l_type.lower() or "single" in l_type.lower():
            parts.append(f"Loops: Single Loop ({l_color}). Follow attached singleloop.png reference for one continuous overhead arch over top center.")
        elif "double loop" in l_type.lower() or "double" in l_type.lower():
            parts.append(f"Loops: Double Loop ({l_color}). Follow attached doubleloop.png reference for two parallel continuous overhead arches.")
        elif "cross corner" in l_type.lower():
            parts.append(f"Loops: Cross Corner ({l_color}). Follow attached crosscornerloop.png reference for 4 corner webbing loops.")
        else:
            parts.append(f"Loops: {l_type} ({l_color}).")

    # 4. Top Opening & Reference
    if is_selected(config.top):
        top = config.top.strip()
        if "Duffle" in top or "Skirt" in top:
            parts.append("Top: Duffle Top. Follow attached duffletop.png reference for gathered skirt top.")
        elif "Spout" in top or "Filling" in top:
            parts.append("Top: Filling Spout. Follow attached fillingspout.png reference for cylindrical inlet spout.")
        elif "Open" in top:
            parts.append("Top: Open Top. Follow attached opentop.png reference.")
        elif "Conical" in top:
            parts.append("Top: Conical Top. Follow attached conicaltop.png reference.")
        elif "Skirt" in top:
            parts.append("Top: Skirt Top. Follow attached skirttop.png reference.")
        else:
            parts.append(f"Top: {top}.")

    # 5. Bottom Discharge & Reference
    if is_selected(config.bottom):
        bottom = config.bottom.strip()
        if "Spout" in bottom or "Discharge" in bottom:
            parts.append("Bottom: Discharge Spout. Follow attached discharge spout.png reference (suspended bag base).")
        elif "Flat" in bottom:
            parts.append("Bottom: Flat Bottom. Follow attached flatbottom.png reference (wooden pallet resting base).")
        elif "Conical" in bottom:
            parts.append("Bottom: Conical Bottom. Follow attached conicalbottom.png reference.")
        elif "Diaper" in bottom:
            parts.append("Bottom: Diaper Bottom. Follow attached diaperbottom.png reference.")
        else:
            parts.append(f"Bottom: {bottom}.")

    # 6. Inner Liner Directive (Only if selected)
    if is_selected(config.linerRequired) or is_selected(config.linerType) or is_selected(config.linerConstruction):
        l_const = config.linerConstruction or config.linerType or "Loose Liner"
        l_mat = config.linerMaterial or "PE"
        if is_selected(l_const):
            parts.append(f"Liner: {l_const.strip()} ({l_mat.strip()}). Draw callout arrow pointing to top opening labeled 'INNER BARRIER LINER'.")

    # 7. Seam Sift-Proofing Directive (Only if selected)
    if is_selected(config.siftProofing):
        sift = config.siftProofing.strip()
        parts.append(f"Sift-Proofing: {sift}. Draw callout arrow pointing to felt cord side seam labeled 'SEAM SIFT-PROOFING'.")

    # 8. Electrical Safety Directive (Only if selected)
    if is_selected(config.electrostaticType):
        electro = config.electrostaticType.strip()
        if "Type C" in electro or "Conductive" in electro:
            parts.append("Electrical: Conductive Type C (carbon grid). Include bottom caption box: 'ELECTRICAL SAFETY: CONDUCTIVE TYPE C (<10^8 Ω)'.")
        elif "Type B" in electro:
            parts.append("Electrical: Type B (breakdown <6kV). Include bottom caption box: 'ELECTRICAL SAFETY: TYPE B (<6kV)'.")
        elif "Type A" in electro:
            parts.append("Electrical: Type A (non-conductive). Include bottom caption box: 'ELECTRICAL SAFETY: TYPE A (>6kV)'.")
        else:
            parts.append(f"Electrical: {electro}.")

    # 9. Brand Logo Printing
    p_text = (config.printing or "PEGMA").strip()
    if p_text.lower() == "no printing":
        parts.append("Printing: Plain clean unprinted woven polypropylene fabric body with no logo or text.")
    elif config.logoImage and len(config.logoImage) > 10:
        logo_name = config.logoFileName or "Uploaded Custom Logo"
        parts.append(f"MANDATORY BRAND LOGO: Print attached custom company logo ('{logo_name}') prominently on the center front panel. Render with sharp vector precision, bold vibrant ink, high contrast, clean edges, and authentic screen-printed texture on the woven fabric.")
    else:
        parts.append(f"MANDATORY BRAND LOGO: Print official '{p_text}' brand logo (from attached logo.JPEG) prominently on the center front panel. Render in sharp, vibrant red and black vector screen-print ink, perfectly centered, high contrast, crisp lettering, and photorealistic commercial packaging finish.")

    # 10. Studio Photography Style
    parts.append("Style: Photorealistic 3D commercial studio photograph, clean studio lighting, high resolution.")

    # Join cleanly into crisp structured directive list
    return " | ".join(parts)
