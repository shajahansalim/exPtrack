import { useEffect, useState } from "react";

export default function DebtModal({ mode, initialData, onClose, onSave }) {
    const [name, setName] = useState("");
    const [balance, setBalance] = useState("");
    const [paid, setPaid] = useState("");

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setBalance(initialData.balance);
            setPaid(initialData.paid);
        }
    }, [initialData]);

    const canSave =
        name.trim() &&
        Number(balance) > 0 &&
        Number(paid) >= 0 &&
        Number(paid) <= Number(balance);

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
                    <h2 className="text-lg font-semibold">Add debt</h2>
                    <p className="text-sm text-gray-500">
                        Track loans and outstanding liabilities
                    </p>
                </div>

                {/* Debt name */}
                <div>
                    <label className="text-sm font-medium">Debt name</label>
                    <input
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Car loan, Credit card…"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Total balance */}
                <div>
                    <label className="text-sm font-medium">Total loan amount</label>
                    <input
                        type="number"
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="₹3,00,000"
                        value={balance}
                        onChange={(e) => setBalance(e.target.value)}
                    />
                </div>

                {/* Monthly payment */}
                <div>
                    <label className="text-sm font-medium">
                        Amount paid this month
                    </label>
                    <input
                        type="number"
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="₹15,000"
                        value={paid}
                        onChange={(e) => setPaid(e.target.value)}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                        This reduces your available balance
                    </p>
                </div>

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
                        onClick={() => onSave({ name, balance, paid })}
                        className={`rounded-md px-4 py-2 text-sm font-medium text-white ${canSave
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-blue-300 cursor-not-allowed"
                            }`}
                    >
                        {mode === "edit" ? "Update debt" : "Save debt"}
                    </button>
                </div>
            </div>
        </div>
    );
}
