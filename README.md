# exPtrack 💰  
### Modern Personal Finance & Expense Tracking Dashboard

exPtrack is a clean, privacy-first personal finance tracking application that helps users manage **income, expenses, savings, and debt** on a **month-by-month basis**.

It is designed with **SaaS-grade UI/UX**, predictable data behavior, and an architecture that is **ready for backend integration**.

---

## ✨ Core Features

### 📆 Month-Wise Financial Tracking
- Independent data for each month
- Seamless switching between months
- No accidental data mixing
- Persistent storage per month
- Designed for future & historical planning

### 💸 Income Management
- Multiple income sources
- Expected vs actual income
- Monthly totals calculated automatically

### 🧾 Expense Categorization
- **Needs** – fixed & essential expenses
- **Wants** – discretionary spending
- Budget vs actual comparison
- Variance (over / under budget) indicators
- Edit & delete support

### 💰 Savings Tracking
- Goal-based savings
- Monthly contribution tracking
- Remaining target calculation
- Savings included in cash-flow calculations

### 🏦 Debt Management
- Track loans & liabilities
- Total vs paid amount
- Remaining balance visibility
- Monthly cash-flow impact awareness

### 📊 KPI Overview
- Total income
- Total spending
- Available balance
- Net worth
- Income allocation percentage

### ✏️ Editable Records
- Add / edit / delete for all sections
- Reusable modal design
- Inline edit actions for speed & clarity

### 📄 PDF Export
- Professional, multi-page PDF
- Monthly financial summary
- Structured tables & KPIs
- Shareable & archive-ready


---

## 🛠 Tech Stack

- **Frontend:** React (Hooks-based)
- **Styling:** Tailwind CSS
- **State Management:** Custom hooks
- **Persistence:** LocalStorage (temporary)
- **PDF Export:** DOM → PDF rendering
- **Build Tool:** Vite

---

## 🚀 Getting Started
```bash
# Clone the Repository
git@github.com:shajahansalim/sjx-expense-tracker.git
cd sjx-expense-tracker

#Install Dependencies
npm install

#Run Locally
npm run dev

#The application will be available at:
http://localhost:5173
