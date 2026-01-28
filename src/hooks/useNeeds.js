import { useState, useEffect } from "react";
import { toNumber } from "../utils/money";

export function useNeeds(monthKey) {
  const STORAGE_KEY = `need_${monthKey}`;

  const [needs, setNeeds] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(needs));
  }, [needs, STORAGE_KEY]);

  const addNeed = (item) =>
    setNeeds((p) => [
      ...p,
      {
        id: crypto.randomUUID(),
        name: item.name,
        budget: toNumber(item.budget),
        actual: toNumber(item.actual),
      },
    ]);

  const updateNeed = (id, field, value) =>
    setNeeds((p) =>
      p.map((n) =>
        n.id === id
          ? { ...n, [field]: field === "name" ? value : toNumber(value) }
          : n
      )
    );

  const deleteNeed = (id) =>
    setNeeds((p) => p.filter((n) => n.id !== id));

  return {
    needs,
    addNeed,
    updateNeed,
    deleteNeed,
    totalBudget: needs.reduce((s, n) => s + toNumber(n.budget), 0),
    totalActual: needs.reduce((s, n) => s + toNumber(n.actual), 0),
  };
}
