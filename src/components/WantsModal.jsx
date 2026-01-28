import { useState } from "react";

export default function WantsModal({ onClose, onSave }) {
    const [name, setName] = useState("");
    const [budget, setBudget] = useState("");
    const [actual, setActual] = useState("");

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
                    <h2 className="text-lg font-semibold">Add discretionary spend</h2>
                    <p className="text-sm text-gray-500">
                        Optional or lifestyle spending
                    </p>
                </div>

                {/* Name */}
                <div>
                    <label className="text-sm font-medium">Category</label>
                    <input
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="Dining, Subscriptions, Travel"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Budget */}
                <div>
                    <label className="text-sm font-medium">Planned budget</label>
                    <input
                        type="number"
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="₹5,000"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                    />
                </div>

                {/* Actual */}
                <div>
                    <label className="text-sm font-medium">Spent this month</label>
                    <input
                        type="number"
                        className="mt-1 w-full rounded-md border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                        placeholder="₹4,200"
                        value={actual}
                        onChange={(e) => setActual(e.target.value)}
                    />
                    <p className="text-xs mt-1 text-gray-500">
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
                        onClick={() =>
                            onSave({ name, budget, actual })
                        }
                        className={`rounded-md px-4 py-2 text-sm font-medium text-white ${canSave
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-blue-300 cursor-not-allowed"
                            }`}
                    >
                        Save spending
                    </button>
                </div>
            </div>
        </div>
    );
}
