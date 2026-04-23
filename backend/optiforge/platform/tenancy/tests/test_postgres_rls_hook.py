import pytest
from django.db import connection
from optiforge.platform.tenancy.context import tenant_context

@pytest.mark.django_db
@pytest.mark.skipif(connection.vendor != 'postgresql', reason="Requires PostgreSQL for session variables")
def test_postgres_session_variable_set():
    with tenant_context("123e4567-e89b-12d3-a456-426614174000"):
        with connection.cursor() as cursor:
            cursor.execute("SHOW app.tenant_id;")
            row = cursor.fetchone()
            assert row[0] == "123e4567-e89b-12d3-a456-426614174000"
    
    # Outside context, should be empty
    with connection.cursor() as cursor:
        cursor.execute("SHOW app.tenant_id;")
        row = cursor.fetchone()
        assert row[0] == ""
