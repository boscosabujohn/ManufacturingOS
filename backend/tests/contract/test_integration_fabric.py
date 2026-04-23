"""
Contract test: TestIndustry dummy connector exercises every framework
capability (sync_in, sync_out, webhook_in, EDI codec declarations).
"""
import uuid
import pytest

from optiforge.packs.test_industry.connector import (
    TEST_INDUSTRY_CONNECTOR, register_connector,
)
from optiforge.platform.integration.connectors import clear_dlq, connectors
from optiforge.platform.integration.models import ScheduledSync
from optiforge.platform.integration.runner import receive_webhook, run_scheduled_sync
from optiforge.platform.integration.webhook import sign


@pytest.fixture(autouse=True)
def clean_state():
    connectors.clear()
    clear_dlq()
    yield
    connectors.clear()
    clear_dlq()


@pytest.mark.django_db
def test_dummy_connector_exercises_every_capability():
    register_connector()
    tenant = uuid.uuid4()

    row = ScheduledSync.objects.create(
        tenant_id=tenant, connector_id=TEST_INDUSTRY_CONNECTOR.connector_id,
        cron_expression='0 * * * *',
    )
    pull = run_scheduled_sync(row.id)
    assert pull['pulled']

    out = TEST_INDUSTRY_CONNECTOR.sync_out(tenant, b'abc')
    assert out['pushed']

    secret = TEST_INDUSTRY_CONNECTOR.metadata['webhook_secret']
    body = b'{"x":1}'
    headers = {'X-Signature': sign(secret, body)}
    wh = receive_webhook(
        TEST_INDUSTRY_CONNECTOR.connector_id, headers, body, tenant_id=tenant,
    )
    assert wh['accepted']

    assert set(TEST_INDUSTRY_CONNECTOR.edi_codecs) == {'x12', 'edifact', 'as2'}
