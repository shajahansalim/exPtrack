import { useEffect, useState } from "react";
import { toNumber } from "../utils/money";

const STORAGE_KEY = "wants_v1";


export function useWants() {
  const [wants, setWants] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  const DEFAULT_WANTS = [
    { id: crypto.randomUUID(), name: "", budget: 0, actual: 0 },
  ];

  const [needs, setNeeds] = useState(() => {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : DEFAULT_NEEDS;
});

  const updateWant = (id, field, value) => {
  setWants((prev) =>
    prev.map((w) => {
      if (w.id !== id) return w;

      if (field === "name") {
        return { ...w, name: value };
      }

      return { ...w, [field]: Number(value || 0) };
    })
  );
};

  const addWant = () => {
    const item = {
      id: crypto.randomUUID(),
      name: "",
      budget: 0,
      actual: 0,
    };
    setWants((prev) => [...prev, item]);
  };

  const deleteWant = (id) => {
    setWants((prev) => prev.filter((w) => w.id !== id));
  };

  const totalActual = wants.reduce(
    (s, w) => s + toNumber(w.actual),
    0
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wants));
  }, [wants]);

  return {
    wants,
    updateWant,
    addWant,
    deleteWant,
    totalActual,
  };
}
