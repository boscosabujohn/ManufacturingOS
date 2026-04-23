import uuid
from django.db import models


class IdempotencyRecord(models.Model):
    """
    Records the result of a write served under an Idempotency-Key.
    Replays of the same key within the window return the stored response.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField(db_index=True)
    key = models.CharField(max_length=255, db_index=True)
    method = models.CharField(max_length=10)
    path = models.CharField(max_length=500)
    request_fingerprint = models.CharField(max_length=64)
    response_status = models.IntegerField()
    response_body = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant_id', 'key', 'method', 'path')
