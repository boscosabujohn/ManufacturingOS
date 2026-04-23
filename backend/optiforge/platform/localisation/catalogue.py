"""
i18n label catalogue. Labels are flat key → string (per locale). The
extraction pipeline scans source trees for `t(key)` / `tr("key")` calls
and produces the catalogue; here we ship the in-memory registry plus
the scan utility so backend tests can verify coverage.
"""
import os
import re

_catalogue = {}  # locale -> {key: value}


class MissingLabelError(LookupError):
    pass


def register(locale, labels):
    existing = _catalogue.setdefault(locale, {})
    existing.update(labels)


def translate(locale, key, fallback_locale='en-US'):
    if key in _catalogue.get(locale, {}):
        return _catalogue[locale][key]
    if key in _catalogue.get(fallback_locale, {}):
        return _catalogue[fallback_locale][key]
    raise MissingLabelError(
        f"No label '{key}' in '{locale}' or fallback '{fallback_locale}'"
    )


def keys_for(locale):
    return sorted(_catalogue.get(locale, {}).keys())


def clear():
    _catalogue.clear()


_KEY_PATTERNS = [
    re.compile(r"""\bt\(\s*['"]([\w.\-:]+)['"]\s*\)"""),
    re.compile(r"""\btr\(\s*['"]([\w.\-:]+)['"]\s*\)"""),
    re.compile(r"""\bi18n\.t\(\s*['"]([\w.\-:]+)['"]\s*\)"""),
]


def scan_source_for_labels(root, extensions=('.ts', '.tsx', '.jsx', '.js', '.py')):
    """
    Walk `root` and yield every label key referenced via `t(...)`,
    `tr(...)`, or `i18n.t(...)`.
    """
    found = set()
    if not os.path.isdir(root):
        return sorted(found)
    for dirpath, _dirs, files in os.walk(root):
        for name in files:
            if not any(name.endswith(ext) for ext in extensions):
                continue
            path = os.path.join(dirpath, name)
            try:
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    text = f.read()
            except OSError:
                continue
            for pattern in _KEY_PATTERNS:
                for match in pattern.finditer(text):
                    found.add(match.group(1))
    return sorted(found)
