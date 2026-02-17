import { useEffect, useState } from "react";
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../api/expenses";
import { applyRecurringExpenses } from "../api/recurring";

export function useExpenses(monthKey, type) {
  const [expenses, setExpenses] = useState([]);

  const load = async () => {
    // For one of the expense types (e.g. "need"), ensure recurring rules are applied.
    if (type === "need") {
      try {
        await applyRecurringExpenses(monthKey);
      } catch (err) {
        console.error("Failed to apply recurring expenses", err);
      }
    }
    setExpenses(await fetchExpenses(monthKey, type));
  };

  useEffect(() => {
    load();
  }, [monthKey, type]);

  const addExpense = async (data) => {
    await createExpense({
      ...data,
      month: monthKey,
      type,
    });
    load();
  };

  const updateExpenseField = async (id, field, value) => {
    const row = expenses.find(e => e.id === id);
    await updateExpense(id, { ...row, [field]: value });
    load();
  };

  const removeExpense = async (id) => {
    await deleteExpense(id);
    load();
  };

  const totalBudget = expenses.reduce((s, e) => s + Number(e.budget || 0), 0);
  const totalActual = expenses.reduce((s, e) => s + Number(e.actual || 0), 0);

  return {
    expenses,
    addExpense,
    updateExpense: updateExpenseField,
    deleteExpense: removeExpense,
    totalBudget,
    totalActual,
  };
}
