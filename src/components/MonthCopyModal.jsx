import { useState, useEffect } from "react";

export default function MonthCopyModal({ 
    open, 
    onConfirm, 
    onCancel,
    fromMonth,
    toMonth,
    hasIncome = false,
    hasNeeds = false,
    hasWants = false,
    hasSavings = false,
    hasDebt = false
}) {
    const [selectedCategories, setSelectedCategories] = useState({
        income: true,
        expenses: true,
        savings: true,
        debt: true,
    });

    // Reset selections when modal opens (only on open change, not on prop changes)
    useEffect(() => {
        if (open) {
            setSelectedCategories({
                income: hasIncome,
                expenses: hasNeeds || hasWants,
                savings: hasSavings,
                debt: hasDebt,
            });
        }
    }, [open]); // Only reset when modal opens/closes, not when props change

    if (!open) return null;

    const handleToggle = (category) => {
        setSelectedCategories((prev) => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const handleSelectAll = () => {
        const allSelected = Object.values(selectedCategories).every(Boolean);
        setSelectedCategories({
            income: !allSelected && hasIncome,
            expenses: !allSelected && (hasNeeds || hasWants),
            savings: !allSelected && hasSavings,
            debt: !allSelected && hasDebt,
        });
    };

    const getSelectedList = () => {
        const list = [];
        // Only include categories that are explicitly selected (true)
        if (selectedCategories.income === true) list.push("income");
        if (selectedCategories.expenses === true) list.push("expenses");
        if (selectedCategories.savings === true) list.push("savings");
        if (selectedCategories.debt === true) list.push("debt");
        return list;
    };

    const hasAnySelected = Object.values(selectedCategories).some(Boolean);

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-xl">
                <h3 className="text-lg font-semibold mb-2">
                    Copy previous month data?
                </h3>

                <p className="text-sm text-gray-500 mb-6">
                    Select which categories to copy from <strong>{fromMonth}</strong> to <strong>{toMonth}</strong>
                </p>

                {/* Category Selection */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between pb-2 border-b">
                        <span className="text-sm font-medium text-gray-700">Categories</span>
                        <button
                            onClick={handleSelectAll}
                            className="text-xs text-blue-600 hover:underline"
                        >
                            {Object.values(selectedCategories).every(Boolean) ? "Deselect All" : "Select All"}
                        </button>
                    </div>

                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedCategories.income}
                            onChange={() => handleToggle("income")}
                            disabled={!hasIncome}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                        />
                        <div className="flex-1">
                            <span className={`text-sm font-medium ${!hasIncome ? "text-gray-400" : ""}`}>
                                Income
                            </span>
                            {!hasIncome && (
                                <span className="text-xs text-gray-400 ml-2">(No data)</span>
                            )}
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedCategories.expenses}
                            onChange={() => handleToggle("expenses")}
                            disabled={!hasNeeds && !hasWants}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                        />
                        <div className="flex-1">
                            <span className={`text-sm font-medium ${!hasNeeds && !hasWants ? "text-gray-400" : ""}`}>
                                Expenses (Needs & Wants)
                            </span>
                            {!hasNeeds && !hasWants && (
                                <span className="text-xs text-gray-400 ml-2">(No data)</span>
                            )}
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedCategories.savings}
                            onChange={() => handleToggle("savings")}
                            disabled={!hasSavings}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                        />
                        <div className="flex-1">
                            <span className={`text-sm font-medium ${!hasSavings ? "text-gray-400" : ""}`}>
                                Savings
                            </span>
                            {!hasSavings && (
                                <span className="text-xs text-gray-400 ml-2">(No data)</span>
                            )}
                        </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={selectedCategories.debt}
                            onChange={() => handleToggle("debt")}
                            disabled={!hasDebt}
                            className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50"
                        />
                        <div className="flex-1">
                            <span className={`text-sm font-medium ${!hasDebt ? "text-gray-400" : ""}`}>
                                Debt
                            </span>
                            {!hasDebt && (
                                <span className="text-xs text-gray-400 ml-2">(No data)</span>
                            )}
                        </div>
                    </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-medium"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                            const selected = getSelectedList();
                            console.log("Button clicked - Selected categories:", selected);
                            console.log("Current selectedCategories state:", selectedCategories);
                            if (selected.length === 0) {
                                console.warn("No categories selected!");
                                return;
                            }
                            onConfirm(selected);
                        }}
                        disabled={!hasAnySelected}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm font-medium"
                    >
                        Copy Selected ({getSelectedList().length})
                    </button>
                </div>
            </div>
        </div>
    );
}
