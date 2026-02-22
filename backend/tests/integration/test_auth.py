def test_register_login_and_me(client):
    # Register
    res = client.post(
        "/auth/register",
        json={
            "name": "SJ",
            "email": "sj@test.com",
            "password": "password123",
        },
    )
    assert res.status_code == 200
    user_id = res.json()["id"]

    # Login
    res = client.post(
        "/auth/login",
        json={
            "email": "sj@test.com",
            "password": "password123",
        },
    )
    assert res.status_code == 200
    token = res.json()["access_token"]

    # /me
    res = client.get(
        "/auth/me",
        headers={"Authorization": f"Bearer {token}"},
    )
    assert res.status_code == 200
    assert res.json()["id"] == user_id