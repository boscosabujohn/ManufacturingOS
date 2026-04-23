from optiforge.platform.tenancy.repository import BaseTenantRepository
from .models import CustomerRequirement


class CustomerRequirementRepository(BaseTenantRepository):
    """Core-owned repository. Packs cannot write through this class."""
    model = CustomerRequirement
    core_owned = True
