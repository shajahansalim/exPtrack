import { useEffect, useState } from "react";
import {
  fetchIncome,
  createIncome,
  updateIncome,
  deleteIncome,
} from "../api/income";

export function useIncome(monthKey) {
  const [income, setIncome] = useState([]);

  const load = async () => {
    setIncome(await fetchIncome(monthKey));
  };

  useEffect(() => {
    load();
  }, [monthKey]);

  const addIncome = async (data) => {
    await createIncome({ ...data, month: monthKey });
    load();
  };

  const updateIncomeField = async (id, field, value) => {
    const row = income.find(i => i.id === id);
    await updateIncome(id, { ...row, [field]: value });
    load();
  };

  const removeIncome = async (id) => {
    await deleteIncome(id);
    load();
  };

  const totalExpected = income.reduce((s, i) => s + Number(i.expected || 0), 0);
  const totalActual = income.reduce((s, i) => s + Number(i.actual || 0), 0);

  return {
    income,
    addIncome,
    updateIncome: updateIncomeField,
    deleteIncome: removeIncome,
    totalExpected,
    totalActual,
  };
}
