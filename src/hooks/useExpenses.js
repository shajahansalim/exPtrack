import { useEffect, useState } from "react";



export function useExpenses(monthKey) {
  const STORAGE_KEY = `expense_${monthKey}`;

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses, STORAGE_KEY]);

  function addExpense(expense) {
    setExpenses((prev) => [
      { id: crypto.randomUUID(), ...expense },
      ...prev,
    ]);
  }

  const deleteExpense = (id) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const totalAmount = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );

  return { expenses, addExpense, deleteExpense, totalAmount };
}
