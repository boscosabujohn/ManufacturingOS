import contextvars
from contextlib import contextmanager
from django.db import connection

# Context variable to hold the current tenant ID (string or UUID)
_current_tenant_id = contextvars.ContextVar('current_tenant_id', default=None)

def set_current_tenant_id(tenant_id):
    """Set the current tenant ID in the context."""
    return _current_tenant_id.set(tenant_id)

def get_current_tenant_id():
    """Get the current tenant ID from the context."""
    return _current_tenant_id.get()

@contextmanager
def tenant_context(tenant_id):
    """
    Context manager to temporarily set the tenant context.
    Usage:
        with tenant_context(some_tenant_id):
            ...
    """
    token = set_current_tenant_id(tenant_id)
    try:
        yield
    finally:
        _current_tenant_id.reset(token)

def set_tenant_in_postgres(execute, sql, params, many, context):
    """
    Django database wrapper to set the Postgres session variable for RLS.
    This injects `SET LOCAL app.tenant_id = '...'` before queries if in a transaction,
    or we can just execute `SET SESSION app.tenant_id = '...'` to apply to the connection.
    For simplicity, we use SET SESSION and rely on it being overwritten or cleared.
    """
    tenant_id = get_current_tenant_id()
    
    # We don't want to infinite-loop or wrap our own SET queries
    if sql.startswith('SET app.tenant_id'):
        return execute(sql, params, many, context)

    connection = context['connection']
    if connection.vendor == 'postgresql':
        cursor = context['cursor']
        if tenant_id:
            cursor.execute("SET app.tenant_id = %s", [str(tenant_id)])
        else:
            cursor.execute("SET app.tenant_id = ''")
            
    return execute(sql, params, many, context)
