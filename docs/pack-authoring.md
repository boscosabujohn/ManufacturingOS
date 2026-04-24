# Pack Authoring Guide (Issue #47, component 3)

This guide is aimed at engineers authoring a new industry pack.

## Directory layout

```
backend/optiforge/packs/<pack_id>/
├── __init__.py
├── manifest.py       # MANIFEST dict
├── loader.py         # load_pack() — idempotent; registers every extension
├── parsers.py        # INTEGRATION_CONNECTOR callables
├── workflow.py       # WORKFLOW_STATE + WORKFLOW_STEP_HANDLER
├── taxonomy.py       # MASTER_DATA_SEED + VALIDATION_RULE
├── item_extensions.py# ENTITY_ATTRIBUTES + SCREEN_SLOT
├── execution.py      # execution-half extensions (if applicable)
└── tests/
    ├── test_demand_design_parity.py
    └── test_execution_parity.py
```

## Minimum pack manifest

```python
MANIFEST = {
    'id': 'your-pack-id',
    'name': 'YourPackName',
    'version': '0.1.0',
    'depends_on': {
        'modes': ['eto', 'discrete'],
        'core_version_range': '>=0.1.0,<1.0.0',
    },
    'extends': {
        'entities': {...},
        'workflows': {...},
        'integrations': {...},
    },
}
```

## Load-pack contract

`load_pack()` must:

1. Validate the manifest (`validate_manifest(MANIFEST)`).
2. Register INTEGRATION_CONNECTOR parsers (`extension_registry.register_parser`).
3. Register all ten extension points actually used by the pack via
   `extension_points.register(...)`.
4. Be safe to call multiple times — same-pack registration is idempotent;
   cross-pack collision raises `DuplicateRegistrationError`.

## Testing requirements

- **Demand-design parity test** verifying that `load_pack()` registers
  through every extension point the pack declares.
- **Execution parity test** (if execution-half matters) verifying the
  on-site / production surfaces.
- **Contract test at `tests/contract/`** that imports from the pack and
  asserts it shows up in `extension_points.list_for_pack(PACK_ID)`.

## Layer rule recap

Packs (Layer 5) may only:
- Read core entities.
- Extend via the ten points.
- Observe events.

They must NOT write to core tables directly. The test
`tests/contract/test_leaky_pack.py` proves the repository layer rejects
pack-originated core writes. If your pack needs to influence a core
entity's state, use the workflow step handler or event subscription
points — not a direct write.
