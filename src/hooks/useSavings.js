import { useState, useEffect } from "react";
import { toNumber } from "../utils/money";

export function useSavings(monthKey) {
    const STORAGE_KEY = `saving_${monthKey}`;

    const [savings, setSavings] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savings));
    }, [savings, STORAGE_KEY]);

    const addSaving = (item) =>
        setSavings((p) => [
            ...p,
            {
                id: crypto.randomUUID(),
                name: item.name,
                goal: toNumber(item.goal),
                saved: toNumber(item.saved),
            },
        ]);

    const updateSaving = (id, field, value) =>
        setSavings((p) =>
            p.map((s) =>
                s.id === id
                    ? { ...s, [field]: field === "name" ? value : toNumber(value) }
                    : s
            )
        );

    const deleteSaving = (id) =>
        setSavings((p) => p.filter((s) => s.id !== id));

    return {
        savings,
        addSaving,
        updateSaving,
        deleteSaving,
        totalSaved: savings.reduce((s, x) => s + toNumber(x.saved), 0),
    };
}
