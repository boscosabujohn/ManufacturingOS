from rest_framework import serializers, generics
from .models import AuditRecord


class AuditRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditRecord
        fields = '__all__'


class AuditHistoryView(generics.ListAPIView):
    """
    Returns the full chronological audit history for a given entity.
    GET /api/v1/audit/?entity_type=sales.customerrequirement&entity_id=<uuid>
    """
    serializer_class = AuditRecordSerializer

    def get_queryset(self):
        entity_type = self.request.query_params.get('entity_type', '')
        entity_id = self.request.query_params.get('entity_id', '')
        return AuditRecord.objects.filter(
            entity_type=entity_type,
            entity_id=entity_id,
        ).order_by('timestamp')
