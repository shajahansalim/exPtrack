import { useState } from "react";
import AddItemModal from "./AddItemModal";
import { formatINR } from "../utils/money";

export default function DebtCard({
    debt,
    addDebt,
    deleteDebt,
    totalBalance,
    totalPaid,
}) {
    const [showModal, setShowModal] = useState(false);

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
                    onClick={() => setShowModal(true)}
                    className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50"
                >
                    + Add debt
                </button>
            </div>

            {/* Table */}
            {debt.length > 0 && (
                <div className="mt-6">
                    <div className="grid grid-cols-5 text-xs font-medium text-slate-500 mb-2">
                        <span>Name</span>
                        <span className="text-right">Total</span>
                        <span className="text-right">Paid</span>
                        <span className="text-right">Remaining</span>
                        <span className="text-right">Action</span>
                    </div>

                    {debt.map((item) => {
                        const remaining = item.balance - item.paid;

                        return (
                            <div
                                key={item.id}
                                className="grid grid-cols-5 items-center py-3 border-b border-gray-100 bg-red-50"
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
                    No debts added yet. Add loans or credit balances to track repayments.
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
                <AddItemModal
                    title="Add debt"
                    onClose={() => setShowModal(false)}
                    onSave={(data) => {
                        addDebt({
                            name: data.name,
                            balance: data.budget,
                            paid: data.actual,
                        });
                        setShowModal(false);
                    }}
                />
            )}
        </section>
    );
}
