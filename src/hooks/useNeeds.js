import { useEffect, useRef, useState } from "react";
import { toNumber } from "../utils/money";

export function useNeeds(monthKey) {
  const STORAGE_KEY = `need_${monthKey}`;
  const hydrated = useRef(false);
  const [needs, setNeeds] = useState([]);

  useEffect(() => {
    hydrated.current = false;

    const current = localStorage.getItem(STORAGE_KEY);
    if (current && JSON.parse(current).length > 0) {
      setNeeds(JSON.parse(current));
      hydrated.current = true;
      return;
    }

    const [year, month] = monthKey.split("-").map(Number);
    const prevMonth =
      month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, "0")}`;

    const prev = localStorage.getItem(`need_${prevMonth}`);
    if (prev && JSON.parse(prev).length > 0) {
      setNeeds(JSON.parse(prev).map(n => ({ ...n, id: crypto.randomUUID() })));
    } else {
      setNeeds([]);
    }

    hydrated.current = true;
  }, [monthKey]);

  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(needs));
  }, [needs, STORAGE_KEY]);

  const addNeed = (item) =>
    setNeeds(prev => [
      ...prev,
      { id: crypto.randomUUID(), name: item.name, budget: toNumber(item.budget), actual: toNumber(item.actual) },
    ]);

  const updateNeed = (id, field, value) =>
    setNeeds(prev =>
      prev.map(n => n.id === id ? { ...n, [field]: field === "name" ? value : toNumber(value) } : n)
    );

  const deleteNeed = (id) =>
    setNeeds(prev => prev.filter(n => n.id !== id));

  const totalBudget = needs.reduce((s, n) => s + toNumber(n.budget), 0);
  const totalActual = needs.reduce((s, n) => s + toNumber(n.actual), 0);

  return { needs, addNeed, updateNeed, deleteNeed, totalBudget, totalActual };
}
