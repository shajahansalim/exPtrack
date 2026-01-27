import { useEffect, useState } from "react";
import { toNumber } from "../utils/money";

const STORAGE_KEY = "income_v1";

const DEFAULT_INCOME = [
  { id: 1, name: "IBM Paycheck", expected: 95000, actual: 95000 },
  { id: 2, name: "EPFO", expected: 0, actual: 28000 },
];

export function useIncome() {
  const [income, setIncome] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : DEFAULT_INCOME;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(income));
  }, [income]);

  const updateIncome = (id, field, value) => {
    setIncome((prev) =>
      prev.map((row) =>
        row.id === id
          ? { ...row, [field]: toNumber(value) }
          : row
      )
    );
  };

  const addIncome = () => {
    setIncome((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: "",
        expected: 0,
        actual: 0,
      },
    ]);
  };

  const totalExpected = income.reduce(
    (s, r) => s + toNumber(r.expected),
    0
  );

  const totalActual = income.reduce(
    (s, r) => s + toNumber(r.actual),
    0
  );

  return {
    income,
    updateIncome,
    addIncome,
    totalExpected,
    totalActual,
  };
}
