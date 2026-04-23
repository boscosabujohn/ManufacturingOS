"""
Pack manifest schema validation and version compatibility checking.
"""
import re

# JSON Schema for pack manifests
PACK_MANIFEST_SCHEMA = {
    "type": "object",
    "required": ["id", "name", "version"],
    "properties": {
        "id": {"type": "string", "pattern": "^[a-z][a-z0-9_-]+$"},
        "name": {"type": "string", "minLength": 1},
        "version": {"type": "string", "pattern": r"^\d+\.\d+\.\d+$"},
        "depends_on": {
            "type": "object",
            "properties": {
                "modes": {"type": "array", "items": {"type": "string"}},
                "compliance": {"type": "array", "items": {"type": "string"}},
                "core_version_range": {"type": "string"},
            },
        },
        "extends": {
            "type": "object",
            "properties": {
                "entities": {"type": "object"},
                "workflows": {"type": "object"},
                "screens": {"type": "object"},
                "seeds": {"type": "object"},
                "reports": {"type": "object"},
                "integrations": {"type": "object"},
                "events": {"type": "object"},
                "validations": {"type": "object"},
                "permissions": {"type": "object"},
                "steps": {"type": "object"},
            },
        },
    },
}


class ManifestValidationError(Exception):
    """Raised when a pack manifest fails validation."""
    def __init__(self, errors):
        self.errors = errors
        super().__init__(f"Manifest validation failed: {errors}")


class VersionMismatchError(Exception):
    """Raised when a pack's core_version_range does not match the running core version."""
    pass


# Current core version — updated on release
CORE_VERSION = "0.1.0"


def _parse_version(v):
    """Parse a semver string into a tuple of ints."""
    parts = v.strip().split('.')
    return tuple(int(p) for p in parts)


def _check_version_range(core_version, version_range):
    """
    Check if core_version satisfies a simple version range like '>=0.1.0,<1.0.0'.
    Supports >=, <=, >, <, = operators.
    """
    if not version_range:
        return True

    core = _parse_version(core_version)
    constraints = [c.strip() for c in version_range.split(',')]

    for constraint in constraints:
        match = re.match(r'(>=|<=|>|<|=)(.+)', constraint)
        if not match:
            continue
        op, ver_str = match.group(1), match.group(2)
        ver = _parse_version(ver_str)

        if op == '>=' and not (core >= ver):
            return False
        elif op == '<=' and not (core <= ver):
            return False
        elif op == '>' and not (core > ver):
            return False
        elif op == '<' and not (core < ver):
            return False
        elif op == '=' and not (core == ver):
            return False

    return True


def validate_manifest(manifest):
    """
    Validate a pack manifest dict against the schema.
    Returns a list of errors, or an empty list if valid.
    """
    errors = []

    # Required fields
    for field in ['id', 'name', 'version']:
        if field not in manifest:
            errors.append(f"Missing required field: '{field}'")

    # ID format
    if 'id' in manifest:
        if not re.match(r'^[a-z][a-z0-9_-]+$', manifest['id']):
            errors.append(f"Invalid pack id format: '{manifest['id']}'. Must be lowercase alphanumeric with hyphens/underscores.")

    # Version format
    if 'version' in manifest:
        if not re.match(r'^\d+\.\d+\.\d+$', manifest['version']):
            errors.append(f"Invalid version format: '{manifest['version']}'. Must be semver (x.y.z).")

    # Core version range check
    depends_on = manifest.get('depends_on', {})
    core_range = depends_on.get('core_version_range', '')
    if core_range:
        if not _check_version_range(CORE_VERSION, core_range):
            raise VersionMismatchError(
                f"Pack '{manifest.get('id', '?')}' requires core {core_range}, "
                f"but running core is {CORE_VERSION}."
            )

    if errors:
        raise ManifestValidationError(errors)

    return manifest
