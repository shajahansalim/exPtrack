from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app import models, schemas
from app.security import get_current_user

router = APIRouter(prefix="/expenses", tags=["Expenses"])


# =========================
# CREATE
# =========================
@router.post("/")
def create_expense(data: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    item = models.Expense(**data.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


# =========================
# GET by month + type
# =========================
@router.get("/{month}/{type}")
def get_expenses(month: str, type: str, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return db.query(models.Expense).filter(
        models.Expense.month == month,
        models.Expense.type == type,
        models.Expense.user_id == user.id
    ).all()

# ================= UPDATE =================
@router.put("/{id}", response_model=schemas.ExpenseResponse)
def update_expense(id: int, data: schemas.ExpenseCreate, db: Session = Depends(get_db)):
    expense = db.query(models.Expense).filter(models.Expense.id == id).first()

    for key, value in data.dict().items():
        setattr(expense, key, value)

    db.commit()
    db.refresh(expense)

    return expense

# =========================
# DELETE
# =========================
@router.delete("/{id}")
def delete_expense(id: int, db: Session = Depends(get_db)):
    item = db.query(models.Expense).get(id)
    db.delete(item)
    db.commit()
    return {"message": "deleted"}
