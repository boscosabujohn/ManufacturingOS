"""
Kitchen product taxonomy seed + NSF-ANSI validation rules exposed via the
Extension Framework's master_data_seed + validation_rule points.
"""
from optiforge.platform.extensions.points import ExtensionPoint, extension_points

PACK_ID = 'kitchen-equipment'


KITCHEN_CATEGORIES = [
    {'code': 'COUNTER', 'name': 'Commercial Counter Unit', 'nsf_required': True},
    {'code': 'COLD_ROOM', 'name': 'Cold Room Panel Assembly', 'nsf_required': True},
    {'code': 'HOOD', 'name': 'Exhaust Hood', 'nsf_required': True},
    {'code': 'SINK', 'name': 'Commercial Sink', 'nsf_required': True},
    {'code': 'APPLIANCE', 'name': 'Cooking Appliance', 'nsf_required': False},
]


NSF_ALLOWED_FASCIA = {'ss304', 'ss316', 'ss430'}


def nsf_fascia_validator(instance):
    """Returns a list of error strings; empty list means valid."""
    ext = getattr(instance, 'extensible_attributes', {}) or {}
    fascia = ext.get('fascia_type')
    if fascia and fascia not in NSF_ALLOWED_FASCIA:
        return [f"NSF-ANSI: fascia_type '{fascia}' not in allowed set {sorted(NSF_ALLOWED_FASCIA)}"]
    return []


def register_taxonomy_and_validators():
    extension_points.register(
        ExtensionPoint.MASTER_DATA_SEED, PACK_ID,
        key='kitchen_categories',
        spec={'items': KITCHEN_CATEGORIES},
    )
    extension_points.register(
        ExtensionPoint.VALIDATION_RULE, PACK_ID,
        key='Item.nsf_fascia',
        spec={'callable': nsf_fascia_validator,
              'message': 'NSF-ANSI fascia validation'},
    )
