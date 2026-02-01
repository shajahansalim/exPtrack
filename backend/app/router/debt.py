from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app import models, schemas
from app.security import get_current_user

router = APIRouter(prefix="/debt", tags=["Debt"])


# ================= CREATE =================
@router.post("", response_model=schemas.DebtResponse)
def create_debt(data: schemas.DebtCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    debt = models.Debt(**data.dict(), user_id=user.id)
    db.add(debt)
    db.commit()
    db.refresh(debt)
    return debt


# ================= READ BY MONTH =================
@router.get("/{month}", response_model=list[schemas.DebtResponse])
def get_debt(month: str, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return (
        db.query(models.Debt)
        .filter(models.Debt.month == month, models.Debt.user_id == user.id)
        .all()
    )


# ================= UPDATE =================
@router.put("/{id}", response_model=schemas.DebtResponse)
def update_debt(id: int, data: schemas.DebtCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    debt = db.query(models.Debt).filter(models.Debt.id == id, models.Debt.user_id == user.id).first()

    for key, value in data.dict().items():
        setattr(debt, key, value)

    db.commit()
    db.refresh(debt)
    return debt


# ================= DELETE =================
@router.delete("/{id}")
def delete_debt(id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    debt = db.query(models.Debt).filter(models.Debt.id == id, models.Debt.user_id == user.id).first()
    db.delete(debt)
    db.commit()

    return {"message": "Deleted successfully"}
