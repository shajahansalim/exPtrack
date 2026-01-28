import { useState } from "react";

export default function SavingsModal({ onClose, onSave }) {
    const [name, setName] = useState("");
    const [goal, setGoal] = useState("");
    const [saved, setSaved] = useState("");

    const canSave =
        name.trim() &&
        Number(goal) > 0 &&
        Number(saved) >= 0;

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
                    <h2 className="text-lg font-semibold">Add savings goal</h2>
                    <p className="text-sm text-gray-500">
                        Track money you’re setting aside for the future
                    </p>
                </div>

                {/* Goal name */}
                <div>
                    <label className="text-sm font-medium">Goal name</label>
                    <input
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Emergency fund, Vacation…"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {/* Target */}
                <div>
                    <label className="text-sm font-medium">Target amount</label>
                    <input
                        type="number"
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="₹2,00,000"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                    />
                </div>

                {/* Monthly contribution */}
                <div>
                    <label className="text-sm font-medium">
                        Amount added this month
                    </label>
                    <input
                        type="number"
                        className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="₹10,000"
                        value={saved}
                        onChange={(e) => setSaved(e.target.value)}
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
                        onClick={() =>
                            onSave({
                                name,
                                goal,
                                saved,
                            })
                        }
                        className={`rounded-md px-4 py-2 text-sm font-medium text-white ${canSave
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-blue-300 cursor-not-allowed"
                            }`}
                    >
                        Save goal
                    </button>
                </div>
            </div>
        </div>
    );
}
