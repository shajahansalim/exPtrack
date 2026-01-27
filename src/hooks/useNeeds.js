import { useEffect, useState } from "react";
import { toNumber } from "../utils/money";

const STORAGE_KEY = "needs_v1";

export function useNeeds() {
  const [needs, setNeeds] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const updateNeed = (id, field, value) => {
  setNeeds((prev) =>
    prev.map((n) => {
      if (n.id !== id) return n;

      if (field === "name") {
        return { ...n, name: value };
      }

      return { ...n, [field]: Number(value || 0) };
    })
  );
};

  const DEFAULT_NEEDS = [
    { id: crypto.randomUUID(), name: "", budget: 0, actual: 0 },
  ];

  const addNeed = () => {
    const item = {
      id: crypto.randomUUID(),
      name: "",
      budget: 0,
      actual: 0,
    };
    setNeeds((prev) => [...prev, item]);
  };

  const deleteNeed = (id) => {
    setNeeds((prev) => prev.filter((n) => n.id !== id));
  };

  const totalBudget = needs.reduce(
    (s, n) => s + toNumber(n.budget),
    0
  );

  const totalActual = needs.reduce(
    (s, n) => s + toNumber(n.actual),
    0
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(needs));
  }, [needs]);

  return {
    needs,
    updateNeed,
    addNeed,
    deleteNeed,
    totalBudget,
    totalActual,
  };
}
