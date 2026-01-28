import { useEffect, useRef, useState } from "react";
import { toNumber } from "../utils/money";

export function useNeeds(monthKey) {
  const STORAGE_KEY = `need_${monthKey}`;
  const hydrated = useRef(false);
  const [needs, setNeeds] = useState([]);

  useEffect(() => {
    hydrated.current = false;
    const saved = localStorage.getItem(STORAGE_KEY);
    setNeeds(saved ? JSON.parse(saved) : []);
    hydrated.current = true;
  }, [STORAGE_KEY]);

  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(needs));
  }, [needs, STORAGE_KEY]);

  const addNeed = (item) => {
    setNeeds((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: item.name,
        budget: toNumber(item.budget),
        actual: toNumber(item.actual),
      },
    ]);
  };

  const updateNeed = (id, field, value) => {
    setNeeds((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, [field]: field === "name" ? value : toNumber(value) }
          : n
      )
    );
  };

  const deleteNeed = (id) => {
    setNeeds((prev) => prev.filter((n) => n.id !== id));
  };

  const totalBudget = needs.reduce((s, n) => s + toNumber(n.budget), 0);
  const totalActual = needs.reduce((s, n) => s + toNumber(n.actual), 0);

  return {
    needs,
    addNeed,
    updateNeed,
    deleteNeed,
    totalBudget,
    totalActual,
  };
}
