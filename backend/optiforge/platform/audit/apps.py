from django.apps import AppConfig


class AuditConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'optiforge.platform.audit'

    def ready(self):
        from . import signals  # noqa: F401
