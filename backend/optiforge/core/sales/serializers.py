from rest_framework import serializers
from .models import CustomerRequirement


class CustomerRequirementSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomerRequirement
        fields = [
            'id', 'tenant_id', 'source_type', 'source_payload',
            'extensible_attributes', 'parsed_lines', 'status',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'tenant_id', 'extensible_attributes', 'parsed_lines', 'status', 'created_at', 'updated_at']
