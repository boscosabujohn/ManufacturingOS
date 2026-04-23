# ADR 0003: Keycloak as OIDC Provider

**Status:** Accepted
**Date:** 2026-04-23
**Context:** OptiForge requires a robust Identity and Access Management (IAM) provider to handle authentication (OIDC) and basic user identity. The provider needs to support multi-tenancy, RBAC, and eventually SAML/MFA for enterprise customers (Phase 2).
**Decision:** We will use **Keycloak** as the default OIDC provider.
**Rationale:**
- **Open Source:** Allows on-premise deployments, which is essential given that OptiForge targets manufacturing customers who may require isolated Linux server deployments.
- **Enterprise Features:** Out-of-the-box support for OIDC, SAML, and MFA.
- **Flexibility:** Supports robust role mapping and attribute injection into JWT tokens.
**Consequences:**
- The DRF API Gateway will validate Keycloak JWT tokens rather than issuing its own sessions.
- Operations will need to manage a Keycloak instance alongside the OptiForge deployment.
