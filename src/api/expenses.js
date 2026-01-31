const BASE = "http://127.0.0.1:8000";

export async function fetchExpenses(month, type) {
    const res = await fetch(`${BASE}/expenses/${month}/${type}`);
    return res.json();
}

export async function createExpense(data) {
    const res = await fetch(`${BASE}/expenses/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function updateExpense(id, data) {
    const res = await fetch(`${BASE}/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    });
    return res.json();
}

export async function deleteExpense(id) {
    await fetch(`${BASE}/expenses/${id}`, {
        method: "DELETE",
    });
}
