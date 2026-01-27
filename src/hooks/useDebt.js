import { useEffect, useState } from "react";
import { toNumber } from "../utils/money";

const STORAGE_KEY = "debt_v1";

const DEFAULT_DEBT = [
    { id: 1, name: "Gold Loan", balance: 230000, paid: 0 },
    { id: 2, name: "Personal Loan", balance: 31331, paid: 5501 },
];

export function useDebt() {
    const [debt, setDebt] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        return saved ? JSON.parse(saved) : DEFAULT_DEBT;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(debt));
    }, [debt]);

    const addDebt = (item) => {
        setDebt((prev) => [
            ...prev,
            {
                id: crypto.randomUUID(),
                name: item.name,
                balance: toNumber(item.balance),
                paid: toNumber(item.paid),
            },
        ]);
    };

    const updateDebt = (id, field, value) => {
        setDebt((prev) =>
            prev.map((d) =>
                d.id === id
                    ? {
                        ...d,
                        [field]: field === "name" ? value : toNumber(value),
                    }
                    : d
            )
        );
    };

    const deleteDebt = (id) => {
        setDebt((prev) => prev.filter((d) => d.id !== id));
    };

    const totalBalance = debt.reduce(
        (s, d) => s + toNumber(d.balance),
        0
    );

    const totalPaid = debt.reduce(
        (s, d) => s + toNumber(d.paid),
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
