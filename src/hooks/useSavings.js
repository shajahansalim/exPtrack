import { useEffect, useState } from "react";
import {
    fetchSavings,
    createSaving,
    updateSaving,
    deleteSaving,
} from "../api/savings";

export function useSavings(monthKey) {
    const [savings, setSavings] = useState([]);

    const load = async () => {
        setSavings(await fetchSavings(monthKey));
    };

    useEffect(() => {
        load();
    }, [monthKey]);

    const addSaving = async (data) => {
        await createSaving({ ...data, month: monthKey });
        load();
    };

    const updateSavingField = async (id, field, value) => {
        const row = savings.find(s => s.id === id);
        await updateSaving(id, { ...row, [field]: value });
        load();
    };

    const removeSaving = async (id) => {
        await deleteSaving(id);
        load();
    };

    const totalSaved = savings.reduce((s, i) => s + Number(i.saved || 0), 0);

    return {
        savings,
        addSaving,
        updateSaving: updateSavingField,
        deleteSaving: removeSaving,
        totalSaved,
    };
}
