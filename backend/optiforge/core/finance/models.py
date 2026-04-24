"""
Finance: GL, AP, AR, bank rec, cost centers, multi-currency, tax hook, IFRS 15
milestone billing. Estimation & Costing fold in here (Q8 PRD decision).
"""
from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class ChartOfAccounts(TenantAwareModel):
    code = models.CharField(max_length=30, db_index=True)
    name = models.CharField(max_length=255)
    account_type = models.CharField(
        max_length=20,
        choices=[('asset', 'Asset'), ('liability', 'Liability'),
                 ('equity', 'Equity'), ('revenue', 'Revenue'),
                 ('expense', 'Expense')],
    )
    parent = models.ForeignKey('self', null=True, blank=True,
                               on_delete=models.SET_NULL, related_name='children')
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('tenant', 'code')


class CostCenter(TenantAwareModel):
    code = models.CharField(max_length=30, db_index=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('tenant', 'code')


class Currency(TenantAwareModel):
    code = models.CharField(max_length=3)
    name = models.CharField(max_length=60)
    is_base = models.BooleanField(default=False)

    class Meta:
        unique_together = ('tenant', 'code')


class ExchangeRate(TenantAwareModel):
    from_code = models.CharField(max_length=3)
    to_code = models.CharField(max_length=3)
    rate = models.DecimalField(max_digits=18, decimal_places=8)
    effective_from = models.DateField()


class GLJournal(TenantAwareModel):
    STATUS = [('draft', 'Draft'), ('posted', 'Posted'), ('reversed', 'Reversed')]
    number = models.CharField(max_length=60, db_index=True)
    description = models.CharField(max_length=255, blank=True, default='')
    posting_date = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS, default='draft')
    currency_code = models.CharField(max_length=3, default='USD')

    class Meta:
        unique_together = ('tenant', 'number')


class GLEntry(TenantAwareModel):
    journal = models.ForeignKey(GLJournal, on_delete=models.CASCADE, related_name='entries')
    account = models.ForeignKey(ChartOfAccounts, on_delete=models.PROTECT)
    cost_center = models.ForeignKey(CostCenter, null=True, blank=True, on_delete=models.SET_NULL)
    debit = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    credit = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    description = models.CharField(max_length=255, blank=True, default='')


class ARInvoice(TenantAwareModel):
    STATUS = [('draft', 'Draft'), ('issued', 'Issued'),
              ('paid', 'Paid'), ('void', 'Void'), ('overdue', 'Overdue')]
    number = models.CharField(max_length=60, db_index=True)
    customer_account_id = models.UUIDField()
    total_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    currency_code = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=STATUS, default='draft')
    due_date = models.DateField(null=True, blank=True)
    milestone_reference = models.CharField(max_length=100, blank=True, default='',
                                           help_text="IFRS 15 / ASC 606 milestone ref if applicable")

    class Meta:
        unique_together = ('tenant', 'number')


class APInvoice(TenantAwareModel):
    STATUS = [('draft', 'Draft'), ('approved', 'Approved'),
              ('paid', 'Paid'), ('void', 'Void')]
    number = models.CharField(max_length=60, db_index=True)
    supplier_code = models.CharField(max_length=60, db_index=True)
    total_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    currency_code = models.CharField(max_length=3, default='USD')
    status = models.CharField(max_length=20, choices=STATUS, default='draft')
    due_date = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ('tenant', 'number')


class BankReconciliation(TenantAwareModel):
    bank_account_code = models.CharField(max_length=60)
    statement_date = models.DateField()
    statement_balance = models.DecimalField(max_digits=18, decimal_places=2)
    reconciled_balance = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    status = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('reconciled', 'Reconciled')],
        default='pending',
    )
