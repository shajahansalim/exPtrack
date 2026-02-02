import { apiFetch } from "./client";

// ================= GET =================
export const fetchIncome = (month) =>
    apiFetch(`/income/${month}`);

// ================= CREATE =================
export const createIncome = (data) =>
    apiFetch("/income/", {
        method: "POST",
        body: JSON.stringify(data),
    });

// ================= UPDATE =================
export const updateIncome = (id, data) =>
    apiFetch(`/income/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

// ================= DELETE =================
export const deleteIncome = (id) =>
    apiFetch(`/income/${id}`, {
        method: "DELETE",
    });
