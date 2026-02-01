from fastapi import APIRouter, Depends, HTTPException
from jose import JWTError,jwt
from sqlalchemy.orm import Session

from app.db import get_db
from app import models, schemas
from app.security import ALGORITHM, SECRET_KEY, get_current_user, hash_password, verify_password
from app.security import create_access_token,create_refresh_token

router = APIRouter(prefix="/auth", tags=["Auth"])


# ================= REGISTER =================
@router.post("/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):

    existing = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = models.User(
        name=user.name,
        email=user.email,
        password_hash=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ================= LOGIN =================
@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(models.User).filter(
        models.User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": str(db_user.id)})
    refresh_token = create_refresh_token({"sub": db_user.id})

    return {
        "access_token": token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }
    
# ================= CURRENT USER =================
@router.get("/me", response_model=schemas.UserOut)
def get_me(current_user: models.User = Depends(get_current_user)):
    return current_user


# ================= CURRENT USER =================
@router.post("/refresh")
def refresh_token(token: str):

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(status_code=401)

    except JWTError:
        raise HTTPException(status_code=401)

    new_access = create_access_token({"sub": user_id})

    return {
        "access_token": new_access
    }