import { formatINR, toNumber } from "../utils/money";

export default function WantsCard({
  wants,
  onUpdate,
  onAdd,
  onDelete,
  totalActual,
}) {
  return (
    <section className="bg-gray-100 rounded-3xl p-6 h-full
    shadow-[-10px_-10px_20px_#ffffff,10px_10px_20px_#d1d5db]">
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Wants</h2>
          <p className="text-sm text-gray-500">
            Optional & lifestyle spending
          </p>
        </div>

        <button
          onClick={onAdd}
          className="px-3 py-1.5 rounded-lg text-sm border hover:bg-gray-50"
        >
          + Add expense
        </button>
      </div>

      <div className="space-y-2">
        {wants.map((row) => {
          const diff =
            toNumber(row.budget) - toNumber(row.actual);

          return (
            <div
              key={row.id}
              className="group flex items-center justify-between gap-3 px-2 py-2 rounded-lg hover:bg-gray-50"
            >
              <input
                value={row.name}
                onChange={(e) =>
                  onUpdate(row.id, "name", e.target.value)
                }
                placeholder="Expense"
                className="w-1/3 text-sm px-2 py-1 rounded-md
                           border border-transparent
                           hover:border-gray-300
                           focus:border-gray-400 focus:outline-none"
              />

              <input
                type="number"
                value={row.actual}
                onChange={(e) =>
                  onUpdate(row.id, "actual", e.target.value)
                }
                className="w-20 text-right text-sm px-2 py-1 rounded-md
                           border border-transparent
                           hover:border-gray-300
                           focus:border-gray-400 focus:outline-none"
              />

              <span
                className={`text-xs ${
                  diff < 0
                    ? "text-red-600"
                    : "text-gray-400"
                }`}
              >
                {formatINR(diff)}
              </span>

              <button
                onClick={() => onDelete(row.id)}
                className="opacity-0 group-hover:opacity-100
                           text-gray-400 hover:text-red-600 transition"
              >
                −
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t text-sm flex justify-between">
        <span className="text-gray-500">Total</span>
        <span className="font-medium">
          {formatINR(totalActual)}
        </span>
      </div>
    </section>
  );
}
