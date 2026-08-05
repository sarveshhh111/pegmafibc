from app.schemas import FIBCBagConfig

def build_gemini_prompt(config: FIBCBagConfig) -> str:
    """
    Crisp, punchy, to-the-point prompt generator for Google Gemini 2.5 Flash Image.
    Forces strict visual adherence to attached reference PNG images.
    """
    parts = []

    # 1. Base Bag Type & Reference File Binding
    b_type = (config.bagType or "U Panel").strip()
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
        parts.append("Bag Type: Asbestos Plate Bag. Follow attached asbestos.png reference.")
    elif "Drum" in b_type:
        parts.append("Bag Type: Drum Bag. Follow attached drum.png reference.")
    else:
        parts.append(f"Bag Type: {b_type}. Follow attached upanel.png reference for U-Panel body.")

    # 2. Capacity, Fabric & GSM
    color = (config.fabricColor or "White").strip()
    gsm = (config.gsm or "180 GSM").strip()
    capacity = (config.capacity or "1000 kg").strip()
    parts.append(f"Spec: SWL {capacity} | {color} {gsm} woven polypropylene fabric.")

    # 3. Lifting Loop Configuration & Reference
    l_type = (config.loopType or "Cross Corner").strip()
    l_color = (config.loopColor or "Blue").strip().upper()
    
    if "single loop" in l_type.lower() or "single" in l_type.lower():
        parts.append(f"Loops: Single Loop ({l_color}). Follow attached singleloop.png reference for one continuous overhead arch over top center.")
    elif "double loop" in l_type.lower() or "double" in l_type.lower():
        parts.append(f"Loops: Double Loop ({l_color}). Follow attached doubleloop.png reference for two parallel continuous overhead arches.")
    else:
        parts.append(f"Loops: Cross Corner ({l_color}). Follow attached crosscornerloop.png reference for 4 corner webbing loops.")

    # 4. Top Opening & Reference
    top = (config.top or "Duffle Top").strip()
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
    bottom = (config.bottom or "Discharge Spout").strip()
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

    # 6. Inner Liner Callout Arrow Directive
    liner_req = (config.linerRequired or "Yes").strip()
    if liner_req.lower() == "yes":
        l_const = (config.linerConstruction or config.linerType or "Loose Liner").strip()
        l_mat = (config.linerMaterial or "Standard PE").strip()
        parts.append(f"Liner: {l_const} ({l_mat}). Draw callout arrow pointing to top opening labeled 'INNER BARRIER LINER'.")
    else:
        parts.append("Liner: None. Draw callout arrow pointing to top opening labeled 'INNER BARRIER LINER: None'.")

    # 7. Seam Sift-Proofing Callout Arrow Directive
    sift = (config.siftProofing or "Single Sift Proof").strip()
    if sift.lower() in ["none"]:
        parts.append("Sift-Proofing: Standard Stitching. Draw callout arrow pointing to side seam labeled 'SEAM SIFT-PROOFING'.")
    else:
        parts.append(f"Sift-Proofing: {sift}. Draw callout arrow pointing to felt cord side seam labeled 'SEAM SIFT-PROOFING'.")

    # 8. Electrical Safety Technical Property Caption Directive
    electro = (config.electrostaticType or "Type A").strip()
    if "Type C" in electro or "Conductive" in electro:
        parts.append("Electrical: Conductive Type C (carbon grid). Include bottom caption box: 'ELECTRICAL SAFETY: CONDUCTIVE TYPE C (<10^8 Ω)'.")
    elif "Type B" in electro:
        parts.append("Electrical: Type B (breakdown <6kV). Include bottom caption box: 'ELECTRICAL SAFETY: TYPE B (<6kV)'.")
    else:
        parts.append("Electrical: Type A (non-conductive). Include bottom caption box: 'ELECTRICAL SAFETY: TYPE A (>6kV)'.")

    # 9. Brand Logo Printing
    print_text = (config.printing or "PEGMA").strip()
    if config.logoImage:
        logo_name = config.logoFileName or "Uploaded Logo"
        parts.append(f"Logo: Print attached custom company logo ('{logo_name}') on front panel.")
    else:
        parts.append(f"Logo: Print '{print_text}' logo on front panel.")

    # 10. Studio Photography Style
    parts.append("Style: Photorealistic 3D commercial studio photograph, clean studio lighting, high resolution.")

    # Join cleanly into crisp structured directive list
    return " | ".join(parts)
