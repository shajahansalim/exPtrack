import { useState } from "react";
import DebtModal from "./DebtModal";
import { formatINR } from "../utils/money";

export default function DebtCard({
    debt = [],
    addDebt,
    updateDebt,
    deleteDebt,
    totalBalance,
    totalPaid,
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
            updateDebt(editingItem.id, "name", data.name);
            updateDebt(editingItem.id, "balance", data.balance);
            updateDebt(editingItem.id, "paid", data.paid);
            updateDebt(editingItem.id, "remaining", data.remaining);
        } else {
            addDebt(data);
        }
        setShowModal(false);
        setEditingItem(null);
    };


    return (
        <section className="bg-white border border-gray-200 rounded-xl p-6">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="font-semibold">Debt</h2>
                    <p className="text-sm text-slate-500 mt-1">
                        Outstanding liabilities
                    </p>
                </div>

                <button
                    onClick={openAdd}
                    className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50"
                >
                    + Add debt
                </button>
            </div>

            {/* Table */}
            {debt.length > 0 && (
                <div className="mt-6">
                    <div className="grid grid-cols-6 text-xs font-medium text-slate-500 mb-2">
                        <span>Name</span>
                        <span className="text-right">Total</span>
                        <span className="text-right">Paid</span>
                        <span className="text-right">Remaining</span>
                        <span className="text-right">Edit</span>
                        <span className="text-right">Remove</span>
                    </div>

                    {debt.map((item) => {
                        const remaining = item.balance - item.paid;

                        return (
                            <div
                                key={item.id}
                                className="grid grid-cols-6 items-center py-3 border-b border-gray-100"
                            >
                                <span className="text-sm">{item.name}</span>

                                <span className="text-sm text-right">
                                    {formatINR(item.balance)}
                                </span>

                                <span className="text-sm text-right">
                                    {formatINR(item.paid)}
                                </span>

                                <span className="text-sm text-right font-medium text-red-600">
                                    {formatINR(remaining)}
                                </span>

                                <button
                                    onClick={() => openEdit(item)}
                                    className="text-sm text-blue-600 text-right hover:underline"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => deleteDebt(item.id)}
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
            {debt.length === 0 && (
                <p className="mt-6 text-sm text-slate-500">
                    Track outstanding loans and credit balances in one place.
                    <br />
                    Monitoring debt helps you plan repayments and reduce interest costs.
                </p>
            )}

            {/* Footer */}
            {debt.length > 0 && (
                <div className="mt-6 pt-4 border-t flex justify-between text-sm">
                    <span className="text-slate-500">Total</span>
                    <span className="font-medium text-red-600">
                        {formatINR(totalBalance - totalPaid)}
                    </span>
                </div>
            )}

            {/* Modal */}


            {showModal && (
                <DebtModal
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
