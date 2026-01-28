import { useState } from "react";
import AddItemModal from "./AddItemModal";
import { formatINR } from "../utils/money";

export default function SavingsCard({
    savings,
    addSaving,
    deleteSaving,
    totalSaved,
}) {
    const [showModal, setShowModal] = useState(false);

    const totalGoal = savings.reduce(
        (s, i) => s + Number(i.goal || 0),
        0
    );

    return (
        <section className="bg-white border border-gray-200 rounded-xl p-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="font-semibold">Savings</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Funds set aside for future goals
                    </p>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50"
                >
                    + Add saving
                </button>
            </div>

            {/* Table */}
            {savings.length > 0 && (
                <div className="mt-6">
                    <div className="grid grid-cols-5 text-xs font-medium text-slate-500 mb-2">
                        <span>Name</span>
                        <span className="text-right">Goal</span>
                        <span className="text-right">Saved</span>
                        <span className="text-right">Remaining</span>
                        <span className="text-right">Action</span>
                    </div>

                    {savings.map((item) => {
                        const diff = item.saved - item.goal;
                        const isBehind = diff < 0;

                        return (
                            <div
                                key={item.id}
                                className={`grid grid-cols-5 items-center py-3 border-b border-gray-100 ${isBehind ? "bg-red-1" : ""
                                    }`}
                            >
                                <span className="text-sm">{item.name}</span>

                                <span className="text-sm text-right">
                                    {formatINR(item.goal)}
                                </span>

                                <span className="text-sm text-right">
                                    {formatINR(item.saved)}
                                </span>

                                <span
                                    className={`text-sm text-right font-medium ${isBehind ? "text-red-600" : "text-green-600"
                                        }`}
                                >
                                    {formatINR(diff)}
                                </span>

                                <button
                                    onClick={() => deleteSaving(item.id)}
                                    className="text-sm text-red-600 text-right hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Empty state */}
            {savings.length === 0 && (
                <p className="mt-6 text-sm text-slate-500">
                    Build your financial safety net and plan for future goals.
                    <br />
                    Start with an emergency fund or a long-term savings goal.
                </p>
            )}

            {/* Footer */}
            {savings.length > 0 && (
                <div className="mt-6 pt-4 border-t flex justify-between text-sm">
                    <span className="text-slate-500">Total</span>
                    <span className="font-medium">
                        {formatINR(totalSaved)} / {formatINR(totalGoal)}
                    </span>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <AddItemModal
                    title="Add saving"
                    onClose={() => setShowModal(false)}
                    onSave={(data) => {
                        addSaving({
                            name: data.name,
                            goal: data.budget,
                            saved: data.actual,
                        });
                        setShowModal(false);
                    }}
                />
            )}
        </section>
    );
}
