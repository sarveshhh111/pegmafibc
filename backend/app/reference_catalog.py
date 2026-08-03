"""
PEGMA FIBC Master Reference Catalog
Maps each product type to technical specifications, visual markers, and prompt guidance.
"""

PRODUCT_REFERENCE_CATALOG = {
    "U-Panel": {
        "category": "Construction",
        "description": "Constructed from a single U-shaped main body panel forming base and 2 side walls, with 2 separate side panels.",
        "prompt_guidance": "Single U-shaped main fabric panel forming bottom and two opposite sides, with two vertical side seams."
    },
    "4-Panel": {
        "category": "Construction",
        "description": "Four separate side panels sewn to a square base panel, offering high dimensional stability.",
        "prompt_guidance": "Four distinct side panels sewn together at all four vertical corner seams to form a clean square box profile."
    },
    "Circular": {
        "category": "Construction",
        "description": "Tubular seamless woven body with no vertical side seams.",
        "prompt_guidance": "Continuous tubular seamless woven polypropylene body with no vertical corner seams."
    },
    "2-Panel": {
        "category": "Construction",
        "description": "Two-panel construction, commonly used for single or double loop bags.",
        "prompt_guidance": "Two main fabric panels forming front, back, and base with side seams."
    },
    "Baffle": {
        "category": "Baffle Bags",
        "description": "Q-Bag with internal fabric baffles across four corners to maintain cubic shape.",
        "prompt_guidance": "Internal fabric corner baffles preventing bulging, maintaining an exact square cubic box shape."
    },
    "Circular Baffle": {
        "category": "Baffle Bags",
        "description": "Seamless tubular body fitted with internal corner baffles.",
        "prompt_guidance": "Tubular seamless woven body with internal corner baffles for non-bulging shape."
    },
    "Net Baffle Bag": {
        "category": "Baffle Bags",
        "description": "Internal net-mesh baffles for free flow of granular materials.",
        "prompt_guidance": "Internal heavy-duty polypropylene net mesh baffles visible inside top opening."
    },
    "Tie Baffle": {
        "category": "Baffle Bags",
        "description": "Fabric tie baffles securing internal corners.",
        "prompt_guidance": "Internal tie strap baffles maintaining square form."
    },
    "Type A": {
        "category": "Electrostatic Safety",
        "description": "Standard non-conductive woven fabric without static protection.",
        "prompt_guidance": "Standard plain woven polypropylene fabric for non-flammable materials."
    },
    "Type B": {
        "category": "Electrostatic Safety",
        "description": "Low breakdown voltage (<6kV) to prevent propagating brush discharges.",
        "prompt_guidance": "Low breakdown voltage antistatic fabric finish."
    },
    "Conductive Type C": {
        "category": "Electrostatic Safety",
        "description": "Interwoven black conductive threads in a grid pattern with grounding tabs.",
        "prompt_guidance": "Interwoven black conductive carbon threads forming a visible grid pattern across the fabric, with yellow grounding tabs."
    },
    "Sift Proof Single": {
        "category": "Sift Proofing",
        "description": "Single cord felt dust-proof seam stitching.",
        "prompt_guidance": "Single felt cord stitched along vertical seams for dust proofing."
    },
    "Sift Proof Double": {
        "category": "Sift Proofing",
        "description": "Double felt filler cord seam stitching.",
        "prompt_guidance": "Double felt filler cord along all seams for fine powder containment."
    },
    "Sift Proof Triple": {
        "category": "Sift Proofing",
        "description": "Triple felt filler cord and coated fabric seams.",
        "prompt_guidance": "Triple-sealed dust-proof seams with filler cords and laminated coating for ultra-fine powders."
    },
    "Food Grade": {
        "category": "Certified Bags",
        "description": "Clean room manufactured food & pharma grade bag.",
        "prompt_guidance": "Clean room manufactured pristine white food-grade FIBC bag with food safety certification badge."
    },
    "UN Bags": {
        "category": "Certified Bags",
        "description": "UN certified for hazardous goods transport with UN rating print.",
        "prompt_guidance": "UN certified hazardous material bag with official UN circle symbol and code printed on front panel."
    },
    "Asbestos Plate Bag": {
        "category": "Specialized Bags",
        "description": "Heavy duty rectangular bag for asbestos sheet containment.",
        "prompt_guidance": "Flat rectangular heavy duty UN asbestos plate bag with hazard warnings and sealed PE liner."
    },
    "Drum Bag": {
        "category": "Specialized Bags",
        "description": "Cylindrical bag designed to fit inside standard drums.",
        "prompt_guidance": "Cylindrical drum-fit FIBC bag with round base."
    },
    "Single Loop/Double Loop": {
        "category": "Lifting Loops",
        "description": "Central single or dual lifting loops for hook/crane operation.",
        "prompt_guidance": "Continuous single central lifting loop or dual overhead lifting straps for crane hooks."
    },
    "In House Liner Forming": {
        "category": "Liners",
        "description": "Form-fit custom shaped PE inner liner.",
        "prompt_guidance": "Custom form-fitted polyethylene inner liner conforming exactly to bag geometry."
    },
    "Liner bag-Loose": {
        "category": "Liners",
        "description": "Insert loose PE liner inside bulk bag.",
        "prompt_guidance": "Clear polyethylene inner liner inserted loosely inside the main bag body."
    },
    "Liner bag-Glued": {
        "category": "Liners",
        "description": "Liner spot-glued to internal fabric walls.",
        "prompt_guidance": "Polyethylene inner liner securely spot-glued to internal bag walls."
    },
    "Liner bag-Tabbed": {
        "category": "Liners",
        "description": "Liner secured to corner seams with tabs/loops.",
        "prompt_guidance": "Inner PE liner tied securely to eight corner points with sewn tabs."
    },
    "Stranded Liner/Antistatic Liner": {
        "category": "Liners",
        "description": "Static dissipative antistatic inner liner.",
        "prompt_guidance": "Static dissipative antistatic translucent liner."
    },
    "Foil Liner": {
        "category": "Liners",
        "description": "Multi-layer aluminum foil barrier liner for moisture & oxygen sensitive products.",
        "prompt_guidance": "Metallic silver aluminum foil barrier liner providing high moisture and gas barrier."
    },
    "Black Conductive Liner": {
        "category": "Liners",
        "description": "Black carbon conductive PE liner for Type C applications.",
        "prompt_guidance": "Black conductive carbon PE liner."
    },
    "Baffle Liner": {
        "category": "Liners",
        "description": "Form-fit liner with internal baffles.",
        "prompt_guidance": "Baffled form-fit liner maintaining square cubic form."
    },
    "Suspended Liner": {
        "category": "Liners",
        "description": "Liner suspended from top loops for easy discharge.",
        "prompt_guidance": "Inner liner suspended from top lifting loops."
    },
    "Bulk Container Liner": {
        "category": "Liners",
        "description": "Large sea container / ISO container liner bag.",
        "prompt_guidance": "Large 20ft/40ft shipping container bulk liner bag with filling spouts."
    },
    "Fabric": {
        "category": "Raw Materials",
        "description": "High-tenacity woven polypropylene fabric rolls.",
        "prompt_guidance": "Industrial roll of high-tenacity woven polypropylene fabric."
    }
}
