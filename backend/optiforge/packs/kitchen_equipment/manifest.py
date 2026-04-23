# KitchenEquipment Pack Manifest (Python dict, mirroring what would be YAML)
MANIFEST = {
    "id": "kitchen-equipment",
    "name": "KitchenEquipment",
    "version": "0.1.0",
    "depends_on": {
        "modes": ["eto"],
        "core_version_range": ">=0.1.0,<1.0.0",
    },
    "extends": {
        "integrations": {
            "boq_import": {"parser": "optiforge.packs.kitchen_equipment.parsers.boq_parser"}
        },
        "entities": {
            "Item": {
                "fascia_type": {"type": "string", "required": True},
                "cladding_type": {"type": "string", "required": True},
            }
        },
    },
}
