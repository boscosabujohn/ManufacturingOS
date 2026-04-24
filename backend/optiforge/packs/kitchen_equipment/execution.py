"""
KitchenEquipment execution-half extensions (issue #94): FinishingQCPanel,
SiteSurveyCapture, QC gate insertion on WorkOrder workflow, commissioning
protocols for kitchen equipment, NSF execution rules, warranty report.
"""
from optiforge.platform.extensions.points import ExtensionPoint, extension_points


PACK_ID = 'kitchen-equipment'


COMMISSIONING_PROTOCOLS = [
    {'code': 'HOOD_AIRFLOW_TEST', 'title': 'Exhaust hood airflow verification',
     'required_for': ['HOOD'], 'duration_minutes': 30, 'qc_gate': True},
    {'code': 'REFRIGERANT_LEAK_TEST', 'title': 'Cold room refrigerant leak check',
     'required_for': ['COLD_ROOM'], 'duration_minutes': 45, 'qc_gate': True},
    {'code': 'GAS_PRESSURE_CHECK', 'title': 'Gas appliance pressure regulation',
     'required_for': ['APPLIANCE'], 'duration_minutes': 20, 'qc_gate': True},
    {'code': 'NSF_SURFACE_INSPECTION', 'title': 'NSF-ANSI finish / hygienic surface audit',
     'required_for': ['COUNTER', 'SINK'], 'duration_minutes': 15, 'qc_gate': True},
]


NSF_EXECUTION_RULES = {
    'finishing': {
        'allowed_surfaces': ['ss304', 'ss316', 'ss430'],
        'max_rms_roughness_um': 0.8,
    },
    'welding': {
        'max_heat_affected_zone_mm': 3.0,
        'passivation_required': True,
    },
    'gap_tolerance_mm': 1.5,
}


WARRANTY_REPORT_TEMPLATE = {
    'name': 'kitchen_warranty_registration',
    'title': 'Kitchen Equipment Warranty Registration',
    'format': ['pdf', 'csv'],
    'fields': [
        'customer_name', 'installed_on', 'serial_numbers',
        'warranty_until', 'pack_version',
    ],
}


def register_execution_extensions():
    extension_points.register(
        ExtensionPoint.MASTER_DATA_SEED, PACK_ID,
        key='kitchen_commissioning_protocols',
        spec={'items': COMMISSIONING_PROTOCOLS},
    )

    extension_points.register(
        ExtensionPoint.VALIDATION_RULE, PACK_ID,
        key='WorkOrder.nsf_execution',
        spec={'rules': NSF_EXECUTION_RULES,
              'message': 'NSF-ANSI execution rules'},
    )

    extension_points.register(
        ExtensionPoint.REPORT_TEMPLATE, PACK_ID,
        key='kitchen_warranty_registration',
        spec=WARRANTY_REPORT_TEMPLATE,
    )

    for slot_id, component in (
        ('work_order.panels.finishing_qc', 'FinishingQCPanel'),
        ('commissioning.capture.site_survey', 'SiteSurveyCapture'),
    ):
        extension_points.register(
            ExtensionPoint.SCREEN_SLOT, PACK_ID,
            key=slot_id, spec={'component': component},
        )
