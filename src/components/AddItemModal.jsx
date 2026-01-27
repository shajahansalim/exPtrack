import { useState } from "react";
export default function AddItemModal({
    title,
    onClose,
    onSave,
}) {
    const [name, setName] = useState("");
    const [budget, setBudget] = useState("");
    const [actual, setActual] = useState("");

    const handleSave = () => {
        if (typeof onSave !== "function") {
            console.error("onSave is not a function", onSave);
            return;
        }

        if (!name.trim()) return;

        onSave({
            id: Math.random().toString(36).slice(2),
            name,
            budget: Number(budget || 0),
            actual: Number(actual || 0),
        });

        onClose();
    };


    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
                <h2 className="text-lg font-semibold mb-4">
                    {title}
                </h2>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-slate-600">
                            Name
                        </label>
                        <input
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                            placeholder="e.g. Rent, Groceries"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-slate-600">
                            Budget
                        </label>
                        <input
                            type="number"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm text-slate-600">
                            Actual
                        </label>
                        <input
                            type="number"
                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
                            value={actual}
                            onChange={(e) => setActual(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-4 py-2 text-sm bg-slate-900 text-white rounded-md hover:bg-slate-800"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
