from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app import models, schemas
from app.security import get_current_user

router = APIRouter(
    prefix="/income",
    tags=["Income"]
)

# ===============================
# CREATE income
# ===============================
@router.post("/")
def create_income(data: schemas.IncomeCreate, db: Session = Depends(get_db),user = Depends(get_current_user)):
    item = models.Income(**data.dict(), user_id=user.id)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


# ===============================
# GET all incomes for a month
# ===============================
@router.get("/{month}")
def get_income(month: str, db: Session = Depends(get_db),user = Depends(get_current_user)):
    return db.query(models.Income).filter(
        models.Income.month == month,
        models.Income.user_id == user.id
    ).all()


# ================= UPDATE =================
@router.put("/{id}", response_model=schemas.IncomeResponse)
def update_income(id: int, data: schemas.IncomeCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    income = db.query(models.Income).filter(models.Income.id == id, models.Income.user_id == user.id).first()

    for key, value in data.dict().items():
        setattr(income, key, value)

    db.commit()
    db.refresh(income)

    return income

# ===============================
# DELETE income
# ===============================
@router.delete("/{id}")
def delete_income(id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    item = db.query(models.Income).filter(models.Income.id == id, models.Income.user_id == user.id).first()
    db.delete(item)
    db.commit()
    return {"message": "deleted"}