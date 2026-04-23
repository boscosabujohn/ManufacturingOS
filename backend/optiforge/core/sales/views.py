import logging
from rest_framework import generics, status
from rest_framework.response import Response

from optiforge.platform.tenancy.context import get_current_tenant_id
from optiforge.platform.tenancy.repository import MissingTenantContextException
from optiforge.platform.extensions.registry import extension_registry, NoParserRegisteredError
from optiforge.platform.events.bus import event_bus
from optiforge.platform.audit.models import AuditRecord
from .models import CustomerRequirement
from .serializers import CustomerRequirementSerializer

logger = logging.getLogger(__name__)


class CustomerRequirementCreateView(generics.CreateAPIView):
    """
    POST /api/v1/customer-requirements
    Creates a CustomerRequirement, invokes the registered parser, emits an event.
    """
    serializer_class = CustomerRequirementSerializer

    def create(self, request, *args, **kwargs):
        tenant_id = get_current_tenant_id()
        if not tenant_id:
            return Response(
                {"error_code": "MISSING_TENANT", "message": "X-Tenant-ID header is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        source_type = request.data.get('source_type')
        source_payload = request.data.get('source_payload', {})

        # Create the entity
        cr = CustomerRequirement.objects.create(
            tenant_id=tenant_id,
            source_type=source_type,
            source_payload=source_payload,
        )

        # Invoke the registered parser if available
        try:
            parsed_lines = extension_registry.invoke_parser(source_type, source_payload)
            cr.parsed_lines = parsed_lines
            # Merge extensible_attributes from parsed lines
            ext_attrs = {}
            for line in parsed_lines:
                for k, v in line.items():
                    if k not in ('line',):
                        ext_attrs[k] = v
            cr.extensible_attributes = ext_attrs
            cr.status = 'parsed'
            cr.save()
        except NoParserRegisteredError as e:
            return Response(
                {"error_code": "NO_PARSER", "message": str(e), "cr_id": str(cr.id)},
                status=status.HTTP_422_UNPROCESSABLE_ENTITY,
            )

        # Publish domain event
        event_bus.publish(
            'CustomerRequirementCreated',
            {'cr_id': str(cr.id), 'source_type': source_type, 'tenant_id': str(tenant_id)},
            tenant_id=tenant_id,
        )

        serializer = self.get_serializer(cr)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CustomerRequirementListView(generics.ListAPIView):
    """
    GET /api/v1/customer-requirements
    Lists CustomerRequirements scoped to the current tenant.
    """
    serializer_class = CustomerRequirementSerializer

    def get_queryset(self):
        tenant_id = get_current_tenant_id()
        if not tenant_id:
            return CustomerRequirement.objects.none()
        return CustomerRequirement.objects.filter(tenant_id=tenant_id)


class CustomerRequirementDetailView(generics.RetrieveAPIView):
    """
    GET /api/v1/customer-requirements/<id>
    """
    serializer_class = CustomerRequirementSerializer

    def get_queryset(self):
        tenant_id = get_current_tenant_id()
        if not tenant_id:
            return CustomerRequirement.objects.none()
        return CustomerRequirement.objects.filter(tenant_id=tenant_id)
