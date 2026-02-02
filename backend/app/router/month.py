from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models import Income, Expense, Saving, Debt

router = APIRouter(prefix="/month", tags=["Month"])


@router.post("/copy")
def copy_month(data: dict, db: Session = Depends(get_db)):
    from_month = data["from"]
    to_month = data["to"]

    def clone(model):
        rows = db.query(model).filter(model.month == from_month).all()
        for r in rows:
            new = model(**{
                c.name: getattr(r, c.name)
                for c in model.__table__.columns
                if c.name not in ["id", "month"]
            })
            new.month = to_month
            db.add(new)

    clone(Income)
    clone(Expense)
    clone(Saving)
    clone(Debt)

    db.commit()

    return {"message": "copied"}
