import uuid
import pytest

from optiforge.platform.integration.codecs.edi import (
    EDIParseError, parse_edifact, parse_x12, unwrap_as2, wrap_as2,
)
from optiforge.platform.integration.connectors import (
    Connector, ConnectorAlreadyRegistered, ConnectorNotRegisteredError,
    clear_dlq, connectors, get_dlq, record_dlq,
)
from optiforge.platform.integration.models import ScheduledSync, WebhookInboundLog
from optiforge.platform.integration.runner import receive_webhook, run_scheduled_sync
from optiforge.platform.integration.webhook import (
    WebhookSignatureError, sign, validate_inbound, verify,
)


@pytest.fixture(autouse=True)
def clean_state():
    connectors.clear()
    clear_dlq()
    yield
    connectors.clear()
    clear_dlq()


# --- Connector registry ---

def test_register_and_get():
    c = Connector(connector_id='x', owner='core')
    connectors.register(c)
    assert connectors.get('x') is c


def test_register_duplicate_rejected():
    connectors.register(Connector(connector_id='x', owner='core'))
    with pytest.raises(ConnectorAlreadyRegistered):
        connectors.register(Connector(connector_id='x', owner='core'))


def test_unknown_connector_raises():
    with pytest.raises(ConnectorNotRegisteredError):
        connectors.get('nope')


# --- EDI codecs ---

def test_x12_parses_trivial_fixture():
    parsed = parse_x12('ISA*00*          *00~GS*PO*Sender*Receiver~')
    assert parsed[0]['segment'] == 'ISA'
    assert parsed[1]['segment'] == 'GS'


def test_edifact_parses_trivial_fixture():
    parsed = parse_edifact("UNB+UNOC:3+Sender+Receiver'UNH+1+ORDERS'")
    assert parsed[0]['segment'] == 'UNB'
    assert parsed[1]['segment'] == 'UNH'


def test_x12_empty_rejected():
    with pytest.raises(EDIParseError):
        parse_x12('')


def test_as2_roundtrip():
    env = wrap_as2('payload', 'A', 'B')
    assert env['AS2-From'] == 'A'
    assert unwrap_as2(env) == 'payload'


def test_as2_unwrap_missing_field():
    with pytest.raises(EDIParseError):
        unwrap_as2({'AS2-From': 'A'})


# --- Webhook engine ---

def test_signature_roundtrip():
    sig = sign('secret', b'body')
    assert verify('secret', b'body', sig)


def test_signature_mismatch():
    with pytest.raises(WebhookSignatureError):
        verify('secret', b'body', 'deadbeef')


def test_validate_inbound_requires_signature_header():
    with pytest.raises(WebhookSignatureError):
        validate_inbound('secret', {}, b'body')


def test_validate_inbound_rejects_empty_body():
    with pytest.raises(WebhookSignatureError):
        validate_inbound('secret', {'X-Signature': sign('secret', b'')}, b'')


# --- Runner ---

@pytest.mark.django_db
def test_scheduled_sync_invokes_connector():
    tenant = uuid.uuid4()
    calls = []

    def sync_in(tenant_id, params):
        calls.append((tenant_id, params))
        return 'ok'

    connectors.register(Connector(
        connector_id='c1', owner='core', sync_in=sync_in,
    ))
    row = ScheduledSync.objects.create(
        tenant_id=tenant, connector_id='c1',
        cron_expression='*/10 * * * *', params={'k': 'v'},
    )
    assert run_scheduled_sync(row.id) == 'ok'
    assert calls == [(tenant, {'k': 'v'})]


@pytest.mark.django_db
def test_scheduled_sync_failure_routes_to_dlq():
    tenant = uuid.uuid4()

    def boom(tenant_id, params):
        raise RuntimeError("connector down")

    connectors.register(Connector(connector_id='c2', owner='core', sync_in=boom))
    row = ScheduledSync.objects.create(
        tenant_id=tenant, connector_id='c2', cron_expression='* * * * *',
    )
    with pytest.raises(RuntimeError):
        run_scheduled_sync(row.id)
    assert len(get_dlq('c2')) == 1
    row.refresh_from_db()
    assert 'connector down' in row.last_error


@pytest.mark.django_db
def test_webhook_verified_and_logged():
    tenant = uuid.uuid4()
    secret = 'wh-secret'

    def webhook_in(tenant_id, headers, body):
        return {'ok': True, 'size': len(body)}

    connectors.register(Connector(
        connector_id='c3', owner='core',
        webhook_in=webhook_in, metadata={'webhook_secret': secret},
    ))

    body = b'{"hello":"world"}'
    headers = {'X-Signature': sign(secret, body)}
    result = receive_webhook('c3', headers, body, tenant_id=tenant)
    assert result['ok']
    log = WebhookInboundLog.objects.get(connector_id='c3')
    assert log.accepted is True


@pytest.mark.django_db
def test_webhook_rejects_bad_signature():
    connectors.register(Connector(
        connector_id='c4', owner='core',
        webhook_in=lambda *a, **kw: None,
        metadata={'webhook_secret': 'k'},
    ))
    with pytest.raises(WebhookSignatureError):
        receive_webhook('c4', {'X-Signature': 'deadbeef'}, b'body')
    log = WebhookInboundLog.objects.get(connector_id='c4')
    assert log.accepted is False


