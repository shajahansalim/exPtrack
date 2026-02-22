from app.security import hash_password, verify_password, create_access_token, create_refresh_token
from jose import jwt
import os

def test_password_hashing():
    password = "supersecretpassword"
    hashed = hash_password(password)
    
    assert hashed != password
    assert verify_password(password, hashed) is True
    assert verify_password("wrongpassword", hashed) is False

def test_create_access_token(monkeypatch):
    monkeypatch.setattr("app.security.SECRET_KEY", "testsecret")
    data = {"sub": "1"}
    token = create_access_token(data)
    
    assert token is not None
    assert type(token) is str
    
    payload = jwt.decode(token, "testsecret", algorithms=["HS256"])
    assert payload["sub"] == "1"
    assert "exp" in payload

def test_create_refresh_token(monkeypatch):
    monkeypatch.setattr("app.security.SECRET_KEY", "testsecret")
    data = {"sub": "1"}
    token = create_refresh_token(data)
    
    assert token is not None
    assert type(token) is str
    
    payload = jwt.decode(token, "testsecret", algorithms=["HS256"])
    assert payload["sub"] == "1"
    assert "exp" in payload
