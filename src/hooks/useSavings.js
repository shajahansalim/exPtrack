import { useEffect, useRef, useState } from "react";
import { toNumber } from "../utils/money";

export function useSavings(monthKey) {
    const STORAGE_KEY = `saving_${monthKey}`;
    const hydrated = useRef(false);
    const [savings, setSavings] = useState([]);

    useEffect(() => {
        hydrated.current = false;
        const saved = localStorage.getItem(STORAGE_KEY);
        setSavings(saved ? JSON.parse(saved) : []);
        hydrated.current = true;
    }, [STORAGE_KEY]);

    useEffect(() => {
        if (!hydrated.current) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savings));
    }, [savings, STORAGE_KEY]);

    const addSaving = (item) => {
        setSavings((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name: item.name,
                goal: toNumber(item.goal),
                saved: toNumber(item.saved),
            },
        ]);
    };

    const updateSaving = (id, field, value) => {
        setSavings((prev) =>
            prev.map((s) =>
                s.id === id
                    ? { ...s, [field]: field === "name" ? value : toNumber(value) }
                    : s
            )
        );
    };

    const deleteSaving = (id) => {
        setSavings((prev) => prev.filter((s) => s.id !== id));
    };

    const totalSaved = savings.reduce((sum, s) => sum + toNumber(s.saved), 0);

    return {
        savings,
        addSaving,
        updateSaving,
        deleteSaving,
        totalSaved,
    };
}
