"""
Test-specific settings that use SQLite instead of PostgreSQL.
This lets us run unit tests without a running Postgres instance.
"""
from optiforge.settings import *  # noqa: F401, F403

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

# JWT secret for testing
JWT_SECRET = 'test-secret-key'

# Register the test-only app that exercises the audit + soft-delete
# mixins (see tests/audit_soft_delete/).
INSTALLED_APPS = INSTALLED_APPS + [  # noqa: F405 (star import above)
    'tests.audit_soft_delete.apps.AuditSoftDeleteTestConfig',
]
