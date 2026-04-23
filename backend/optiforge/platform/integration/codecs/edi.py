"""
EDI codec stubs: X12, EDIFACT, AS2. Each codec parses a trivial fixture
into segments; full message coverage is deferred until a real integration
needs it.
"""


class EDIParseError(ValueError):
    pass


def parse_x12(raw):
    """
    Minimal X12 parser: segments end with '~' and fields are separated by '*'.
    Returns a list of [segment_id, *fields].
    """
    if not raw:
        raise EDIParseError("empty X12 payload")
    segments = [seg for seg in raw.split('~') if seg.strip()]
    parsed = []
    for seg in segments:
        fields = seg.split('*')
        parsed.append({'segment': fields[0], 'fields': fields[1:]})
    return parsed


def parse_edifact(raw):
    """
    Minimal EDIFACT parser: segments end with "'" and fields are separated by
    "+". Returns segments as dicts.
    """
    if not raw:
        raise EDIParseError("empty EDIFACT payload")
    segments = [seg for seg in raw.split("'") if seg.strip()]
    parsed = []
    for seg in segments:
        fields = seg.split('+')
        parsed.append({'segment': fields[0], 'fields': fields[1:]})
    return parsed


def wrap_as2(body, sender, recipient):
    """
    Minimal AS2 wrapper: emits a dict that carries the AS2 headers required
    by the transport layer. No MDN, MIME, or encryption — that's deferred.
    """
    return {
        'AS2-From': sender,
        'AS2-To': recipient,
        'Content-Type': 'application/edi-x12',
        'body': body,
    }


def unwrap_as2(envelope):
    required = ('AS2-From', 'AS2-To', 'body')
    for key in required:
        if key not in envelope:
            raise EDIParseError(f"AS2 envelope missing '{key}'")
    return envelope['body']
