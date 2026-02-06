import { apiFetch } from "./client";

export const copyMonth = async (from, to) => {
    return apiFetch("/month/copy", {
        method: "POST",
        body: JSON.stringify({ from, to }),
    });
};