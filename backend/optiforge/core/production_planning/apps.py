from django.apps import AppConfig


class ProductionPlanningConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'optiforge.core.production_planning'
    label = 'production_planning'
