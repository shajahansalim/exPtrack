import { useEffect, useRef, useState } from "react";
import { toNumber } from "../utils/money";

export function useIncome(monthKey) {
  const STORAGE_KEY = `income_${monthKey}`;
  const hydrated = useRef(false);
  const [income, setIncome] = useState([]);

  useEffect(() => {
    hydrated.current = false;

    const current = localStorage.getItem(STORAGE_KEY);
    if (current && JSON.parse(current).length > 0) {
      setIncome(JSON.parse(current));
      hydrated.current = true;
      return;
    }

    const [year, month] = monthKey.split("-").map(Number);
    const prevMonth =
      month === 1
        ? `${year - 1}-12`
        : `${year}-${String(month - 1).padStart(2, "0")}`;

    const prev = localStorage.getItem(`income_${prevMonth}`);
    if (prev && JSON.parse(prev).length > 0) {
      setIncome(JSON.parse(prev).map(i => ({ ...i, id: crypto.randomUUID() })));
    } else {
      setIncome([]);
    }

    hydrated.current = true;
  }, [monthKey]);

  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(income));
  }, [income, STORAGE_KEY]);

  const addIncome = (item) =>
    setIncome(prev => [
      ...prev,
      { id: crypto.randomUUID(), name: item.name, expected: toNumber(item.expected), actual: toNumber(item.actual) },
    ]);

  const updateIncome = (id, field, value) =>
    setIncome(prev =>
      prev.map(i => i.id === id ? { ...i, [field]: field === "name" ? value : toNumber(value) } : i)
    );

  const deleteIncome = (id) =>
    setIncome(prev => prev.filter(i => i.id !== id));

  const totalExpected = income.reduce((s, i) => s + toNumber(i.expected), 0);
  const totalActual = income.reduce((s, i) => s + toNumber(i.actual), 0);

  return { income, addIncome, updateIncome, deleteIncome, totalExpected, totalActual };
}
