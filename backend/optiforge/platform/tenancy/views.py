from django.db import transaction
from django.utils import timezone
from rest_framework import serializers, generics, status
from rest_framework.response import Response
from .models import Tenant, TenantPackActivation


class TenantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tenant
        fields = ['id', 'name', 'status', 'created_at', 'updated_at']
        read_only_fields = ['id', 'status', 'created_at', 'updated_at']


class TenantPackActivationSerializer(serializers.ModelSerializer):
    class Meta:
        model = TenantPackActivation
        fields = ['id', 'tenant_id', 'pack_id', 'pack_version', 'is_active', 'activated_at', 'deactivated_at']
        read_only_fields = ['id', 'activated_at', 'deactivated_at']


class TenantProvisioningView(generics.CreateAPIView):
    """POST /api/v1/tenants — Provision a new tenant."""
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer


class TenantLifecycleView(generics.GenericAPIView):
    """
    PATCH /api/v1/tenants/<id>/lifecycle
    Body: {"action": "activate" | "suspend" | "archive"}
    """
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer

    ACTION_TO_STATUS = {
        'activate': 'active',
        'suspend': 'suspended',
        'archive': 'archived',
    }

    def patch(self, request, pk):
        tenant = self.get_object()
        action = request.data.get('action')
        new_status = self.ACTION_TO_STATUS.get(action)

        if not new_status:
            return Response(
                {"error_code": "INVALID_ACTION", "message": f"Unknown action '{action}'. Valid: {list(self.ACTION_TO_STATUS.keys())}"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            tenant.transition_to(new_status)
        except ValueError as e:
            return Response(
                {"error_code": "INVALID_TRANSITION", "message": str(e)},
                status=status.HTTP_409_CONFLICT,
            )

        return Response(self.get_serializer(tenant).data)


class PackActivationView(generics.GenericAPIView):
    """
    POST /api/v1/tenants/<tenant_id>/packs/activate
    Body: {"pack_id": "kitchen-equipment", "pack_version": "0.1.0"}
    Activates a pack for a tenant with transactional rollback on failure.
    """
    def post(self, request, tenant_id):
        from optiforge.platform.extensions.manifest import validate_manifest, ManifestValidationError, VersionMismatchError

        pack_id = request.data.get('pack_id')
        pack_version = request.data.get('pack_version', '0.1.0')

        try:
            tenant = Tenant.objects.get(pk=tenant_id)
        except Tenant.DoesNotExist:
            return Response(
                {"error_code": "NOT_FOUND", "message": "Tenant not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        if tenant.status != 'active':
            return Response(
                {"error_code": "TENANT_NOT_ACTIVE", "message": f"Tenant is '{tenant.status}', must be 'active' to activate packs."},
                status=status.HTTP_409_CONFLICT,
            )

        try:
            with transaction.atomic():
                activation, created = TenantPackActivation.objects.get_or_create(
                    tenant=tenant,
                    pack_id=pack_id,
                    defaults={'pack_version': pack_version, 'is_active': True},
                )
                if not created:
                    activation.is_active = True
                    activation.pack_version = pack_version
                    activation.deactivated_at = None
                    activation.save()

        except Exception as e:
            return Response(
                {"error_code": "ACTIVATION_FAILED", "message": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(
            TenantPackActivationSerializer(activation).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class PackDeactivationView(generics.GenericAPIView):
    """POST /api/v1/tenants/<tenant_id>/packs/deactivate"""
    def post(self, request, tenant_id):
        pack_id = request.data.get('pack_id')
        try:
            activation = TenantPackActivation.objects.get(tenant_id=tenant_id, pack_id=pack_id)
            activation.is_active = False
            activation.deactivated_at = timezone.now()
            activation.save()
            return Response(TenantPackActivationSerializer(activation).data)
        except TenantPackActivation.DoesNotExist:
            return Response(
                {"error_code": "NOT_FOUND", "message": f"Pack '{pack_id}' not activated for this tenant."},
                status=status.HTTP_404_NOT_FOUND,
            )
