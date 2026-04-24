"""KitchenEquipment extends the core Item master with fascia/cladding/appliance tabs."""
from optiforge.platform.extensions.points import ExtensionPoint, extension_points

PACK_ID = 'kitchen-equipment'

ITEM_FIELD_EXTENSIONS = {
    'fascia_type': {'type': 'string', 'required': True,
                    'enum': ['ss304', 'ss316', 'ss430', 'laminate', 'powder_coated']},
    'cladding_type': {'type': 'string', 'required': False},
    'appliance_class': {'type': 'string', 'required': False,
                        'enum': ['cooking', 'cold', 'wash', 'ventilation']},
}

SCREEN_SLOTS = [
    ('sales.quote.sidebar.kitchen', 'KitchenQuoteSidebar'),
    ('item.tabs.kitchen_fascia', 'KitchenFasciaTab'),
    ('item.tabs.kitchen_appliance', 'KitchenApplianceTab'),
]


def register_item_extensions():
    extension_points.register(
        ExtensionPoint.ENTITY_ATTRIBUTES, PACK_ID,
        key='Item', spec=ITEM_FIELD_EXTENSIONS,
    )
    for slot_id, component in SCREEN_SLOTS:
        extension_points.register(
            ExtensionPoint.SCREEN_SLOT, PACK_ID,
            key=slot_id, spec={'component': component},
        )
