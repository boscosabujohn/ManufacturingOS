"""
TestIndustry pack loader — registers its event subscriber.
"""
from optiforge.platform.events.bus import event_bus
from optiforge.platform.extensions.manifest import validate_manifest
from .manifest import MANIFEST
from .handlers import on_cr_created


def load_pack():
    """
    Load and register the TestIndustry pack.
    """
    validate_manifest(MANIFEST)
    event_bus.subscribe('CustomerRequirementCreated', 'test-industry', on_cr_created)
