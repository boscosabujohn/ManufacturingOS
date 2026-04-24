"""
KitchenEquipment pack loader — registers parser, item extensions, taxonomy,
validators, and workflow insertion. Idempotent.
"""
from optiforge.platform.extensions.registry import extension_registry
from optiforge.platform.extensions.manifest import validate_manifest
from .manifest import MANIFEST
from .parsers import boq_parser


def load_pack():
    validate_manifest(MANIFEST)

    extension_registry.register_parser('boq_import', 'kitchen-equipment', boq_parser)

    from .item_extensions import register_item_extensions
    from .taxonomy import register_taxonomy_and_validators
    from .workflow import register_workflow_extensions

    register_item_extensions()
    register_taxonomy_and_validators()
    register_workflow_extensions()
