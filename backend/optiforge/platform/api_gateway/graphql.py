"""
Minimal GraphQL facade over the same shared-source-of-truth schema used by
REST. We don't pull in a GraphQL library for Phase 2 — the gateway ships a
hand-rolled executor that resolves `query { <type>(id: "...") { <field> } }`
and `query { <type>s { <field> } }` against a registered schema.

A real deployment swaps in graphene-django or strawberry behind
`execute_graphql(query, variables)` without touching callers.
"""
import re
from .envelope import ErrorCode, error_envelope


_schema = {}


def register_type(type_name, fields, fetch_by_id=None, fetch_all=None):
    """
    Register a GraphQL type.
      - fields: tuple of declared field names.
      - fetch_by_id(tenant_id, id) -> dict | None
      - fetch_all(tenant_id) -> list[dict]
    """
    _schema[type_name] = {
        'fields': tuple(fields),
        'fetch_by_id': fetch_by_id,
        'fetch_all': fetch_all,
    }


def clear_schema():
    _schema.clear()


_QUERY_RE = re.compile(
    r'query\s*\{\s*(?P<name>\w+)(?:\(id:\s*"(?P<id>[^"]+)"\))?\s*\{\s*(?P<fields>[^}]+)\}\s*\}',
    re.DOTALL,
)


def execute_graphql(query, tenant_id):
    """
    Trivial executor that covers the two patterns the REST surface mirrors.
    Returns a GraphQL-style response dict.
    """
    match = _QUERY_RE.search(query or '')
    if not match:
        return {
            'data': None,
            'errors': [error_envelope(
                ErrorCode.INVALID_INPUT,
                "Query does not match supported form 'query { type[(id:\"...\")] { fields } }'",
            )],
        }
    type_name = match.group('name')
    item_id = match.group('id')
    requested_fields = [f.strip() for f in match.group('fields').split() if f.strip()]

    plural = type_name.endswith('s')
    base_name = type_name[:-1] if plural else type_name

    type_def = _schema.get(base_name) or _schema.get(type_name)
    if not type_def:
        return {
            'data': None,
            'errors': [error_envelope(
                ErrorCode.NOT_FOUND,
                f"Unknown GraphQL type '{type_name}'",
            )],
        }
    declared = set(type_def['fields'])
    unknown = [f for f in requested_fields if f not in declared]
    if unknown:
        return {
            'data': None,
            'errors': [error_envelope(
                ErrorCode.INVALID_INPUT,
                f"Unknown fields for '{type_name}': {unknown}",
            )],
        }

    if item_id and type_def['fetch_by_id']:
        row = type_def['fetch_by_id'](tenant_id, item_id)
        data = {type_name: {f: row.get(f) for f in requested_fields}} if row else {type_name: None}
        return {'data': data, 'errors': []}

    if plural and type_def['fetch_all']:
        rows = list(type_def['fetch_all'](tenant_id))
        data = {type_name: [{f: row.get(f) for f in requested_fields} for row in rows]}
        return {'data': data, 'errors': []}

    return {
        'data': None,
        'errors': [error_envelope(
            ErrorCode.INVALID_INPUT,
            f"No resolver available for query pattern on '{type_name}'",
        )],
    }
