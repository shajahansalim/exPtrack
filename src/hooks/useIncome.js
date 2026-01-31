import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

export function useIncome(monthKey) {
  const [income, setIncome] = useState([]);

  // =============================
  // LOAD FROM BACKEND
  // =============================
  const fetchIncome = async () => {
    try {
      const res = await fetch(`${API}/income/${monthKey}`);
      const data = await res.json();
      setIncome(data);
    } catch (err) {
      console.error("Failed to fetch income", err);
    }
  };

  useEffect(() => {
    fetchIncome();
  }, [monthKey]);

  // =============================
  // ADD
  // =============================
  const addIncome = async (item) => {
    await fetch(`${API}/income`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: item.name || "",              // MUST exist
        expected: Number(item.expected ?? 0),
        actual: Number(item.actual ?? 0),
        month: monthKey,
      }),
    });

    fetchIncome();
  };
  // =============================
  // UPDATE
  // =============================
  const updateIncome = async (id, field, value) => {
    const row = income.find((i) => i.id === id);

    await fetch(`${API}/income/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...row,
        [field]: Number(value),
      }),
    });

    fetchIncome();
  };

  // =============================
  // DELETE
  // =============================
  const deleteIncome = async (id) => {
    await fetch(`${API}/income/${id}`, {
      method: "DELETE",
    });

    fetchIncome();
  };

  // =============================
  // TOTALS
  // =============================
  const totalExpected = income.reduce((s, i) => s + i.expected, 0);
  const totalActual = income.reduce((s, i) => s + i.actual, 0);

  return {
    income,
    addIncome,
    updateIncome,
    deleteIncome,
    totalExpected,
    totalActual,
  };
}
