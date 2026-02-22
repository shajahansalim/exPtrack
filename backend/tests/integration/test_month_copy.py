def test_month_copy_selected_categories(client, auth_headers):
    # Create source data
    client.post(
        "/income/",
        json={
            "name": "Salary",
            "expected": 40000,
            "actual": 40000,
            "month": "2026-03",
        },
        headers=auth_headers,
    )

    client.post(
        "/expenses/",
        json={
            "name": "Groceries",
            "budget": 5000,
            "actual": 4500,
            "month": "2026-03",
            "type": "need",
        },
        headers=auth_headers,
    )

    # Copy ONLY expenses
    res = client.post(
        "/month/copy",
        json={
            "from": "2026-03",
            "to": "2026-04",
            "categories": ["expenses"],
        },
        headers=auth_headers,
    )

    assert res.status_code == 200

    # Expenses copied
    res = client.get(
        "/expenses/2026-04/need",
        headers=auth_headers,
    )
    assert len(res.json()) == 1

    # Income NOT copied
    res = client.get(
        "/income/2026-04",
        headers=auth_headers,
    )
    assert res.json() == []