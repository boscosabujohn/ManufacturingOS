from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class Supplier(TenantAwareModel):
    code = models.CharField(max_length=50, db_index=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, default='')
    status = models.CharField(
        max_length=20,
        choices=[('approved', 'Approved'), ('pending', 'Pending'), ('blocked', 'Blocked')],
        default='pending',
    )
    credit_terms_days = models.IntegerField(default=30)
    extensible_attributes = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'code')


class RFQ(TenantAwareModel):
    number = models.CharField(max_length=50, db_index=True)
    title = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=[('draft', 'Draft'), ('sent', 'Sent'), ('received', 'Received'),
                 ('closed', 'Closed')],
        default='draft',
    )
    closes_on = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class RFQInvitation(TenantAwareModel):
    rfq = models.ForeignKey(RFQ, on_delete=models.CASCADE, related_name='invitations')
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT)
    sent_at = models.DateTimeField(null=True, blank=True)


class PurchaseOrder(TenantAwareModel):
    STATUS = [('draft', 'Draft'), ('approved', 'Approved'), ('sent', 'Sent'),
              ('closed', 'Closed'), ('cancelled', 'Cancelled')]
    number = models.CharField(max_length=50, db_index=True)
    supplier = models.ForeignKey(Supplier, on_delete=models.PROTECT, related_name='purchase_orders')
    total_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=STATUS, default='draft')
    approval_state = models.CharField(max_length=30, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'number')


class GoodsReceiptNote(TenantAwareModel):
    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.PROTECT, related_name='grns')
    number = models.CharField(max_length=50, db_index=True)
    received_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True, default='')
