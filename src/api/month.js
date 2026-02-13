import { apiFetch } from "./client";

export const copyMonth = async (from, to, categories = ["income", "expenses", "savings", "debt"]) => {
    return apiFetch("/month/copy", {
        method: "POST",
        body: JSON.stringify({ from, to, categories }),
    });
};