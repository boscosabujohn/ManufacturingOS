# Security Hardening (Issue #62)

Phase 5 gate. Partial programmatic coverage; a live pen-test and
red-team exercise against the top-3 threats remains as a HITL activity
owned by the security team before GA.

## Top-3 threats (prioritised)

1. **Cross-tenant data exfiltration.** Mitigations:
   - `TenantAwareModel` + middleware require tenant_id on every query.
   - `BaseTenantRepository` raises `MissingTenantContextException` on
     context-less reads.
   - Reporting fabric views raise `CrossTenantQueryAttempted` if a
     runner returns a row from another tenant.
   - Leaky-pack repository guard (`CoreWriteFromPackError`).

2. **Audit tamper.** Mitigations:
   - SHA-256 hash-chained audit records (`AuditRecord.compute_hash`).
   - Hourly scheduled verification (`verify_all_audit_chains`).
   - Audit reader role distinct from tenant admin; revocable.

3. **Webhook replay / forgery.** Mitigations:
   - HMAC-SHA256 signature verification on inbound webhooks.
   - Body required; missing `X-Signature` rejected at the edge.
   - WebhookInboundLog retains body SHA for forensic replay.

## OAuth2 key rotation

- JWT signing key + refresh token rotation documented in
  `platform.identity.auth.rotation_schedule`.
- `SECRET_KEY`, JWT HMAC key, and webhook shared secrets are loaded
  from env; quarterly rotation drill in the security runbook.

## Encryption verification

- At rest: Postgres TDE + S3 server-side encryption assumed from cloud
  provider; configuration validated via infra-as-code.
- In transit: TLS 1.3 required on every API gateway ingress; CI linter
  rejects any non-HTTPS URL constant.
- Application-layer: ABAC policies never stored in plain text if they
  encode a secret; Finance ExchangeRate API hook uses a secret
  keystore.

## Pen-test + red-team (HITL)

- External pen-test firm scheduled for 2026-Q3 (owner: Bosco).
- Red-team against top-3 threats: tabletop exercise + live drill.
- Findings gated at the Phase 5 release — no GA until all
  severity ≥ high findings are resolved.
