import { useEffect, useRef, useState } from "react";
import { toNumber } from "../utils/money";

export function useWants(monthKey) {
  const STORAGE_KEY = `want_${monthKey}`;
  const hydrated = useRef(false);
  const [wants, setWants] = useState([]);

  useEffect(() => {
    hydrated.current = false;
    const saved = localStorage.getItem(STORAGE_KEY);
    setWants(saved ? JSON.parse(saved) : []);
    hydrated.current = true;
  }, [STORAGE_KEY]);

  useEffect(() => {
    if (!hydrated.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wants));
  }, [wants, STORAGE_KEY]);

  const addWant = (item) => {
    setWants((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: item.name,
        budget: toNumber(item.budget),
        actual: toNumber(item.actual),
      },
    ]);
  };

  const updateWant = (id, field, value) => {
    setWants((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, [field]: field === "name" ? value : toNumber(value) }
          : w
      )
    );
  };

  const deleteWant = (id) => {
    setWants((prev) => prev.filter((w) => w.id !== id));
  };

  const totalBudget = wants.reduce((s, w) => s + toNumber(w.budget), 0);
  const totalActual = wants.reduce((s, w) => s + toNumber(w.actual), 0);

  return {
    wants,
    addWant,
    updateWant,
    deleteWant,
    totalBudget,
    totalActual,
  };
}
