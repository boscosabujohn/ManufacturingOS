"""
Reportable view registry.

Modules and packs register views (named queries with a declared schema) via
`register_view(name, owner, columns, runner)`. The reporting fabric reads
only from the view layer — it never reaches into module tables directly.
"""
from collections import namedtuple


class ViewNotRegisteredError(LookupError):
    pass


class CrossTenantQueryAttempted(PermissionError):
    """Raised when a runner omits the tenant filter."""


RegisteredView = namedtuple('RegisteredView', ['name', 'owner', 'columns', 'runner'])


_views = {}


def register_view(name, owner, columns, runner):
    """
    Register a reportable view.
      - name: unique identifier (e.g. 'sales.customer_requirements_overview')
      - owner: 'core' / 'pack:<id>' for catalogue attribution
      - columns: declared tuple of column names — what consumers expect.
      - runner: callable(tenant_id: uuid, params: dict) -> Iterable[dict]
    """
    _views[name] = RegisteredView(name=name, owner=owner, columns=tuple(columns), runner=runner)


def get_view(name):
    if name not in _views:
        raise ViewNotRegisteredError(f"Reportable view '{name}' is not registered")
    return _views[name]


def list_views():
    return sorted(_views.keys())


def clear_views():
    _views.clear()


def run(name, tenant_id, params=None):
    """
    Execute a registered view. The runner MUST filter by tenant_id; a runner
    that returns rows whose tenant_id does not match raises
    CrossTenantQueryAttempted.
    """
    view = get_view(name)
    rows = list(view.runner(tenant_id, params or {}))
    for row in rows:
        if 'tenant_id' in row and str(row['tenant_id']) != str(tenant_id):
            raise CrossTenantQueryAttempted(
                f"View '{name}' returned row for tenant {row['tenant_id']} when "
                f"tenant_id={tenant_id} was requested"
            )
    return rows
