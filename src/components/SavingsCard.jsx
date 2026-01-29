import { useState } from "react";
import SavingsModal from "./SavingsModal";
import { formatINR } from "../utils/money";

export default function SavingsCard({
    savings = [],
    addSaving,
    updateSaving,
    deleteSaving,
    totalSaved,
}) {
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    const openAdd = () => {
        setEditingItem(null);
        setShowModal(true);
    };

    const openEdit = (item) => {
        setEditingItem(item);
        setShowModal(true);
    };

    const handleSave = (data) => {
        if (editingItem) {
            updateSaving(editingItem.id, "name", data.name);
            updateSaving(editingItem.id, "goal", data.goal);
            updateSaving(editingItem.id, "saved", data.saved);
        } else {
            addSaving(data);
        }
        setShowModal(false);
        setEditingItem(null);
    };

    const totalGoal = savings.reduce(
        (sum, s) => sum + Number(s.goal || 0),
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
                    onClick={openAdd}
                    className="text-sm font-medium px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                    + Add saving
                </button>
            </div>

            {/* Table */}
            {savings.length > 0 && (
                <div className="mt-6">
                    <div className="grid grid-cols-6 text-xs font-medium text-slate-500 mb-2">
                        <span>Name</span>
                        <span className="text-right">Goal</span>
                        <span className="text-right">Saved</span>
                        <span className="text-right">Remaining</span>
                        <span className="text-right">Edit</span>
                        <span className="text-right">Remove</span>
                    </div>

                    {savings.map((item) => {
                        const remaining = item.goal - item.saved;
                        const isBehind = remaining > 0;

                        return (
                            <div
                                key={item.id}
                                className="grid grid-cols-6 items-center py-3 border-b border-gray-100"
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
                                    {formatINR(remaining)}
                                </span>

                                <button
                                    onClick={() => openEdit(item)}
                                    className="text-sm text-blue-600 text-right hover:underline"
                                >
                                    Edit
                                </button>

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
                <SavingsModal
                    mode={editingItem ? "edit" : "add"}
                    initialData={editingItem}
                    onClose={() => {
                        setShowModal(false);
                        setEditingItem(null);
                    }}
                    onSave={handleSave}
                />
            )}
        </section>
    );
}
