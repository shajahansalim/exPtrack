import { apiFetch } from "./client";

// ================= GET =================
export const fetchSavings = (month) =>
    apiFetch(`/savings/${month}`);

// ================= CREATE =================
export const createSaving = (data) =>
    apiFetch("/savings/", {
        method: "POST",
        body: JSON.stringify(data),
    });

// ================= UPDATE =================
export const updateSaving = (id, data) =>
    apiFetch(`/savings/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

// ================= DELETE =================
export const deleteSaving = (id) =>
    apiFetch(`/savings/${id}`, {
        method: "DELETE",
    });
