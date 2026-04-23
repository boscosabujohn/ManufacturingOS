"""
TestIndustry dummy connector exercising every Integration Fabric capability:
sync_in (scheduled sync), sync_out (outbound push), webhook_in (inbound
verified), plus declared EDI codecs.
"""
from optiforge.platform.integration.codecs.edi import parse_x12, parse_edifact, wrap_as2
from optiforge.platform.integration.connectors import Connector


def _sync_in(tenant_id, params):
    return {'pulled': True, 'tenant_id': str(tenant_id), 'params': params}


def _sync_out(tenant_id, payload):
    return {'pushed': True, 'tenant_id': str(tenant_id), 'bytes': len(payload)}


def _webhook_in(tenant_id, headers, body):
    return {'accepted': True, 'tenant_id': str(tenant_id), 'size': len(body)}


TEST_INDUSTRY_CONNECTOR = Connector(
    connector_id='test-industry-dummy',
    owner='pack:test-industry',
    direction='bidirectional',
    sync_in=_sync_in,
    sync_out=_sync_out,
    webhook_in=_webhook_in,
    edi_codecs=('x12', 'edifact', 'as2'),
    metadata={'webhook_secret': 'ti-secret-rot-me'},
)


def register_connector():
    from optiforge.platform.integration.connectors import connectors as connector_registry
    connector_registry.register(TEST_INDUSTRY_CONNECTOR)
