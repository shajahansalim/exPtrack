import { useEffect, useState } from "react";
import { fetchDebt, createDebt, updateDebt, deleteDebt } from "../api/debt";

export function useDebt(monthKey) {
    const [debt, setDebt] = useState([]);

    const load = async () => {
        setDebt(await fetchDebt(monthKey));
    };

    useEffect(() => {
        load();
    }, [monthKey]);

    const addDebt = async (data) => {
        await createDebt({ ...data, month: monthKey });
        load();
    };

    const updateDebtField = async (id, field, value) => {
        const row = debt.find(d => d.id === id);
        await updateDebt(id, { ...row, [field]: value });
        load();
    };

    const removeDebt = async (id) => {
        await deleteDebt(id);
        load();
    };


    const totalPaid = debt.reduce(
        (s, d) => s + Number(d.paid || 0),
        0
    );

    const totalOutstanding = debt.reduce(
        (s, d) => s + Number(d.balance || 0),
        0
    );

    return {
        debt,
        addDebt,
        updateDebt: updateDebtField,
        deleteDebt: removeDebt,
        totalPaid,
        totalOutstanding,
    };
}
