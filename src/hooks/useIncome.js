import { useState, useEffect } from "react";
import { toNumber } from "../utils/money";

export function useIncome(monthKey) {
  const STORAGE_KEY = `income_${monthKey}`;

  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(income));
  }, [income, STORAGE_KEY]);

  const addIncome = (item) =>
    setIncome((p) => [
      ...p,
      {
        id: crypto.randomUUID(),
        name: item.name,
        expected: toNumber(item.expected),
        actual: toNumber(item.actual),
      },
    ]);

  const updateIncome = (id, field, value) =>
    setIncome((p) =>
      p.map((i) =>
        i.id === id
          ? { ...i, [field]: field === "name" ? value : toNumber(value) }
          : i
      )
    );

  const deleteIncome = (id) =>
    setIncome((p) => p.filter((i) => i.id !== id));

  return {
    income,
    addIncome,
    updateIncome,
    deleteIncome,
    totalExpected: income.reduce((s, i) => s + toNumber(i.expected), 0),
    totalActual: income.reduce((s, i) => s + toNumber(i.actual), 0),
  };
}
