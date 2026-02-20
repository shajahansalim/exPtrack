def test_month_analytics_returns_12_months(client, auth_headers):
    res = client.get(
        "/month/analytics/2026",
        headers=auth_headers,
    )

    assert res.status_code == 200
    data = res.json()

    assert data["year"] == 2026
    assert len(data["months"]) == 12

    for month in data["months"]:
        assert "income" in month
        assert "expenses" in month
        assert "needs" in month
        assert "wants" in month
        assert "savings" in month
        assert "debt_paid" in month
        assert "debt_balance" in month
        
def test_month_analytics_math(client, auth_headers):
    # Create income
    client.post(
        "/income/",
        json={
            "name": "Salary",
            "expected": 50000,
            "actual": 50000,
            "month": "2026-01",
        },
        headers=auth_headers,
    )

    # Create expenses
    client.post(
        "/expenses/",
        json={
            "name": "Rent",
            "budget": 20000,
            "actual": 20000,
            "month": "2026-01",
            "type": "need",
        },
        headers=auth_headers,
    )

    client.post(
        "/expenses/",
        json={
            "name": "Netflix",
            "budget": 500,
            "actual": 500,
            "month": "2026-01",
            "type": "want",
        },
        headers=auth_headers,
    )

    res = client.get(
        "/month/analytics/2026",
        headers=auth_headers,
    )

    jan = next(m for m in res.json()["months"] if m["month"] == "2026-01")

    assert jan["income"] == 50000
    assert jan["needs"] == 20000
    assert jan["wants"] == 500
    assert jan["expenses"] == 20500