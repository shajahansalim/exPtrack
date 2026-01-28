import { useEffect, useRef, useState } from "react";
import { toNumber } from "../utils/money";

export function useIncome(monthKey) {
  const STORAGE_KEY = `income_${monthKey}`;
  const hydrated = useRef(false);

  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ Re-hydrate when month changes
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    hydrated.current = false;
    setIncome(saved ? JSON.parse(saved) : []);
    hydrated.current = true;
  }, [STORAGE_KEY]);

  // ✅ Persist only AFTER hydration
  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(income));
  }, [income, STORAGE_KEY]);

  const addIncome = (item) =>
    setIncome((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: item.name || "",
        expected: toNumber(item.expected),
        actual: toNumber(item.actual),
      },
    ]);

  const updateIncome = (id, field, value) =>
    setIncome((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, [field]: field === "name" ? value : toNumber(value) }
          : i
      )
    );

  const deleteIncome = (id) =>
    setIncome((prev) => prev.filter((i) => i.id !== id));

  return {
    income,
    addIncome,
    updateIncome,
    deleteIncome,
    totalExpected: income.reduce((s, i) => s + toNumber(i.expected), 0),
    totalActual: income.reduce((s, i) => s + toNumber(i.actual), 0),
  };
}
