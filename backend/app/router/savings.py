from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db import get_db
from app import models, schemas
from app.security import get_current_user

router = APIRouter(prefix="/savings", tags=["Savings"])


# ================= CREATE =================
@router.post("", response_model=schemas.SavingResponse)
def create_saving(data: schemas.SavingCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    saving = models.Saving(**data.dict(), user_id=user.id)
    db.add(saving)
    db.commit()
    db.refresh(saving)
    return saving


# ================= READ BY MONTH =================
@router.get("/{month}", response_model=list[schemas.SavingResponse])
def get_savings(month: str, db: Session = Depends(get_db), user = Depends(get_current_user)):
    return (
        db.query(models.Saving)
        .filter(models.Saving.month == month, models.Saving.user_id == user.id)
        .all()
    )


# ================= UPDATE =================
@router.put("/{id}", response_model=schemas.SavingResponse)
def update_saving(id: int, data: schemas.SavingCreate, db: Session = Depends(get_db), user = Depends(get_current_user)):
    saving = db.query(models.Saving).filter(models.Saving.id == id, models.Saving.user_id == user.id).first()

    for key, value in data.dict().items():
        setattr(saving, key, value)

    db.commit()
    db.refresh(saving)
    return saving


# ================= DELETE =================
@router.delete("/{id}")
def delete_saving(id: int, db: Session = Depends(get_db), user = Depends(get_current_user)):
    saving = db.query(models.Saving).filter(models.Saving.id == id, models.Saving.user_id == user.id).first()
    db.delete(saving)
    db.commit()

    return {"message": "Deleted successfully"}
