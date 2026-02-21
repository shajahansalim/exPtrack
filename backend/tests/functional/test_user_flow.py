def test_end_to_end_user_flow(client):
    # 1. Register a new user
    res_register = client.post(
        "/auth/register",
        json={
            "name": "E2E User",
            "email": "e2e@example.com",
            "password": "strongpassword123",
        },
    )
    assert res_register.status_code == 200
    
    # 2. Login to get token
    res_login = client.post(
        "/auth/login",
        json={
            "email": "e2e@example.com",
            "password": "strongpassword123",
        },
    )
    assert res_login.status_code == 200
    token = res_login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. Add an expense
    res_add_expense = client.post(
        "/expenses/",
        json={
            "name": "Groceries",
            "budget": 200.0,
            "actual": 150.0,
            "month": "2026-02",
            "type": "need"
        },
        headers=headers
    )
    assert res_add_expense.status_code == 200
    expense_data = res_add_expense.json()
    assert expense_data["name"] == "Groceries"
    assert expense_data["actual"] == 150.0
    
    # 4. Get expenses for the month
    res_get_expenses = client.get(
        "/expenses/2026-02/need",
        headers=headers
    )
    assert res_get_expenses.status_code == 200
    expenses_list = res_get_expenses.json()
    assert len(expenses_list) == 1
    assert expenses_list[0]["name"] == "Groceries"
    
    # 5. Get month analytics overview
    res_month_data = client.get(
        "/month/analytics/2026",
        headers=headers
    )
    assert res_month_data.status_code == 200
    month_data = res_month_data.json()
    assert "months" in month_data
    assert len(month_data["months"]) == 12
