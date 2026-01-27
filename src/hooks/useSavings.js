import { useEffect, useState } from "react";
import { toNumber } from "../utils/money";

const STORAGE_KEY = "savings_v1";

const DEFAULT_SAVINGS = [
    { id: 1, name: "Emergency Fund", goal: 100000, saved: 0 },
];

export function useSavings() {
    const [savings, setSavings] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : DEFAULT_SAVINGS;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savings));
    }, [savings]);

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
                    ? {
                        ...s,
                        [field]: field === "name" ? value : toNumber(value),
                    }
                    : s
            )
        );
    };

    const deleteSaving = (id) => {
        setSavings((prev) => prev.filter((s) => s.id !== id));
    };

    const totalSaved = savings.reduce(
        (s, r) => s + toNumber(r.saved),
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
