import { useEffect, useRef, useState } from "react";
import { toNumber } from "../utils/money";

export function useExpenses(monthKey) {
  const STORAGE_KEY = `expense_${monthKey}`;
  const hydrated = useRef(false);

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // 🔹 Load when month changes
  useEffect(() => {
    hydrated.current = false;
    const saved = localStorage.getItem(STORAGE_KEY);
    setExpenses(saved ? JSON.parse(saved) : []);
    hydrated.current = true;
  }, [STORAGE_KEY]);

  // 🔹 Save ONLY after hydration
  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
  }, [expenses, STORAGE_KEY]);

  const addExpense = (item) =>
    setExpenses((prev) => [
      {
        id: crypto.randomUUID(),
        name: item.name || "",
        amount: toNumber(item.amount),
        category: item.category || "general",
      },
      ...prev,
    ]);

  const updateExpense = (id, field, value) =>
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, [field]: field === "name" ? value : toNumber(value) }
          : e
      )
    );

  const deleteExpense = (id) =>
    setExpenses((prev) => prev.filter((e) => e.id !== id));

  return {
    expenses,
    addExpense,
    updateExpense,
    deleteExpense,
    totalAmount: expenses.reduce(
      (sum, e) => sum + toNumber(e.amount),
      0
    ),
  };
}
