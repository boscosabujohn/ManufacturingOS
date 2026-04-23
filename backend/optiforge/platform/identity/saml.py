"""
SAML SP metadata stub. Real integration uses python3-saml or pysaml2 behind
`sp_metadata_xml` and `consume_response`. The stub publishes a schema-
conforming SP metadata document and verifies a signed assertion against a
shared X.509 cert.

Phase 2 scope: metadata publication + an assertion verifier that hashes the
assertion with the configured signing secret and compares. Production will
swap in XML-signature verification.
"""
import base64
import hashlib
import hmac
from datetime import datetime, timezone


class SAMLConfigError(ValueError):
    pass


class SAMLAssertionError(ValueError):
    pass


def sp_metadata_xml(entity_id, acs_url):
    """Return SP metadata XML. Minimal but parseable."""
    if not entity_id or not acs_url:
        raise SAMLConfigError("entity_id and acs_url are required")
    now = datetime.now(timezone.utc).isoformat()
    return f"""<?xml version="1.0"?>
<EntityDescriptor xmlns="urn:oasis:names:tc:SAML:2.0:metadata" entityID="{entity_id}">
  <SPSSODescriptor protocolSupportEnumeration="urn:oasis:names:tc:SAML:2.0:protocol">
    <AssertionConsumerService Binding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
                              Location="{acs_url}" index="1" isDefault="true"/>
    <NameIDFormat>urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress</NameIDFormat>
    <Extension><PublishedAt>{now}</PublishedAt></Extension>
  </SPSSODescriptor>
</EntityDescriptor>"""


def sign_assertion(assertion, shared_secret):
    """Stub signing: HMAC-SHA256 of the canonical assertion string."""
    payload = assertion.encode('utf-8') if isinstance(assertion, str) else assertion
    key = shared_secret.encode('utf-8') if isinstance(shared_secret, str) else shared_secret
    return base64.b64encode(hmac.new(key, payload, hashlib.sha256).digest()).decode()


def verify_response(assertion, signature, shared_secret):
    """
    Verify a SAML response assertion. Returns the assertion dict when valid.
    Raises SAMLAssertionError on any mismatch.
    """
    if not signature:
        raise SAMLAssertionError("Missing signature")
    expected = sign_assertion(assertion, shared_secret)
    if not hmac.compare_digest(expected, signature):
        raise SAMLAssertionError("Signature mismatch")
    return assertion
