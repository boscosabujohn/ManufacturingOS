from .context import get_current_tenant_id


class MissingTenantContextException(Exception):
    """Raised when a tenant-scoped repository is accessed without an active tenant context."""
    pass


class BaseTenantRepository:
    """
    Abstract repository class for tenant-scoped models.
    Enforces that a tenant context is active before any query is made.
    """
    model = None

    @classmethod
    def get_queryset(cls):
        tenant_id = get_current_tenant_id()
        if not tenant_id:
            raise MissingTenantContextException("Cannot access tenant-scoped data without an active tenant context.")
        return cls.model.objects.filter(tenant_id=tenant_id)

    @classmethod
    def get(cls, **kwargs):
        return cls.get_queryset().get(**kwargs)

    @classmethod
    def filter(cls, **kwargs):
        return cls.get_queryset().filter(**kwargs)

    @classmethod
    def create(cls, **kwargs):
        cls._guard_pack_write()
        tenant_id = get_current_tenant_id()
        if not tenant_id:
            raise MissingTenantContextException("Cannot create tenant-scoped data without an active tenant context.")
        kwargs['tenant_id'] = tenant_id
        return cls.model.objects.create(**kwargs)

    @classmethod
    def update(cls, pk, **kwargs):
        cls._guard_pack_write()
        return cls.get_queryset().filter(pk=pk).update(**kwargs)

    @classmethod
    def delete(cls, pk):
        cls._guard_pack_write()
        return cls.get_queryset().filter(pk=pk).delete()

    @classmethod
    def _guard_pack_write(cls):
        """Core-owned repositories reject writes when the caller is a pack."""
        if not getattr(cls, 'core_owned', False):
            return
        # Deferred import: avoids a cycle through extensions→tenancy→extensions at startup.
        from optiforge.platform.extensions.context import current_pack_caller, CoreWriteFromPackError
        pack_id = current_pack_caller()
        if pack_id:
            raise CoreWriteFromPackError(pack_id, cls.model.__name__ if cls.model else 'unknown')
