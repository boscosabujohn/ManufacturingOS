# ACERO Regression Harness

**A**cceptance-**C**riteria **E**nd-to-end **R**egression **O**utcomes.

The ACERO suite exercises the demand-half happy path (CRM → Sales → CPQ →
Quotation → Customer Requirement → BOQ parser → workflow start) and the
design-half happy path (Design Lock → Change Order → cost impact → approval).

## Structure

- `test_demand_half.py` — end-to-end happy path through demand modules
- `test_design_half.py` — end-to-end design-lock + change-order path
- `test_pack_independence.py` — the same flows with no pack active, to
  prove core works without KitchenEquipment

## Coverage matrix

| Module | Demand half | Design half |
|---|---|---|
| CRM | ✅ (Account + Lead) | — |
| Sales | ✅ (Quotation + SO) | ✅ (ETO-mode SO) |
| CustomerRequirement | ✅ (BOQ → parsed_lines) | — |
| Procurement | ✅ (RFQ → PO → GRN) | — |
| PLM | ✅ (Part + Revision) | ✅ (ECR → ECO) |
| Project | — | ✅ (WBS + Milestone + ResourceAllocation) |
| ETO mode | — | ✅ (DesignLock + ChangeOrder) |
| Workflow | ✅ (QuotationApproval) | ✅ (finishing review step when KE active) |

## Adding a new regression

1. Add a `test_<area>_e2e.py` in this directory.
2. Keep each test self-contained — tenant creation → happy path → assertions.
3. Use `pytest.mark.django_db` on each test.
4. Don't import from `optiforge.platform` — the harness calls only through
   the public service layer (core modules, mode modules, pack loaders).

## CI gate

`pytest tests/acero/` must pass in CI before any Phase 3 or Phase 4 merge
into `main`. (Hook into `.github/workflows/optiforge-ci.yml` once
infrastructure-owner review is complete.)
