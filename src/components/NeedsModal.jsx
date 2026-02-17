import { useEffect, useState } from "react";

export default function NeedsModal({ mode, initialData, onClose, onSave }) {
    const [name, setName] = useState("");
    const [budget, setBudget] = useState("");
    const [actual, setActual] = useState("");
    const [recurring, setRecurring] = useState(false);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setBudget(initialData.budget);
            setActual(initialData.actual);
            setRecurring(false);
        }
    }, [initialData]);

    const canSave =
        name.trim() &&
        Number(budget) > 0 &&
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
                {/* Header */}
                <div>
                    <h2 className="text-lg font-semibold">
                        {mode === "edit" ? "Edit expense" : "Add essential expense"}
                    </h2>
                    <p className="text-sm text-gray-500">
                        Fixed or unavoidable monthly costs
                    </p>
                </div>

                {/* Name */}
                <div>
                    <label className="text-sm font-medium">Expense name</label>
                    <input
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500" placeholder="Rent, Groceries, EMI...."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Budget */}
                <div>
                    <label className="text-sm font-medium">Budgeted amount</label>
                    <input
                        type="number"
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="₹11,000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                    />
                </div>

                {/* Actual */}
                <div>
                    <label className="text-sm font-medium">Actual spent</label>
                    <input
                        type="number"
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="₹9,500"
                        value={actual}
                        onChange={(e) => setActual(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        This reduces your available balance
                    </p>
                </div>

                {/* Recurring toggle (add mode only) */}
                {mode !== "edit" && (
                    <div className="flex items-center gap-2">
                        <input
                            id="needs-recurring"
                            type="checkbox"
                            checked={recurring}
                            onChange={(e) => setRecurring(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300"
                        />
                        <label
                            htmlFor="needs-recurring"
                            className="text-xs text-gray-600"
                        >
                            Repeat this bill every month
                        </label>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-2">
                    <button
                        onClick={onClose}
                        className="rounded-md border px-4 py-2 text-sm hover:bg-gray-100"
                    >
                        Cancel
                    </button>

                    <button
                        disabled={!canSave}
                        onClick={() => onSave({ name, budget, actual, recurring })}
                        className={`rounded-md px-4 py-2 text-sm font-medium text-white ${canSave
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-blue-300 cursor-not-allowed"
                            }`}
                    >
                        {mode === "edit" ? "Update expense" : "Save expense"}
                    </button>
                </div>
            </div>
        </div>
    );
}
