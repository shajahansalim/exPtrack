export default function MonthCopyModal({ open, onYes, onNo }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl p-8 w-96 shadow-xl text-center">

                <h3 className="text-lg font-semibold mb-4">
                    Copy previous month data?
                </h3>

                <p className="text-sm text-gray-500 mb-6">
                    Do you want to copy income, expenses, savings and debt
                    from last month?
                </p>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={onNo}
                        className="px-4 py-2 rounded-lg border"
                    >
                        No
                    </button>

                    <button
                        onClick={onYes}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                    >
                        Yes, copy
                    </button>
                </div>
            </div>
        </div>
    );
}
