from app.schemas import FIBCBagConfig

def build_gemini_prompt(config: FIBCBagConfig) -> str:
    """
    Ultra-crisp, high-impact prompt engine for Google Gemini API.
    Uses mid-air suspended product elevation so bottom discharge spouts are 100% visible beneath the base.
    """
    
    # 1. Bag Type
    bag_type = (config.bagType or "U-Panel").strip()

    # 2. Fabric Color & GSM
    color = (config.fabricColor or "White").strip()
    gsm = (config.gsm or "180 GSM").strip()

    # 3. Loops (STRICT COLOR & ATTACHMENT)
    l_type = (config.loopType or "Cross Corner").strip()
    l_color = (config.loopColor or "Blue").upper()
    loop_str = f"Four heavy-duty {l_color} woven webbing lifting loops attached in {l_type} style at top corners."

    # 4. Top Opening
    top = (config.top or "Duffle Top").strip()
    top_str = f"Top feature: {top} skirt with drawstring tie."

    # 5. Bottom Discharge (SUSPENDED MID-AIR ELEVATION FOR 100% BASE SPOUT VISIBILITY)
    bottom = (config.bottom or "Discharge Spout").strip()
    if "Spout" in bottom or "Discharge" in bottom:
        bottom_str = (
            "THE BAG IS SUSPENDED IN MID-AIR BY ITS TOP LOOPS, ELEVATING THE BASE OFF THE GROUND. "
            "PROMINENT BOTTOM FEATURE: A cylindrical discharge spout hangs down cleanly from the EXACT CENTER BASE PANEL beneath the bag, tied tightly with a red cord."
        )
    else:
        bottom_str = "Flat closed bottom base resting evenly on a wooden pallet."

    # 6. Printing
    print_text = (config.printing or "PEGMA").strip()
    print_color = (config.printingColor or "Red").strip()
    print_str = f"Printed '{print_text}' logo in bold {print_color} ink on center front." if print_text.lower() != "no printing" else ""

    # 7. Electrostatic Safety (Only if non-default)
    electro = (config.electrostaticType or "Type A").strip()
    electro_str = "Interwoven black conductive carbon thread grid with yellow grounding tabs." if "Type C" in electro else ""

    # 8. Inner Liner (Only if non-default)
    liner = (config.linerType or "No Liner").strip()
    liner_str = f"Inner barrier liner: {liner}." if liner != "No Liner" else ""

    # 9. Extra Adds / Accessories
    accs = config.accessories or []
    acc_str = f"Specs: {', '.join(accs)}." if accs else ""

    # 10. Studio Camera & Render Directives
    camera_str = "Studio shot, light gray background (#F7F8FA), soft neutral lighting, 8k resolution, razor-sharp focus."

    # Compile Crisp, Short, Punchy Prompt
    parts = [
        f"Commercial studio product photograph of a {config.capacity} {bag_type} FIBC bulk bag.",
        f"Material: High-tenacity {color} woven polypropylene fabric ({gsm}).",
        electro_str,
        liner_str,
        loop_str,
        top_str,
        bottom_str,  # Mid-air suspended bottom spout
        print_str,
        acc_str,
        camera_str
    ]

    clean_prompt = " ".join([p.strip() for p in parts if p.strip()])
    return clean_prompt


def build_exploded_view_prompt(config: FIBCBagConfig) -> str:
    """
    Crisp CAD Exploded Assembly View prompt.
    """
    bag_type = config.bagType or "U-Panel"
    loop_color = (config.loopColor or "Blue").upper()
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
