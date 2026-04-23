from django.db import migrations

def EnableRLS(table_name):
    """
    Migration operation to enable RLS on a table and create the isolation policy.
    """
    return migrations.RunSQL(
        sql=[
            f"ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;",
            f"CREATE POLICY tenant_isolation_policy ON {table_name} "
            f"USING (tenant_id::text = current_setting('app.tenant_id', true));"
        ],
        reverse_sql=[
            f"DROP POLICY IF EXISTS tenant_isolation_policy ON {table_name};",
            f"ALTER TABLE {table_name} DISABLE ROW LEVEL SECURITY;"
        ]
    )
