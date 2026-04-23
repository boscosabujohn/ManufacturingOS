import uuid
import pytest

from optiforge.platform.notifications.channels import (
    InMemoryChannel,
    clear_channel_adapters,
    clear_dlq,
    get_dlq,
    install_in_memory_adapters,
    register_channel_adapter,
    registered_channels,
)
from optiforge.platform.notifications.models import (
    NotificationDelivery,
    NotificationPreference,
    NotificationTemplate,
)
from optiforge.platform.notifications.service import (
    TemplateMissingError,
    notify,
    resolve_template,
)


@pytest.fixture(autouse=True)
def clean_notif_state():
    clear_channel_adapters()
    clear_dlq()
    yield
    clear_channel_adapters()
    clear_dlq()


@pytest.fixture
def tenant_a():
    return uuid.uuid4()


@pytest.fixture
def user_a():
    return uuid.uuid4()


@pytest.mark.django_db
def test_four_channels_registerable():
    install_in_memory_adapters()
    assert registered_channels() == ['email', 'in_app', 'push', 'sms']


@pytest.mark.django_db
def test_tenant_template_overrides_core(tenant_a):
    NotificationTemplate.objects.create(
        tenant_id=None, event_type='OrderShipped', channel='email',
        subject='Core subject', body='Core body',
    )
    NotificationTemplate.objects.create(
        tenant_id=tenant_a, event_type='OrderShipped', channel='email',
        subject='Tenant subject', body='Tenant body',
    )
    tpl = resolve_template(tenant_a, 'OrderShipped', 'email')
    assert tpl.subject == 'Tenant subject'


@pytest.mark.django_db
def test_core_template_fallback(tenant_a):
    NotificationTemplate.objects.create(
        tenant_id=None, event_type='OrderShipped', channel='email',
        subject='Core subject', body='Core body',
    )
    tpl = resolve_template(tenant_a, 'OrderShipped', 'email')
    assert tpl.subject == 'Core subject'


@pytest.mark.django_db
def test_missing_template_raises(tenant_a):
    with pytest.raises(TemplateMissingError):
        resolve_template(tenant_a, 'Nope', 'email')


@pytest.mark.django_db
def test_send_email_records_delivery(tenant_a, user_a):
    adapters = install_in_memory_adapters()
    NotificationTemplate.objects.create(
        tenant_id=None, event_type='OrderShipped', channel='email',
        subject='Hello {name}', body='Order {order_id} is on its way.',
    )

    delivery = notify(
        tenant_id=tenant_a, event_type='OrderShipped', channel='email',
        recipient_user_id=user_a, recipient_address='a@example.com',
        payload={'name': 'Alice', 'order_id': 'SO-123'},
    )

    assert delivery.status == 'sent'
    assert delivery.rendered_subject == 'Hello Alice'
    assert delivery.rendered_body == 'Order SO-123 is on its way.'
    assert adapters['email'].sent[0]['recipient_address'] == 'a@example.com'


@pytest.mark.django_db
def test_opt_out_suppresses_non_transactional(tenant_a, user_a):
    install_in_memory_adapters()
    NotificationTemplate.objects.create(
        tenant_id=None, event_type='Marketing', channel='email',
        subject='buy now', body='!', is_transactional=False,
    )
    NotificationPreference.objects.create(
        user_id=user_a, tenant_id=tenant_a, channel='email',
        event_type='Marketing', opted_in=False,
    )

    delivery = notify(
        tenant_id=tenant_a, event_type='Marketing', channel='email',
        recipient_user_id=user_a, recipient_address='a@example.com',
    )
    assert delivery.status == 'suppressed'


@pytest.mark.django_db
def test_transactional_bypasses_opt_out(tenant_a, user_a):
    install_in_memory_adapters()
    NotificationTemplate.objects.create(
        tenant_id=None, event_type='PasswordReset', channel='email',
        subject='Reset', body='link', is_transactional=True,
    )
    NotificationPreference.objects.create(
        user_id=user_a, tenant_id=tenant_a, channel='email',
        event_type='*', opted_in=False,
    )

    delivery = notify(
        tenant_id=tenant_a, event_type='PasswordReset', channel='email',
        recipient_user_id=user_a, recipient_address='a@example.com',
    )
    assert delivery.status == 'sent'


@pytest.mark.django_db
def test_adapter_failure_marks_failed_and_goes_to_dlq(tenant_a, user_a):
    adapter = InMemoryChannel(fail_for={'a@example.com'})
    register_channel_adapter('email', adapter)
    NotificationTemplate.objects.create(
        tenant_id=None, event_type='OrderShipped', channel='email',
        subject='s', body='b',
    )
    delivery = notify(
        tenant_id=tenant_a, event_type='OrderShipped', channel='email',
        recipient_user_id=user_a, recipient_address='a@example.com',
    )
    assert delivery.status == 'failed'
    assert 'simulated failure' in delivery.error
    assert len(get_dlq('email')) == 1


@pytest.mark.django_db
def test_unregistered_channel_marks_failed(tenant_a, user_a):
    NotificationTemplate.objects.create(
        tenant_id=None, event_type='X', channel='push', subject='', body='b',
    )
    delivery = notify(
        tenant_id=tenant_a, event_type='X', channel='push',
        recipient_user_id=user_a, recipient_address='dev-token',
    )
    assert delivery.status == 'failed'
    assert 'push' in delivery.error


@pytest.mark.django_db
def test_delivery_status_is_queryable(tenant_a, user_a):
    install_in_memory_adapters()
    NotificationTemplate.objects.create(
        tenant_id=None, event_type='X', channel='email', subject='s', body='b',
    )
    for _ in range(3):
        notify(
            tenant_id=tenant_a, event_type='X', channel='email',
            recipient_user_id=user_a, recipient_address='a@example.com',
        )

    sent_count = NotificationDelivery.objects.filter(
        tenant_id=tenant_a, status='sent'
    ).count()
    assert sent_count == 3
