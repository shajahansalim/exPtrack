import { useState, useEffect } from "react";
import { toNumber } from "../utils/money";

export function useWants(monthKey) {
  const STORAGE_KEY = `want_${monthKey}`;

  const [wants, setWants] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wants));
  }, [wants, STORAGE_KEY]);

  const addWant = (item) =>
    setWants((p) => [
      ...p,
      {
        id: crypto.randomUUID(),
        name: item.name,
        budget: toNumber(item.budget),
        actual: toNumber(item.actual),
      },
    ]);

  const updateWant = (id, field, value) =>
    setWants((p) =>
      p.map((w) =>
        w.id === id
          ? { ...w, [field]: field === "name" ? value : toNumber(value) }
          : w
      )
    );

  const deleteWant = (id) =>
    setWants((p) => p.filter((w) => w.id !== id));

  return {
    wants,
    addWant,
    updateWant,
    deleteWant,
    totalBudget: wants.reduce((s, w) => s + toNumber(w.budget), 0),
    totalActual: wants.reduce((s, w) => s + toNumber(w.actual), 0),
  };
}
