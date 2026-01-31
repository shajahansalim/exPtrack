from sqlalchemy import Column, Integer, String, Float
from .db import Base


# ================= INCOME =================

class Income(Base):
    __tablename__ = "income"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, index=True)
    name = Column(String)
    expected = Column(Float)
    actual = Column(Float)

# ================= EXPENSE =================

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, index=True)
    type = Column(String)  # "need" or "want"
    name = Column(String)
    budget = Column(Float)
    actual = Column(Float)
    
# ================= SAVINGS =================

class Saving(Base):
    __tablename__ = "savings"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, index=True)  # "2026-01"
    name = Column(String)
    goal = Column(Float)     # target amount
    saved = Column(Float)    # amount saved this month
    
# ================= DEBT =================

class Debt(Base):
    __tablename__ = "debt"

    id = Column(Integer, primary_key=True, index=True)
    month = Column(String, index=True)   # "2026-01"
    name = Column(String)
    balance = Column(Float)   # total loan
    paid = Column(Float)      # paid amount