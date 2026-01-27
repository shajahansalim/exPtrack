import { useEffect, useState } from "react";
import { toNumber } from "../utils/money";

const STORAGE_KEY = "wants_v1";

export function useWants() {
  const [wants, setWants] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // ---------- ADD (from modal) ----------
  const addWant = (item) => {
    setWants((prev) => [
      ...prev,
      {
        id: item.id ?? crypto.randomUUID(),
        name: item.name,
        budget: toNumber(item.budget),
        actual: toNumber(item.actual),
      },
    ]);
  };

  // ---------- DELETE ----------
  const deleteWant = (id) => {
    setWants((prev) => prev.filter((w) => w.id !== id));
  };

  // ---------- TOTALS ----------
  const totalBudget = wants.reduce(
    (sum, w) => sum + toNumber(w.budget),
    0
  );

  const totalActual = wants.reduce(
    (sum, w) => sum + toNumber(w.actual),
    0
  );

  // ---------- PERSIST ----------
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wants));
  }, [wants]);

  return {
    wants,
    addWant,
    deleteWant,
    totalBudget,
    totalActual,
  };
}
