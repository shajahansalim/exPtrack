import { apiFetch } from "./client";

export const fetchDebt = (month) =>
    apiFetch(`/debt/${month}`);

export const createDebt = (data) =>
    apiFetch("/debt/", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const updateDebt = (id, data) =>
    apiFetch(`/debt/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
    });

export const deleteDebt = (id) =>
    apiFetch(`/debt/${id}`, { method: "DELETE" });