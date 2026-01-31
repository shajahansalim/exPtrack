import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

export function useSavings(monthKey) {
    const [savings, setSavings] = useState([]);

    // ================= LOAD =================
    useEffect(() => {
        fetch(`${API}/savings/${monthKey}`)
            .then(res => res.json())
            .then(setSavings);
    }, [monthKey]);

    // ================= ADD =================
    const addSaving = async (data) => {
        const res = await fetch(`${API}/savings/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...data,
                month: monthKey,
                goal: Number(data.goal),
                saved: Number(data.saved),
            }),
        });

        const newRow = await res.json();
        setSavings(prev => [...prev, newRow]);
    };

    // ================= UPDATE =================
    const updateSaving = async (id, field, value) => {
        const row = savings.find(s => s.id === id);

        const updated = {
            ...row,
            [field]: value,
            month: monthKey,
        };

        await fetch(`${API}/savings/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updated),
        });

        setSavings(prev =>
            prev.map(s => (s.id === id ? updated : s))
        );
    };

    // ================= DELETE =================
    const deleteSaving = async (id) => {
        await fetch(`${API}/savings/${id}`, {
            method: "DELETE",
        });

        setSavings(prev => prev.filter(s => s.id !== id));
    };

    const totalSaved = savings.reduce(
        (s, i) => s + Number(i.saved || 0),
        0
    );

    return {
        savings,
        addSaving,
        updateSaving,
        deleteSaving,
        totalSaved,
    };
}
