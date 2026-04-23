"""
Country validator hook. Future localisation packs (GST for India, VAT for
EU, ZATCA for Saudi Arabia, etc.) register validators here.
"""
from collections import defaultdict


class ValidatorNotRegisteredError(LookupError):
    pass


_validators = defaultdict(dict)  # country_code -> {validator_kind: callable}


def register_country_validator(country_code, kind, validator):
    """
    Register a validator callable (value, context=None) -> list[str] errors.
    Example kinds: 'tax_id', 'phone', 'postal_code'.
    """
    _validators[country_code][kind] = validator


def validate(country_code, kind, value, context=None):
    kind_map = _validators.get(country_code, {})
    if kind not in kind_map:
        raise ValidatorNotRegisteredError(
            f"No '{kind}' validator registered for country '{country_code}'"
        )
    errors = kind_map[kind](value, context or {}) or []
    return list(errors)


def clear():
    _validators.clear()


def registered_countries():
    return sorted(_validators.keys())
