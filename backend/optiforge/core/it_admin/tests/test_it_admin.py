import uuid
import pytest

from optiforge.core.it_admin.models import AdminAuditLog, TenantConfigSetting
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='IT Tenant', status='active')


@pytest.mark.django_db
def test_tenant_config_setting_upsert(tenant):
    TenantConfigSetting.objects.create(
        tenant=tenant, key='feature.beta_uI', value={'enabled': True},
    )
    assert TenantConfigSetting.objects.get(tenant=tenant, key='feature.beta_uI').value == {'enabled': True}


@pytest.mark.django_db
def test_admin_audit_log_records_action(tenant):
    AdminAuditLog.objects.create(
        tenant=tenant, actor_user_id=uuid.uuid4(),
        action='user.create', target_type='User', target_id='42',
        details={'email': 'a@b.com'},
    )
    assert AdminAuditLog.objects.filter(action='user.create').count() == 1
