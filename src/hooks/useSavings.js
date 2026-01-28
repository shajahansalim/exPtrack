import { useEffect, useRef, useState } from "react";
import { toNumber } from "../utils/money";

export function useSavings(monthKey) {
    const STORAGE_KEY = `saving_${monthKey}`;
    const hydrated = useRef(false);
    const [savings, setSavings] = useState([]);

    useEffect(() => {
        hydrated.current = false;

        const current = localStorage.getItem(STORAGE_KEY);
        if (current && JSON.parse(current).length > 0) {
            setSavings(JSON.parse(current));
            hydrated.current = true;
            return;
        }

        const [year, month] = monthKey.split("-").map(Number);
        const prevMonth =
            month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, "0")}`;

        const prev = localStorage.getItem(`saving_${prevMonth}`);
        if (prev && JSON.parse(prev).length > 0) {
            setSavings(JSON.parse(prev).map(s => ({ ...s, id: crypto.randomUUID() })));
        } else {
            setSavings([]);
        }

        hydrated.current = true;
    }, [monthKey]);

    useEffect(() => {
        if (!hydrated.current) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savings));
    }, [savings, STORAGE_KEY]);

    const addSaving = (item) =>
        setSavings(prev => [
            ...prev,
            { id: crypto.randomUUID(), name: item.name, goal: toNumber(item.goal), saved: toNumber(item.saved) },
        ]);

    const updateSaving = (id, field, value) =>
        setSavings(prev =>
            prev.map(s => s.id === id ? { ...s, [field]: field === "name" ? value : toNumber(value) } : s)
        );

    const deleteSaving = (id) =>
        setSavings(prev => prev.filter(s => s.id !== id));

    const totalSaved = savings.reduce((s, x) => s + toNumber(x.saved), 0);

    return { savings, addSaving, updateSaving, deleteSaving, totalSaved };
}
