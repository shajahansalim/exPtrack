import { useEffect, useRef, useState } from "react";
import { toNumber } from "../utils/money";

export function useWants(monthKey) {
  const STORAGE_KEY = `want_${monthKey}`;
  const hydrated = useRef(false);
  const [wants, setWants] = useState([]);

  useEffect(() => {
    hydrated.current = false;

    const current = localStorage.getItem(STORAGE_KEY);
    if (current && JSON.parse(current).length > 0) {
      setWants(JSON.parse(current));
      hydrated.current = true;
      return;
    }

    const [year, month] = monthKey.split("-").map(Number);
    const prevMonth =
      month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, "0")}`;

    const prev = localStorage.getItem(`want_${prevMonth}`);
    if (prev && JSON.parse(prev).length > 0) {
      setWants(JSON.parse(prev).map(w => ({ ...w, id: crypto.randomUUID() })));
    } else {
      setWants([]);
    }

    hydrated.current = true;
  }, [monthKey]);

  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wants));
  }, [wants, STORAGE_KEY]);

  const addWant = (item) =>
    setWants(prev => [
      ...prev,
      { id: crypto.randomUUID(), name: item.name, budget: toNumber(item.budget), actual: toNumber(item.actual) },
    ]);

  const updateWant = (id, field, value) =>
    setWants(prev =>
      prev.map(w => w.id === id ? { ...w, [field]: field === "name" ? value : toNumber(value) } : w)
    );

  const deleteWant = (id) =>
    setWants(prev => prev.filter(w => w.id !== id));

  const totalBudget = wants.reduce((s, w) => s + toNumber(w.budget), 0);
  const totalActual = wants.reduce((s, w) => s + toNumber(w.actual), 0);

  return { wants, addWant, updateWant, deleteWant, totalBudget, totalActual };
}
