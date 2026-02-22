def auth_headers(client):
    client.post(
        "/auth/register",
        json={
            "name": "User",
            "email": "user@test.com",
            "password": "pass123",
        },
    )
    res = client.post(
        "/auth/login",
        json={
            "email": "user@test.com",
            "password": "pass123",
        },
    )
    token = res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_create_and_get_expense(client):
    headers = auth_headers(client)

    res = client.post(
        "/expenses/",
        json={
            "name": "Groceries",
            "budget": 500,
            "actual": 450,
            "month": "2026-01",
            "type": "need",
        },
        headers=headers,
    )
    assert res.status_code == 200

    res = client.get(
        "/expenses/2026-01/need",
        headers=headers,
    )
    data = res.json()
    assert len(data) == 1
    assert data[0]["name"] == "Groceries"