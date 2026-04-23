"""
Hardcoded BOQ parser for the KitchenEquipment pack (Phase 1 stub).
Accepts a fake BOQ payload and returns two parsed lines with kitchen-specific attributes.
"""


def boq_parser(payload):
    """
    Parse a BOQ payload into line items with kitchen-specific extensible attributes.
    Phase 1 stub: ignores the actual payload content and returns two hardcoded lines.
    """
    return [
        {
            "line": 1,
            "description": "Commercial Kitchen Counter Unit",
            "fascia_type": "ss304",
            "cladding_type": "laminate",
            "quantity": 2,
        },
        {
            "line": 2,
            "description": "Cold Room Panel Assembly",
            "fascia_type": "ss316",
            "cladding_type": "powder_coated",
            "quantity": 1,
        },
    ]
