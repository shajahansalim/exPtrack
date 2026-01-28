import { useEffect, useRef, useState } from "react";
import { toNumber } from "../utils/money";

export function useDebt(monthKey) {
    const STORAGE_KEY = `debt_${monthKey}`;
    const hydrated = useRef(false);
    const [debt, setDebt] = useState([]);

    useEffect(() => {
        hydrated.current = false;

        const current = localStorage.getItem(STORAGE_KEY);
        if (current && JSON.parse(current).length > 0) {
            setDebt(JSON.parse(current));
            hydrated.current = true;
            return;
        }

        const [year, month] = monthKey.split("-").map(Number);
        const prevMonth =
            month === 1 ? `${year - 1}-12` : `${year}-${String(month - 1).padStart(2, "0")}`;

        const prev = localStorage.getItem(`debt_${prevMonth}`);
        if (prev && JSON.parse(prev).length > 0) {
            setDebt(JSON.parse(prev).map(d => ({ ...d, id: crypto.randomUUID() })));
        } else {
            setDebt([]);
        }

        hydrated.current = true;
    }, [monthKey]);

    useEffect(() => {
        if (!hydrated.current) return;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(debt));
    }, [debt, STORAGE_KEY]);

    const addDebt = (item) =>
        setDebt(prev => [
            ...prev,
            { id: crypto.randomUUID(), name: item.name, balance: toNumber(item.balance), paid: toNumber(item.paid) },
        ]);

    const updateDebt = (id, field, value) =>
        setDebt(prev =>
            prev.map(d => d.id === id ? { ...d, [field]: field === "name" ? value : toNumber(value) } : d)
        );

    const deleteDebt = (id) =>
        setDebt(prev => prev.filter(d => d.id !== id));

    const totalBalance = debt.reduce((s, d) => s + toNumber(d.balance), 0);
    const totalPaid = debt.reduce((s, d) => s + toNumber(d.paid), 0);

    return { debt, addDebt, updateDebt, deleteDebt, totalBalance, totalPaid };
}
