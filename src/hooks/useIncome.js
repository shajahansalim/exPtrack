import { useEffect, useState } from "react";
import { toNumber } from "../utils/money";

const STORAGE_KEY = "income_v1";

const DEFAULT_INCOME = [
  { id: 1, name: "Paycheck", expected: 0, actual: 0 },
];

export function useIncome() {
  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_INCOME;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(income));
  }, [income]);

  // -------- ADD (from modal or form later) --------
  const addIncome = (item) => {
    setIncome((prev) => [
      ...prev,
      {
        id: item.id ?? crypto.randomUUID(),
        name: item.name,
        expected: toNumber(item.expected),
        actual: toNumber(item.actual),
      },
    ]);
  };

  // -------- UPDATE --------
  const updateIncome = (id, field, value) => {
    setIncome((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;

        if (field === "name") {
          return { ...i, name: value };
        }

        return { ...i, [field]: toNumber(value) };
      })
    );
  };

  // -------- DELETE --------
  const deleteIncome = (id) => {
    setIncome((prev) => prev.filter((i) => i.id !== id));
  };

  // -------- TOTALS --------
  const totalExpected = income.reduce(
    (sum, i) => sum + toNumber(i.expected),
    0
  );

  const totalActual = income.reduce(
    (sum, i) => sum + toNumber(i.actual),
    0
  );

  return {
    income,
    addIncome,
    updateIncome,
    deleteIncome,
    totalExpected,
    totalActual,
  };
}
