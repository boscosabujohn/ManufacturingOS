import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import authentication
from rest_framework import exceptions

User = get_user_model()

class KeycloakJWTAuthentication(authentication.BaseAuthentication):
    """
    Validates a Keycloak JWT access token.
    For Phase 1 (tracer bullet), we will use a symmetric secret or a mocked public key
    to avoid needing a live Keycloak instance during initial scaffolding and tests.
    """
    keyword = 'Bearer'

    def authenticate(self, request):
        auth = authentication.get_authorization_header(request).split()

        if not auth or auth[0].lower() != self.keyword.lower().encode():
            return None

        if len(auth) == 1:
            raise exceptions.AuthenticationFailed('Invalid token header. No credentials provided.')
        elif len(auth) > 2:
            raise exceptions.AuthenticationFailed('Invalid token header. Token string should not contain spaces.')

        try:
            token = auth[1].decode()
        except UnicodeError:
            raise exceptions.AuthenticationFailed('Invalid token header. Token string should not contain invalid characters.')

        return self.authenticate_credentials(token)

    def authenticate_credentials(self, payload):
        """
        Validate the token and return the user.
        """
        try:
            # For local dev / testing, use a symmetric key defined in settings
            # In a real Keycloak setup, this would fetch public keys from the JWKS endpoint
            decoded_payload = jwt.decode(
                payload, 
                getattr(settings, 'JWT_SECRET', 'test-secret-key'), 
                algorithms=["HS256", "RS256"],
                options={"verify_aud": False}
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired.')
        except jwt.DecodeError:
            raise exceptions.AuthenticationFailed('Error decoding token.')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token.')

        user_id = decoded_payload.get('sub')
        if not user_id:
            raise exceptions.AuthenticationFailed('Token contained no recognizable user identification.')

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed('User not found.')

        if not user.is_active:
            raise exceptions.AuthenticationFailed('User is inactive.')

        return (user, decoded_payload)

    def authenticate_header(self, request):
        return self.keyword
