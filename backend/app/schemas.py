from pydantic import BaseModel
from typing import Optional
from datetime import date
from pydantic import EmailStr

# ================= INCOME =================

class IncomeCreate(BaseModel):
    name: str
    expected: float
    actual: float
    month: str  # "2026-01"

class IncomeResponse(IncomeCreate):
    id: int
    class Config:
        orm_mode = True

# ================= EXPENSE =================

class ExpenseCreate(BaseModel):
    name: str
    budget: float
    actual: float
    month: str
    type: str  # need | want
    
class ExpenseResponse(ExpenseCreate):
    id: int
    class Config:
        orm_mode = True
    
# ================= SAVINGS =================

class SavingCreate(BaseModel):
    name: str
    goal: float
    saved: float
    month: str

class SavingResponse(SavingCreate):
    id: int

    class Config:
        orm_mode = True
        
# ================= DEBT =================

class DebtCreate(BaseModel):
    name: str
    balance: float
    paid: float
    month: str

class DebtResponse(DebtCreate):
    id: int

    class Config:
        orm_mode = True
        
# ================= USER AUTH =================

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True