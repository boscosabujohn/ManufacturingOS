import uuid
import pytest

from optiforge.platform.reporting import views as view_registry
from optiforge.platform.reporting.exporters import SUPPORTED_FORMATS, export
from optiforge.platform.reporting.models import ScheduledReport
from optiforge.platform.reporting.runner import run_report, run_scheduled_report
from optiforge.platform.reporting.views import (
    CrossTenantQueryAttempted,
    ViewNotRegisteredError,
)


@pytest.fixture(autouse=True)
def clean_views():
    view_registry.clear_views()
    yield
    view_registry.clear_views()


def _simple_runner(tenant_id, params):
    return [
        {'tenant_id': tenant_id, 'id': 'cr-1', 'source_type': 'boq_import', 'lines': 2},
        {'tenant_id': tenant_id, 'id': 'cr-2', 'source_type': 'rfq_spec', 'lines': 5},
    ]


def _leaky_runner(tenant_id, params):
    return [{'tenant_id': uuid.uuid4(), 'id': 'rogue', 'source_type': '?', 'lines': 0}]


def test_unknown_view_raises():
    with pytest.raises(ViewNotRegisteredError):
        view_registry.get_view('ghost')


def test_register_and_run():
    view_registry.register_view(
        name='sales.cr_overview',
        owner='core',
        columns=('id', 'source_type', 'lines'),
        runner=_simple_runner,
    )
    rows = view_registry.run('sales.cr_overview', uuid.uuid4())
    assert [r['id'] for r in rows] == ['cr-1', 'cr-2']


def test_cross_tenant_row_rejected():
    view_registry.register_view(
        name='sales.cr_overview', owner='core',
        columns=('id', 'source_type', 'lines'),
        runner=_leaky_runner,
    )
    with pytest.raises(CrossTenantQueryAttempted):
        view_registry.run('sales.cr_overview', uuid.uuid4())


@pytest.mark.parametrize('fmt', SUPPORTED_FORMATS)
def test_export_all_formats(fmt):
    view_registry.register_view(
        name='x', owner='core',
        columns=('id', 'source_type', 'lines'),
        runner=_simple_runner,
    )
    columns, body = run_report('x', uuid.uuid4(), export_format=fmt)
    assert isinstance(body, (bytes, bytearray))
    assert len(body) > 0


def test_export_csv_has_header_and_rows():
    view_registry.register_view(
        name='x', owner='core',
        columns=('id', 'source_type', 'lines'),
        runner=_simple_runner,
    )
    _, csv_body = run_report('x', uuid.uuid4(), export_format='csv')
    text = csv_body.decode('utf-8')
    assert text.splitlines()[0] == 'id,source_type,lines'
    assert 'cr-1' in text


def test_export_pdf_and_xlsx_have_magic():
    view_registry.register_view(
        name='x', owner='core',
        columns=('id', 'source_type', 'lines'),
        runner=_simple_runner,
    )
    _, pdf = run_report('x', uuid.uuid4(), 'pdf')
    _, xlsx = run_report('x', uuid.uuid4(), 'xlsx')
    assert pdf.startswith(b'%PDF-')
    assert xlsx.startswith(b'XLSX')


@pytest.mark.django_db
def test_scheduled_report_delivers_via_notify():
    tenant = uuid.uuid4()
    view_registry.register_view(
        name='sales.cr_overview', owner='core',
        columns=('id', 'source_type', 'lines'),
        runner=_simple_runner,
    )

    captured = {}

    def fake_notify(**kwargs):
        captured.update(kwargs)
        class Obj:
            status = 'sent'
        return Obj()

    schedule = ScheduledReport.objects.create(
        tenant_id=tenant, name='Weekly CRs',
        view_name='sales.cr_overview', params={},
        cron_expression='0 9 * * 1',
        export_format='csv', delivery_channel='email',
        delivery_recipient='ops@example.com',
    )

    run_scheduled_report(schedule.id, notify_fn=fake_notify)

    assert captured['channel'] == 'email'
    assert captured['recipient_address'] == 'ops@example.com'
    assert 'rows_b64' in captured['payload']
    schedule.refresh_from_db()
    assert schedule.last_run_at is not None


def test_unsupported_export_format_rejected():
    with pytest.raises(Exception):
        export('docx', ('a',), [{'a': 1}])
