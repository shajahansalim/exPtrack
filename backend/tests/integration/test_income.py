def test_create_income(client, auth_headers):
    res = client.post(
        "/income/",
        json={
            "name": "Salary",
            "expected": 50000,
            "actual": 50000,
            "month": "2026-01",
        },
        headers=auth_headers,
    )

    assert res.status_code == 200
    assert res.json()["name"] == "Salary"