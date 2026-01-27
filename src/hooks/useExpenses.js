import { useEffect, useState } from "react";

const STORAGE_KEY = "expenses_v1";

export function useExpenses() {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses]);

  const addExpense = (expense) => {
    setExpenses((prev) => [
      { id: crypto.randomUUID(), ...expense },
      ...prev,
    ]);
  };

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const totalAmount = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  return { expenses, addExpense, deleteExpense, totalAmount };
}
