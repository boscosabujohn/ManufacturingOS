from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class Account(TenantAwareModel):
    """Customer or prospect organisation."""
    name = models.CharField(max_length=255, db_index=True)
    website = models.URLField(blank=True, default='')
    industry = models.CharField(max_length=100, blank=True, default='')
    annual_revenue = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    status = models.CharField(
        max_length=30,
        choices=[('active', 'Active'), ('dormant', 'Dormant'), ('lost', 'Lost')],
        default='active',
    )
    extensible_attributes = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Contact(TenantAwareModel):
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='contacts')
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120)
    email = models.EmailField(blank=True, default='')
    phone = models.CharField(max_length=50, blank=True, default='')
    is_primary = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)


class Lead(TenantAwareModel):
    STATUS = [('new', 'New'), ('qualified', 'Qualified'), ('disqualified', 'Disqualified'),
              ('converted', 'Converted')]
    company = models.CharField(max_length=255)
    contact_name = models.CharField(max_length=255)
    email = models.EmailField(blank=True, default='')
    source = models.CharField(max_length=80, blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS, default='new')
    converted_account = models.ForeignKey(
        Account, null=True, blank=True, on_delete=models.SET_NULL,
        related_name='converted_leads',
    )
    created_at = models.DateTimeField(auto_now_add=True)


class Opportunity(TenantAwareModel):
    STAGE = [
        ('discovery', 'Discovery'), ('proposal', 'Proposal'),
        ('negotiation', 'Negotiation'), ('won', 'Won'), ('lost', 'Lost'),
    ]
    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='opportunities')
    name = models.CharField(max_length=255)
    stage = models.CharField(max_length=20, choices=STAGE, default='discovery')
    amount = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    probability = models.FloatField(default=0.2)
    expected_close_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @property
    def weighted_amount(self):
        return float(self.amount) * (self.probability or 0.0)
