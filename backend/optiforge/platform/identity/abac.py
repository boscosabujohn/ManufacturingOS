"""
ABAC policy engine for OptiForge.
Evaluates attribute-based access control policies against a request context.
"""
from .models import ABACPolicy


class PolicyDecision:
    """Result of an ABAC policy evaluation."""
    def __init__(self, allowed, reason='', matched_policy=None):
        self.allowed = allowed
        self.reason = reason
        self.matched_policy = matched_policy

    def __bool__(self):
        return self.allowed


def evaluate_access(tenant_id, resource_type, action, context):
    """
    Evaluate all active ABAC policies for a resource_type + action.
    Returns a PolicyDecision.

    Policy resolution order:
    1. Tenant-specific policies (higher priority first)
    2. Global policies (higher priority first)
    3. If no policies match, default is ALLOW (RBAC handles baseline)

    First matching DENY wins over ALLOW at the same priority level.
    """
    # Fetch applicable policies ordered by priority (desc)
    policies = ABACPolicy.objects.filter(
        resource_type=resource_type,
        action=action,
        is_active=True,
    ).filter(
        models_tenant_q(tenant_id)
    ).order_by('-priority')

    for policy in policies:
        if policy.evaluate(context):
            if policy.effect == 'deny':
                return PolicyDecision(
                    allowed=False,
                    reason=f"Denied by policy: {policy.name}",
                    matched_policy=policy,
                )
            elif policy.effect == 'allow':
                return PolicyDecision(
                    allowed=True,
                    reason=f"Allowed by policy: {policy.name}",
                    matched_policy=policy,
                )

    # Default: allow (RBAC is the baseline, ABAC adds restrictions)
    return PolicyDecision(allowed=True, reason="No matching ABAC policy; default allow.")


def models_tenant_q(tenant_id):
    """Build a Q filter for tenant-specific + global policies."""
    from django.db.models import Q
    return Q(tenant_id=tenant_id) | Q(tenant__isnull=True)
