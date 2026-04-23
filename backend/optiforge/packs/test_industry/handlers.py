"""
TestIndustry pack event handler.
Subscribes to CustomerRequirementCreated and logs receipt.
"""
import logging

logger = logging.getLogger(__name__)


def on_cr_created(event_type, payload, tenant_id):
    """
    Event handler for CustomerRequirementCreated.
    Logs the event receipt as proof that the event bus delivers to multiple packs.
    """
    logger.info(
        f"[test-industry-pack] received event '{event_type}' "
        f"for tenant {tenant_id}, cr_id {payload.get('cr_id', '?')}"
    )
    return {'received': True, 'cr_id': payload.get('cr_id')}
