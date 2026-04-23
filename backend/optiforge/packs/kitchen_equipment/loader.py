"""
KitchenEquipment pack loader — registers its parser with the extension registry.
"""
from optiforge.platform.extensions.registry import extension_registry
from optiforge.platform.extensions.manifest import validate_manifest
from .manifest import MANIFEST
from .parsers import boq_parser


def load_pack():
    """
    Load and register the KitchenEquipment pack.
    Called during app startup or test setup.
    """
    # Validate manifest (will raise on version mismatch or invalid fields)
    validate_manifest(MANIFEST)

    # Register the BOQ parser
    extension_registry.register_parser('boq_import', 'kitchen-equipment', boq_parser)
