import { useEffect, useState } from "react";
import {
  fetchExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../api/expenses";
import { toNumber } from "../utils/money";

export function useExpenses(monthKey, type) {
  const [expenses, setExpenses] = useState([]);

  // LOAD
  useEffect(() => {
    load();
  }, [monthKey]);

  const load = async () => {
    const data = await fetchExpenses(monthKey, type);
    setExpenses(data);
  };

  // CREATE
  const addExpense = async (item) => {
    await createExpense({
      month: monthKey,
      type,
      name: item.name,
      budget: toNumber(item.budget),
      actual: toNumber(item.actual),
    });
    load();
  };

  // UPDATE
  const updateExpenseField = async (id, field, value) => {
    const row = expenses.find((e) => e.id === id);

    await updateExpense(id, {
      ...row,
      [field]: field === "name" ? value : toNumber(value),
    });

    load();
  };

  // DELETE
  const removeExpense = async (id) => {
    await deleteExpense(id);
    load();
  };

  const totalBudget = expenses.reduce(
    (s, e) => s + toNumber(e.budget),
    0
  );

  const totalActual = expenses.reduce(
    (s, e) => s + toNumber(e.actual),
    0
  );

  return {
    expenses,
    addExpense,
    updateExpense: updateExpenseField,
    deleteExpense: removeExpense,
    totalBudget,
    totalActual,
  };
}
