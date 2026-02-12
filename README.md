![alt text](https://github.com/shajahansalim/sjx-expense-tracker/blob/dev/public/exPtrack_Mockup.png)

A modern, open-source expense tracking system built with FastAPI, React, and PostgreSQL.

exPtrack is a full-stack personal finance tracker designed to be clean, minimal, cloud-native, and production-ready. It is both a usable application and a learning resource for DevOps Engineers to practice real world DevOps workflows.

## 🛠 Tech Stack

### Frontend
- React
- Tailwind CSS
- Component-based architecture

### Backend
- FastAPI
- SQLAlchemy
- Pydantic v2
- Uvicorn

### Database
- Supabase PostgreSQL
- pgBouncer (Transaction Pooler)

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git@github.com:shajahansalim/exPtrack.git
cd exPtrack
```

### 2. Backend Setup
```bash
cd backend

#Create virtual environment
python -m venv venv

#Activate the virtual environment
source venv/bin/activate  # Windows: venv\Scripts\activate

#Install dependencies
pip install -r requirements.txt

#Create a .env file inside backend/
DATABASE_URL=postgresql://postgres:<PASSWORD>@<POOLER_HOST>:6543/postgres?sslmode=require

#start the FastAPI server
uvicorn app.main:app --reload

#The backend will be available at:
http://localhost:8080
```

### 3. Frontend Setup
```bash
#Install Dependencies
npm install

#Run Locally
npm run dev

#The application will be available at:
http://localhost:5173
```

