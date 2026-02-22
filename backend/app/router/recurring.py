from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app import models, schemas
from app.security import get_current_user

router = APIRouter(prefix="/recurring", tags=["Recurring"])


# =========================
# RECURRING EXPENSE RULES
# =========================

@router.post("/expenses", response_model=schemas.RecurringExpenseResponse)
def create_recurring_expense(
    data: schemas.RecurringExpenseCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    rule = models.RecurringExpense(
        user_id=user.id,
        type=data.type,
        name=data.name,
        budget=data.budget,
    )
    db.add(rule)
    db.commit()
    db.refresh(rule)
    return rule


@router.get("/expenses", response_model=list[schemas.RecurringExpenseResponse])
def list_recurring_expenses(
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    return (
        db.query(models.RecurringExpense)
        .filter(models.RecurringExpense.user_id == user.id)
        .all()
    )


@router.delete("/expenses/{rule_id}")
def delete_recurring_expense(
    rule_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    rule = (
        db.query(models.RecurringExpense)
        .filter(
            models.RecurringExpense.id == rule_id,
            models.RecurringExpense.user_id == user.id,
        )
        .first()
    )
    if rule:
        db.delete(rule)
        db.commit()
    return {"message": "deleted"}


@router.post("/expenses/apply")
def apply_recurring_expenses(
    data: schemas.ApplyRecurringRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),
):
    month = data.month

    rules = (
        db.query(models.RecurringExpense)
        .filter(models.RecurringExpense.user_id == user.id)
        .all()
    )

    created = 0

    for rule in rules:
        # Avoid creating duplicates for the same month/type/name
        existing = (
            db.query(models.Expense)
            .filter(
                models.Expense.user_id == user.id,
                models.Expense.month == month,
                models.Expense.type == rule.type,
                models.Expense.name == rule.name,
            )
            .first()
        )
        if existing:
            continue

        expense = models.Expense(
            user_id=user.id,
            month=month,
            type=rule.type,
            name=rule.name,
            budget=rule.budget,
            actual=0.0,
        )
        db.add(expense)
        created += 1

    if created:
        db.commit()

    return {"applied": created}

