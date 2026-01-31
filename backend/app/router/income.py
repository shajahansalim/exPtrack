from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app import models, schemas

router = APIRouter(
    prefix="/income",
    tags=["Income"]
)

# ===============================
# CREATE income
# ===============================
@router.post("/")
def create_income(data: schemas.IncomeCreate, db: Session = Depends(get_db)):
    item = models.Income(**data.dict())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


# ===============================
# GET all incomes for a month
# ===============================
@router.get("/{month}")
def get_income(month: str, db: Session = Depends(get_db)):
    return db.query(models.Income).filter(
        models.Income.month == month
    ).all()


# ================= UPDATE =================
@router.put("/{id}", response_model=schemas.IncomeResponse)
def update_income(id: int, data: schemas.IncomeCreate, db: Session = Depends(get_db)):
    income = db.query(models.Income).filter(models.Income.id == id).first()

    for key, value in data.dict().items():
        setattr(income, key, value)

    db.commit()
    db.refresh(income)

    return income

# ===============================
# DELETE income
# ===============================
@router.delete("/{id}")
def delete_income(id: int, db: Session = Depends(get_db)):
    item = db.query(models.Income).get(id)
    db.delete(item)
    db.commit()
    return {"message": "deleted"}