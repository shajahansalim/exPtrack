import { useEffect, useState } from "react";

export default function WantsModal({ mode, initialData, onClose, onSave }) {
    const [name, setName] = useState("");
    const [budget, setBudget] = useState("");
    const [actual, setActual] = useState("");

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setBudget(initialData.budget);
            setActual(initialData.actual);
        }
    }, [initialData]);

    const canSave =
        name.trim() &&
        Number(budget) >= 0 &&
        Number(actual) >= 0;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            <div
                className="w-full max-w-md rounded-xl bg-white p-6 space-y-5"
                onClick={(e) => e.stopPropagation()}
            >
                <div>
                    <h2 className="text-lg font-semibold">
                        {mode === "edit" ? "Edit want" : "Add want"}
                    </h2>
                    <p className="text-sm text-gray-500">
                        Optional & lifestyle spending
                    </p>
                </div>

                <div>
                    <label className="text-sm font-medium">Expense name</label>
                    <input
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="Dining, Shopping, Netflix"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Budgeted amount</label>
                    <input
                        type="number"
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="₹5,000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                    />
                </div>

                <div>
                    <label className="text-sm font-medium">Actual spent</label>
                    <input
                        type="number"
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
                        placeholder="₹3,500"
                        value={actual}
                        onChange={(e) => setActual(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        This reduces your available balance
                    </p>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button onClick={onClose} className="border px-4 py-2 rounded-md text-sm">
                        Cancel
                    </button>
                    <button
                        disabled={!canSave}
                        onClick={() => onSave({ name, budget, actual })}
                        className={`px-4 py-2 rounded-md text-sm text-white ${canSave ? "bg-blue-600" : "bg-blue-300"
                            }`}
                    >
                        {mode === "edit" ? "Update" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}
