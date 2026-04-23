import jwt
import pytest
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import exceptions
from optiforge.platform.identity.auth import KeycloakJWTAuthentication

User = get_user_model()

@pytest.fixture
def auth_class():
    return KeycloakJWTAuthentication()

@pytest.fixture
def test_user():
    return User.objects.create_user(username='testuser', email='test@example.com')

@pytest.mark.django_db
def test_valid_jwt_authentication(auth_class, test_user):
    payload = {'sub': str(test_user.id)}
    token = jwt.encode(payload, getattr(settings, 'JWT_SECRET', 'test-secret-key'), algorithm='HS256')
    
    user, decoded = auth_class.authenticate_credentials(token)
    assert user == test_user
    assert decoded['sub'] == str(test_user.id)

@pytest.mark.django_db
def test_invalid_jwt_authentication(auth_class):
    with pytest.raises(exceptions.AuthenticationFailed) as exc:
        auth_class.authenticate_credentials('invalid.token.here')
    assert 'Error decoding token' in str(exc.value)

@pytest.mark.django_db
def test_missing_user_jwt_authentication(auth_class):
    payload = {'sub': '99999'} # Non-existent user
    token = jwt.encode(payload, getattr(settings, 'JWT_SECRET', 'test-secret-key'), algorithm='HS256')
    
    with pytest.raises(exceptions.AuthenticationFailed) as exc:
        auth_class.authenticate_credentials(token)
    assert 'User not found' in str(exc.value)
