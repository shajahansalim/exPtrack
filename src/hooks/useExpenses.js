import { useEffect, useRef, useState } from "react";
import { toNumber } from "../utils/money";

export function useExpenses(monthKey) {
  const STORAGE_KEY = `expense_${monthKey}`;
  const hydrated = useRef(false);
  const [expenses, setExpenses] = useState([]);

  // ================= LOAD (with forward copy) =================
  useEffect(() => {
    hydrated.current = false;

    // 1️⃣ Try current month
    const current = localStorage.getItem(STORAGE_KEY);
    if (current && JSON.parse(current).length > 0) {
      setExpenses(JSON.parse(current));
      hydrated.current = true;
      return;
    }

    // 2️⃣ Copy ONLY from previous month
    const [year, month] = monthKey.split("-").map(Number);
    const prevMonth =
      month === 1
        ? `${year - 1}-12`
        : `${year}-${String(month - 1).padStart(2, "0")}`;

    const prev = localStorage.getItem(`expense_${prevMonth}`);
    if (prev && JSON.parse(prev).length > 0) {
      setExpenses(
        JSON.parse(prev).map((e) => ({
          ...e,
          id: crypto.randomUUID(), // 🔑 new identity
        }))
      );
    } else {
      setExpenses([]);
    }

    hydrated.current = true;
  }, [monthKey]);

  // ================= SAVE =================
  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses, STORAGE_KEY]);

  // ================= ACTIONS =================
  const addExpense = (expense) => {
    setExpenses((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...expense,
        amount: toNumber(expense.amount),
      },
    ]);
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // ================= TOTAL =================
  const totalAmount = expenses.reduce(
    (sum, e) => sum + toNumber(e.amount),
    0
  );

  return {
    expenses,
    addExpense,
    deleteExpense,
    totalAmount,
  };
}
