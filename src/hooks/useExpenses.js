import { useEffect, useRef, useState } from "react";

export function useExpenses(monthKey) {
  const STORAGE_KEY = `expense_${monthKey}`;
  const hydrated = useRef(false);
  const [expenses, setExpenses] = useState([]);

  // 🔹 Load when month changes
  useEffect(() => {
    hydrated.current = false;
    const saved = localStorage.getItem(STORAGE_KEY);
    setExpenses(saved ? JSON.parse(saved) : []);
    hydrated.current = true;
  }, [STORAGE_KEY]);

  // 🔹 Save only after hydration
  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses, STORAGE_KEY]);

  const addExpense = (expense) => {
    setExpenses((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...expense,
        amount: Number(expense.amount),
      },
    ]);
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const totalAmount = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );

  return {
    expenses,
    addExpense,
    deleteExpense,
    totalAmount,
  };
}
