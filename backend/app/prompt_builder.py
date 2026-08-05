from app.schemas import FIBCBagConfig

def build_gemini_prompt(config: FIBCBagConfig) -> str:
    """
    Ultra-accurate, high-impact prompt engine for Google Gemini API.
    Handles every permutation & combination of FIBC bulk bag specifications with strict visual directives.
    """
    
    # 1. Structural Construction Type
    bag_type = (config.bagType or "").strip()
    if not bag_type or bag_type.lower() in ["none", "standard"]:
        bag_type_desc = "Standard U-Panel FIBC bulk bag construction"
    elif "4-Panel" in bag_type:
        bag_type_desc = "Heavy-duty 4-Panel FIBC bulk bag with crisp vertical corner seams creating a square cubic shape"
    elif "Baffle" in bag_type:
        bag_type_desc = "Baffle Bag (Q-Bag) with internal corner baffles preventing bulging, maintaining a perfect square form"
    elif "Circular" in bag_type or "Tubular" in bag_type:
        bag_type_desc = "Seamless circular tubular woven FIBC bulk bag without vertical side seams"
    elif "Single Loop" in bag_type or "Double Loop" in bag_type:
        bag_type_desc = f"{bag_type} FIBC bulk bag with continuous overhead lifting handle extending from the top opening"
    else:
        bag_type_desc = f"{bag_type} FIBC bulk bag construction"

    # 2. Fabric Color & GSM
    color = (config.fabricColor or "White").strip()
    if not color or color.lower() == "none":
        color = "White"
    gsm = (config.gsm or "180 GSM").strip()
    fabric_str = f"Fabric: High-tenacity {color} woven polypropylene ({gsm})."

    # 3. Webbing Lifting Loops (Color, Count & Type)
    l_type = (config.loopType or "").strip()
    l_color = (config.loopColor or "").strip()
    
    if not l_type or l_type.lower() == "none":
        loop_str = "Overhead woven webbing lifting loops at top corners."
    else:
        l_color_str = l_color.upper() if l_color and l_color.lower() != "none" else "matching"
        loop_str = f"Four heavy-duty {l_color_str} woven webbing lifting loops attached in {l_type} style at top corners."

    # 4. Top Feature / Closure Mechanism
    top = (config.top or "").strip()
    if not top or top.lower() in ["none", "open top"]:
        top_str = "Top feature: Open hemmed top opening."
    elif "Filling Spout" in top:
        top_str = "Top feature: Cylindrical fabric filling spout tube centered on top base panel with drawstring tie."
    elif "Duffle" in top:
        top_str = "Top feature: Flexible duffle top skirt with red drawstring closure tie."
    else:
        top_str = f"Top feature: {top}."

    # 5. Bottom Discharge Mechanism & Mid-Air Elevation Positioning
    bottom = (config.bottom or "").strip()
    if not bottom or bottom.lower() in ["none", "flat bottom", "flat plain base"]:
        bottom_str = "Bottom feature: Solid flat closed base resting evenly."
    elif "Spout" in bottom or "Discharge" in bottom:
        bottom_str = (
            "ELEVATION & BASE POSITIONING: The bag is suspended in mid-air by its top loops. "
            "PROMINENT BOTTOM FEATURE: A cylindrical discharge spout tube hangs cleanly down from the EXACT CENTER BASE PANEL beneath the bag, tied with a drawstring cord."
        )
    else:
        bottom_str = f"Bottom feature: {bottom} mechanism."

    # 6. Electrostatic Safety Classification
    electro = (config.electrostaticType or "").strip()
    if "Type C" in electro or "Conductive" in electro:
        electro_str = "ELECTROSTATIC SAFETY: Interwoven grid of black carbon conductive thread lines with yellow grounding tabs at corner seams."
    elif "Type D" in electro or "Dissipative" in electro:
        electro_str = "ELECTROSTATIC SAFETY: Static dissipative fabric with visible anti-static yarns."
    elif "Type B" in electro:
        electro_str = "ELECTROSTATIC SAFETY: Type B breakdown voltage resistant polypropylene fabric."
    else:
        electro_str = ""

    # 7. Inner Barrier Liner
    liner = (config.linerType or "").strip()
    if liner and liner.lower() not in ["none", "no liner"]:
        liner_str = f"Liner: Fitted internal {liner} barrier."
    else:
        liner_str = ""

    # 8. Printing & Logo Branding
    print_text = (config.printing or "").strip()
    print_color = (config.printingColor or "").strip()
    if print_text and print_text.lower() not in ["none", "no printing", "unprinted"]:
        color_spec = f"in bold {print_color} ink" if print_color and print_color.lower() != "none" else ""
        print_str = f"LOGO BRANDING: Printed '{print_text}' logo {color_spec} centered on front face."
    else:
        print_str = "Surface: Clean unprinted fabric."

    # 9. Extra ADDS & Accessories Specifications
    accs = config.accessories or []
    valid_accs = [a for a in accs if a and a.lower() != "none"]
    acc_str = f"Special Features: {', '.join(valid_accs)}." if valid_accs else ""

    # 10. Studio Photography Directives
    capacity_str = f"{config.capacity} SWL" if config.capacity and config.capacity.lower() != "none" else "1000 kg SWL"
    camera_str = "Commercial 3D studio product photograph, soft studio light, neutral light-gray background (#F8FAFC), 8k resolution, sharp detail focus."

    # Compile Final Crisp Directives
    components = [
        f"Commercial studio product photograph of a {capacity_str} {bag_type_desc}.",
        fabric_str,
        electro_str,
        liner_str,
        loop_str,
        top_str,
        bottom_str,
        print_str,
        acc_str,
        camera_str
    ]

    clean_prompt = " ".join([c.strip() for c in components if c.strip()])
    return clean_prompt


def build_exploded_view_prompt(config: FIBCBagConfig) -> str:
    """
    Crisp 3D CAD Exploded Assembly View prompt.
    """
    bag_type = config.bagType or "U-Panel"
    loop_color = (config.loopColor or "Blue").upper()
    fabric_color = config.fabricColor or "White"
    liner = config.linerType or "PE Liner"
    print_text = config.printing or "PEGMA"
    bottom = config.bottom or "Discharge Spout"
    top = config.top or "Duffle Top"
    capacity = config.capacity or "1000 kg"

    return (
        f"Crisp 3D CAD exploded view diagram of a {capacity} {bag_type} FIBC bulk bag. "
        f"Components separated vertically along central alignment axis: "
        f"1. {top} skirt floating at top; "
        f"2. {loop_color} webbing lifting loops detached at corners; "
        f"3. Inner liner ({liner}) pulled out vertically; "
        f"4. Main {fabric_color} PP woven body shell with '{print_text}' logo; "
        f"5. Discharge spout mechanism ({bottom}) floating directly beneath center base panel. "
        f"Style: Dark blueprint aesthetic (#0F172A), cyan callout guidelines (#38BDF8), isometric CAD render, 8k resolution."
    )
