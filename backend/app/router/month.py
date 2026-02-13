from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Income, Expense, Saving, Debt

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
