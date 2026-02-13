from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Income, Expense, Saving, Debt
from app.security import get_current_user

router = APIRouter(prefix="/month", tags=["Month"])


@router.post("/copy")
def copy_month(data: dict, db: Session = Depends(get_db)):
    from_month = data["from"]
    to_month = data["to"]
    categories = data.get("categories", [])
    
    # Log received categories for debugging
    print(f"Received categories: {categories}")
    print(f"Copying from {from_month} to {to_month}")

    def clone(model):
        rows = db.query(model).filter(model.month == from_month).all()
        print(f"Found {len(rows)} rows to clone for {model.__tablename__}")
        for r in rows:
            new = model(**{
                c.name: getattr(r, c.name)
                for c in model.__table__.columns
                if c.name not in ["id", "month"]
            })
            new.month = to_month
            db.add(new)

    # Copy ONLY selected categories (no default fallback)
    if "income" in categories:
        print("Copying Income")
        clone(Income)
    if "expenses" in categories:
        print("Copying Expenses")
        clone(Expense)
    if "savings" in categories:
        print("Copying Savings")
        clone(Saving)
    if "debt" in categories:
        print("Copying Debt")
        clone(Debt)

    db.commit()

    return {"message": "copied", "categories": categories}


@router.get("/analytics/{year}")
def get_analytics_data(year: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    """
    Get aggregated monthly data for a year for analytics
    Returns data for all 12 months of the year
    """
    months = []
    for month_num in range(1, 13):
        month_key = f"{year}-{str(month_num).zfill(2)}"
        
        # Income
        income_rows = db.query(Income).filter(
            Income.month == month_key,
            Income.user_id == user.id
        ).all()
        total_income = sum(row.actual or 0 for row in income_rows)
        
        # Expenses
        needs_rows = db.query(Expense).filter(
            Expense.month == month_key,
            Expense.type == "need",
            Expense.user_id == user.id
        ).all()
        needs_total = sum(row.actual or 0 for row in needs_rows)
        
        wants_rows = db.query(Expense).filter(
            Expense.month == month_key,
            Expense.type == "want",
            Expense.user_id == user.id
        ).all()
        wants_total = sum(row.actual or 0 for row in wants_rows)
        
        total_expenses = needs_total + wants_total
        
        # Savings
        savings_rows = db.query(Saving).filter(
            Saving.month == month_key,
            Saving.user_id == user.id
        ).all()
        total_savings = sum(row.saved or 0 for row in savings_rows)
        
        # Debt
        debt_rows = db.query(Debt).filter(
            Debt.month == month_key,
            Debt.user_id == user.id
        ).all()
        total_debt_paid = sum(row.paid or 0 for row in debt_rows)
        total_debt_balance = sum((row.balance or 0) - (row.paid or 0) for row in debt_rows)
        total_debt_balance = max(0, total_debt_balance)
        
        months.append({
            "month": month_key,
            "month_name": ["January", "February", "March", "April", "May", "June",
                          "July", "August", "September", "October", "November", "December"][month_num - 1],
            "income": total_income,
            "expenses": total_expenses,
            "needs": needs_total,
            "wants": wants_total,
            "savings": total_savings,
            "debt_paid": total_debt_paid,
            "debt_balance": total_debt_balance,
        })
    
    return {"year": year, "months": months}
