from fastapi import FastAPI
from .db import engine, Base
from app import models
from app.router import income
from app.router import expenses
from app.router import savings
from app.router import debt
from app.router import auth
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.router import month
from app.router import recurring

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables automatically
Base.metadata.create_all(bind=engine)

app.include_router(income.router)
app.include_router(expenses.router)
app.include_router(savings.router)
app.include_router(debt.router)
app.include_router(auth.router)
app.include_router(month.router)
app.include_router(recurring.router)

@app.get("/")
def home():
    return {"message": "Backend running 🚀"}

