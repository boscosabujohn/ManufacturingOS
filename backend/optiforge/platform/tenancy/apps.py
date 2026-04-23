from django.apps import AppConfig


class TenancyConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'optiforge.platform.tenancy'

    def ready(self):
        from django.db import connection
        from .context import set_tenant_in_postgres
        connection.execute_wrappers.append(set_tenant_in_postgres)
