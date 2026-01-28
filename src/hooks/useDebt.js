import { useState, useEffect } from "react";
import { toNumber } from "../utils/money";

export function useDebt(monthKey) {
    const STORAGE_KEY = `debt_${monthKey}`;

    const [debt, setDebt] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(debt));
    }, [debt, STORAGE_KEY]);

    const addDebt = (item) =>
        setDebt((p) => [
            ...p,
            {
                id: crypto.randomUUID(),
                name: item.name,
                balance: toNumber(item.balance),
                paid: toNumber(item.paid),
            },
        ]);

    const updateDebt = (id, field, value) =>
        setDebt((p) =>
            p.map((d) =>
                d.id === id
                    ? { ...d, [field]: field === "name" ? value : toNumber(value) }
                    : d
            )
        );

    const deleteDebt = (id) =>
        setDebt((p) => p.filter((d) => d.id !== id));

    return {
        debt,
        addDebt,
        updateDebt,
        deleteDebt,
        totalBalance: debt.reduce((s, d) => s + toNumber(d.balance), 0),
        totalPaid: debt.reduce((s, d) => s + toNumber(d.paid), 0),
    };
}
