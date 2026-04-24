"""ETO service layer: design-lock enforcement, change-order cost flow."""
from decimal import Decimal
from django.utils import timezone

from .models import ChangeOrderRequest, DesignLock


class DesignNotLockedError(RuntimeError):
    pass


class DesignAlreadyLockedError(RuntimeError):
    pass


class CostImpactRequiredError(ValueError):
    """Raised when approval is attempted on a change order missing cost impact."""


def lock_design(tenant_id, sales_order_id, locked_by=None, snapshot=None):
    """Lock a sales order's design. Idempotent — relocking is a no-op."""
    existing = DesignLock.objects.filter(sales_order_id=sales_order_id, unlocked_at__isnull=True).first()
    if existing:
        raise DesignAlreadyLockedError(
            f"Sales order {sales_order_id} design is already locked at {existing.locked_at}"
        )
    return DesignLock.objects.create(
        tenant_id=tenant_id, sales_order_id=sales_order_id,
        locked_by=locked_by, design_snapshot=snapshot or {},
    )


def require_lock(sales_order_id):
    """Guard: raise if no active lock exists."""
    if not DesignLock.objects.filter(sales_order_id=sales_order_id,
                                     unlocked_at__isnull=True).exists():
        raise DesignNotLockedError(
            f"Sales order {sales_order_id} design is not locked; post-lock changes require a lock."
        )


def submit_change_order(tenant_id, sales_order_id, number, reason, submitted_by=None):
    """A change request may be submitted without cost impact, but approval requires it."""
    require_lock(sales_order_id)
    return ChangeOrderRequest.objects.create(
        tenant_id=tenant_id, sales_order_id=sales_order_id, number=number,
        reason=reason, submitted_by=submitted_by,
        status='cost_impact_pending',
    )


def record_cost_impact(change_order, cost_impact, schedule_impact_days=0):
    change_order.cost_impact = Decimal(str(cost_impact))
    change_order.schedule_impact_days = schedule_impact_days
    change_order.status = 'submitted'
    change_order.save(update_fields=['cost_impact', 'schedule_impact_days', 'status'])
    return change_order


def approve_change_order(change_order):
    if change_order.cost_impact is None:
        raise CostImpactRequiredError(
            f"Cannot approve CO {change_order.number}: cost_impact has not been recorded."
        )
    change_order.status = 'approved'
    change_order.approved_at = timezone.now()
    change_order.save(update_fields=['status', 'approved_at'])
    return change_order
