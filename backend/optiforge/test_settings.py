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
