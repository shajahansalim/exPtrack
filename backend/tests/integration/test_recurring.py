def test_recurring_apply_idempotent(client, auth_headers):
    # Create recurring rule
    client.post(
        "/recurring/expenses",
        json={
            "name": "Internet",
            "budget": 1000,
            "type": "need",
        },
        headers=auth_headers,
    )

    # Apply rules
    res = client.post(
        "/recurring/expenses/apply",
        json={"month": "2026-02"},
        headers=auth_headers,
    )

    assert res.status_code == 200
    assert res.json()["applied"] == 1

    # Re-apply should NOT duplicate
    res = client.post(
        "/recurring/expenses/apply",
        json={"month": "2026-02"},
        headers=auth_headers,
    )

    assert res.json()["applied"] == 0

    # Verify expense exists
    res = client.get(
        "/expenses/2026-02/need",
        headers=auth_headers,
    )

    expense = res.json()[0]
    assert expense["name"] == "Internet"
    assert expense["budget"] == 1000
    assert expense["actual"] == 0.0