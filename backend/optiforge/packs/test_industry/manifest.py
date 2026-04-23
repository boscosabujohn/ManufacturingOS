# TestIndustry Pack Manifest
MANIFEST = {
    "id": "test-industry",
    "name": "TestIndustry",
    "version": "0.1.0",
    "depends_on": {
        "core_version_range": ">=0.1.0,<1.0.0",
    },
    "extends": {
        "events": {
            "CustomerRequirementCreated": {"handler": "optiforge.packs.test_industry.handlers.on_cr_created"}
        },
    },
    "_flags": {
        "activatable_in_production": False,
    },
}
