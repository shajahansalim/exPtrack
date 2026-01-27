import { useEffect, useState } from "react";
import { toNumber } from "../utils/money";

const STORAGE_KEY = "needs_v1";

export function useNeeds() {
  const [needs, setNeeds] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // ---------- ADD (from modal) ----------
  const addNeed = (item) => {
    setNeeds((prev) => [
      ...prev,
      {
        id: item.id ?? crypto.randomUUID(),
        name: item.name,
        budget: toNumber(item.budget),
        actual: toNumber(item.actual),
      },
    ]);
  };

  // ---------- UPDATE (future edit modal) ----------
  const updateNeed = (id, field, value) => {
    setNeeds((prev) =>
      prev.map((n) => {
        if (n.id !== id) return n;

        if (field === "name") {
          return { ...n, name: value };
        }

        return { ...n, [field]: toNumber(value) };
      })
    );
  };

  // ---------- DELETE ----------
  const deleteNeed = (id) => {
    setNeeds((prev) => prev.filter((n) => n.id !== id));
  };

  // ---------- TOTALS ----------
  const totalBudget = needs.reduce(
    (sum, n) => sum + toNumber(n.budget),
    0
  );

  const totalActual = needs.reduce(
    (sum, n) => sum + toNumber(n.actual),
    0
  );

  // ---------- PERSIST ----------
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(needs));
  }, [needs]);

  return {
    needs,
    addNeed,
    updateNeed,
    deleteNeed,
    totalBudget,
    totalActual,
  };
}
