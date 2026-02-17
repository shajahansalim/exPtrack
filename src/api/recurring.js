import { apiFetch } from "./client";

// ================= RECURRING EXPENSES =================

export const createRecurringExpense = (data) =>
  apiFetch("/recurring/expenses", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const fetchRecurringExpenses = () =>
  apiFetch("/recurring/expenses");

export const deleteRecurringExpense = (id) =>
  apiFetch(`/recurring/expenses/${id}`, {
    method: "DELETE",
  });

export const applyRecurringExpenses = (month) =>
  apiFetch("/recurring/expenses/apply", {
    method: "POST",
    body: JSON.stringify({ month }),
  });

