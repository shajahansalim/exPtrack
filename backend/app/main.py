from fastapi import FastAPI
from .db import engine, Base
from app import models
from app.router import income
from app.router import expenses
from app.router import savings
from app.router import debt

app = FastAPI()

# Create tables automatically
Base.metadata.create_all(bind=engine)

app.include_router(income.router)
app.include_router(expenses.router)
app.include_router(savings.router)
app.include_router(debt.router)

@app.get("/")
def home():
    return {"message": "Backend running 🚀"}

