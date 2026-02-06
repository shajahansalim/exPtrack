import { apiFetch } from "./client";

// ================= GET =================
export const fetchExpenses = (month, type) =>
    apiFetch(`/expenses/${month}/${type}`);

// ================= CREATE =================
export const createExpense = (data) =>
    apiFetch("/expenses/", {
        method: "POST",
        body: JSON.stringify(data),
    });

// ================= UPDATE =================
export const updateExpense = (id, data) =>
    apiFetch(`/expenses/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

// ================= DELETE =================
export const deleteExpense = (id) =>
    apiFetch(`/expenses/${id}`, {
        method: "DELETE",
    });
