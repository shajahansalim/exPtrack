import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

export function useDebt(monthKey) {
    const [debt, setDebt] = useState([]);

    // ================= LOAD =================
    useEffect(() => {
        fetch(`${API}/debt/${monthKey}`)
            .then(res => res.json())
            .then(setDebt);
    }, [monthKey]);

    // ================= ADD =================
    const addDebt = async (data) => {
        const res = await fetch(`${API}/debt/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...data,
                month: monthKey,
                balance: Number(data.balance),
                paid: Number(data.paid),
            }),
        });

        const newRow = await res.json();
        setDebt(prev => [...prev, newRow]);
    };

    // ================= UPDATE =================
    const updateDebt = async (id, field, value) => {
        const row = debt.find(d => d.id === id);

        const updated = {
            ...row,
            [field]: value,
            month: monthKey,
        };

        await fetch(`${API}/debt/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
        });

        setDebt(prev =>
            prev.map(d => (d.id === id ? updated : d))
        );
    };

    // ================= DELETE =================
    const deleteDebt = async (id) => {
        await fetch(`${API}/debt/${id}`, {
            method: "DELETE",
        });

        setDebt(prev => prev.filter(d => d.id !== id));
    };

    const totalBalance = debt.reduce(
        (s, d) => s + Number(d.balance || 0),
        0
    );

    const totalPaid = debt.reduce(
        (s, d) => s + Number(d.paid || 0),
        0
    );

    return {
        debt,
        addDebt,
        updateDebt,
        deleteDebt,
        totalBalance,
        totalPaid,
    };
}
