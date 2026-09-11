# Demo Seed Files

Idempotent SQL seed files for the B3 MACBIS demo dataset. Apply in numeric order:

```bash
export $(grep -E '^DATABASE_URL' .env | sed 's/"//g')
for f in prisma/demo-seed/[0-9]*.sql; do
  psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f"
done
```

Every file deletes only its own rows before re-inserting (markers: `DEMO-`-prefixed
document numbers, `@demo-seed.b3macbis.com` emails, `createdBy='demo-seed'`, or
anchor-company scoping) — safe to re-run, never touches non-demo rows.

Anchor company: `b3000000-0000-4000-8000-000000000001` (B3 MACBIS, core_companies).
Timeline: 2025-10-01 → 2026-09-10.

| File | Domain |
|---|---|
| 01 | CRM customers + first leads |
| 02 | CRM 12-month lead history (feeds derived opportunities) |
| 03 | Sales quotations + items |
| 04 | Production work orders + items |
| 05 | Inventory stock entries + lines |
| 06 | Procurement PR → PO → GR chain |
| 07 | Finance AR invoices, payments, allocations (mirrors into sales_invoices) |
| 08 | Balanced journal entries (+ FY2026-27 periods) |
| 09–11 | HR (103 tables: assets, attendance, payroll, leave, performance, safety, training, …) |
| 12 | CRM extended (campaigns, tasks, activities, territories, …) |
| 13–14 | Finance extended (banking, budgets, GL, GST/TDS, fixed assets, …) |
| 15 | Support (agents, categories, KB, SLA config, …) |
| 16 | Sales extended (targets, price lists, promotions, handovers, …) |
| 17–19 | Production (74 tables: BOMs, OEE, MRP, lines, shifts, routings, sustainability, …) |
| 20–22 | Project management (68 tables: installs, dispatch, EV, WBS, site data, …) |
| 23–24 | Procurement extended (inspections, RFQs, supplier portal, AP invoices, …) |
| 25–26 | CPQ (58 tables: products, quotes, pricing, approvals, contracts, …) |
| 27–28 | Estimation (BOQs, cost estimates, rate cards, pricing, …) |
| 29–30 | IT admin (backups, audit, notifications, security, monitoring, …) |
| 31 | Inventory extended (transfers, adjustments, cycle counts, balances reconciled to stock entries) |
| 32 | Prisma-only tables (geo masters, sales orders/items, payroll loans, ITIL, …) |
| 33 | Workflow (instances, builder graphs, quality gates, order tracking, …) |
| 34 | Quality + Logistics (inspections → NCR → CAPA chain; shipments + tracking) |
| 35 | After-sales + Project (complaints, spares, KB; BOQs, surveys, approvals) |
| 36 | Approvals, collaboration, accounts, reports, proposals, CMS, portal, IoT, attachments |
| 37 | FK-deferred stragglers (asset depreciation/maintenance, reconciliation matches) |
| 38 | Django foundation: tenant (same anchor UUID), auth users/groups, identity, HR mirror |
| 39–45 | Django/OptiForge platform apps: finance/audit/analytics, CRM/sales/procurement, inventory/WMS/logistics/packaging, production-planning/MES/commissioning/ETO, QMS/EHS, CMMS/PLM/S&OP/field-service, project/support/documents/notifications/workflow/integration |

The Django files (38–45) seed the platform backend's tables in the same shared DB.
Where a NestJS twin exists, rows are mirrored via `INSERT..SELECT` (chart of accounts,
journals, employees, items, work centers, BOMs, OEE, shipments, …) so both backends
tell one coherent story. Django FKs are `DEFERRABLE INITIALLY DEFERRED`; each file
starts with `SET CONSTRAINTS ALL IMMEDIATE;` so the rollback-validation harness
actually exercises them (the statement is a harmless warning when applied outside a
transaction). Django auth users: admin / demo / sarah.mitchell, password `Demo@1234`.

## Intentionally empty (2 tables)

`django_session` and `django_admin_log` are Django runtime tables (ephemeral login
sessions, admin-UI action log). Empty is their correct at-rest state; rows appear
through actual use.
