from app.schemas import FIBCBagConfig

def build_gemini_prompt(config: FIBCBagConfig) -> str:
    """
    Ultra-crisp, high-impact prompt engine for Google Gemini API.
    Guarantees exact selection matching and mid-air suspended product elevation
    so bottom discharge spouts are 100% visible beneath the base.
    """
    
    # 1. Bag Construction
    raw_type = (config.bagType or "U-Panel").strip()
    if raw_type.lower() in ["none of these", "none", "standard"]:
        bag_type = "standard rectangular FIBC bulk bag"
    else:
        bag_type = f"{raw_type} FIBC bulk bag"

    # 2. Specs
    color = (config.fabricColor or "White").strip()
    capacity = (config.capacity or "1000 kg").strip()
    gsm = (config.gsm or "180 GSM").strip()

    # 3. Loops (STRICT COLOR & ATTACHMENT)
    l_type = (config.loopType or "Cross Corner").strip()
    l_color = (config.loopColor or "Blue").strip()
    loop_str = f"4 heavy-duty {l_color} woven webbing loops in {l_type} style attached at top corners."

    # 4. Top Feature
    top = (config.top or "Duffle Top").strip()
    top_str = f"Top feature: {top}."

    # 5. Bottom Feature (Mid-air suspended elevation so bottom spout hangs centered below base)
    bottom = (config.bottom or "Discharge Spout").strip()
    if "spout" in bottom.lower() or "discharge" in bottom.lower():
        bottom_str = (
            "BAG IS SUSPENDED IN MID-AIR BY ITS TOP LOOPS FOR 100% BASE CLEARANCE. "
            f"Bottom feature: A prominent {bottom} hangs cleanly down from the EXACT CENTER BASE PANEL underneath."
        )
    else:
        bottom_str = f"Bottom feature: Closed flat base panel ({bottom})."

    # 6. Printing
    print_text = (config.printing or "PEGMA").strip()
    print_color = (config.printingColor or "Red").strip()
    if print_text.lower() not in ["no printing", "none", "no logo"]:
        print_str = f"Printed brand logo '{print_text}' in bold {print_color} ink on center front panel."
    else:
        print_str = "Plain fabric without printing."

    # 7. Electrostatic Safety
    electro = (config.electrostaticType or "Type A").strip()
    electro_str = "Type C Electrostatic Safety: Interwoven conductive carbon thread grid with grounding tab." if "Type C" in electro else ""

    # 8. Inner Liner
    liner = (config.linerType or "No Liner").strip()
    liner_str = f"Fitted with {liner} inner barrier." if liner and liner != "No Liner" else ""

    # 9. Extra Specifications
    accs = config.accessories or []
    acc_str = f"Specifications: {', '.join(accs)}." if accs else ""

    # Compile Ultra-Crisp, Direct Visual Directives
    prompt_components = [
        f"Commercial studio product photograph of a {capacity} SWL {color} {bag_type} ({gsm}).",
        loop_str,
        top_str,
        bottom_str,
        print_str,
        electro_str,
        liner_str,
        acc_str,
        "Studio lighting, light gray studio background (#F8FAFC), 8k resolution, photorealistic industrial finish."
    ]

    clean_prompt = " ".join([c.strip() for c in prompt_components if c.strip()])
    return clean_prompt


def build_exploded_view_prompt(config: FIBCBagConfig) -> str:
    """
    Crisp CAD Exploded Assembly View prompt.
    """
    raw_type = (config.bagType or "U-Panel").strip()
    bag_type = "Standard FIBC" if raw_type.lower() in ["none of these", "none"] else raw_type
    loop_color = (config.loopColor or "Blue").strip()
    fabric_color = config.fabricColor or "White"
    liner = config.linerType or "PE Liner"
    print_text = config.printing or "PEGMA"
    bottom = config.bottom or "Discharge Spout"
    top = config.top or "Duffle Top"

    exploded_prompt = (
        f"Crisp 3D CAD exploded view diagram of a {config.capacity} {bag_type} FIBC bulk bag. "
        f"Components separated vertically along central alignment axis: "
        f"1. {top} skirt floating at top; "
        f"2. {loop_color} webbing lifting loops detached at corners; "
        f"3. Inner liner ({liner}) pulled out vertically; "
        f"4. Main {fabric_color} PP woven body shell with '{print_text}' logo; "
        f"5. Discharge spout mechanism ({bottom}) floating directly beneath center base panel. "
        f"Style: Dark blueprint aesthetic (#0F172A), cyan callout guidelines (#38BDF8), isometric CAD render, 8k resolution."
    )
    
    return exploded_prompt
