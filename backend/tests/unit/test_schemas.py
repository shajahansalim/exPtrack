import pytest
from pydantic import ValidationError
from app.schemas import ExpenseCreate, UserCreate

def test_expense_schema_valid():
    e = ExpenseCreate(
        name="Coffee",
        budget=100,
        actual=80,
        month="2026-01",
        type="need",
    )
    assert e.budget == 100

def test_user_schema_invalid_email():
    with pytest.raises(ValidationError):
        UserCreate(
            name="SJ",
            email="not-an-email",
            password="secret123",
        )