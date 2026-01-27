import { formatINR, toNumber } from "../utils/money";

export default function NeedsCard({
  needs,
  onUpdate,
  onAdd,
  onDelete,
  totalBudget,
  totalActual,
}) {
  return (
    <section className="bg-white rounded-2xl border p-6 h-full">
      <div className="flex justify-between mb-4">
        <div>
          <h2 className="text-lg font-semibold">Needs</h2>
          <p className="text-sm text-gray-500">
            Fixed & essential expenses
          </p>
        </div>

        <button
          onClick={onAdd}
          className="px-3 py-1.5 rounded-lg text-sm bg-gray-900 text-white"
        >
          + Add bill
        </button>
      </div>

      <div className="space-y-2">
        {needs.map((row) => {
          const diff =
            toNumber(row.budget) - toNumber(row.actual);

          return (
            <div
              key={row.id}
              className="group flex items-center justify-between gap-3 px-2 py-2 rounded-lg hover:bg-gray-50"
            >
              {/* Name */}
              <input
                value={row.name}
                onChange={(e) =>
                  onUpdate(row.id, "name", e.target.value)
                }
                placeholder="Bill name"
                className="w-1/3 text-sm px-2 py-1 rounded-md
                           border border-transparent
                           hover:border-gray-300
                           focus:border-gray-400 focus:outline-none"
              />

              {/* Numbers */}
              <input
                type="number"
                value={row.budget}
                onChange={(e) =>
                  onUpdate(row.id, "budget", e.target.value)
                }
                className="w-20 text-right text-sm px-2 py-1 rounded-md
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

              {/* Diff */}
              <span
                className={`text-xs px-2 py-1 rounded-md ${
                  diff < 0
                    ? "bg-red-50 text-red-700"
                    : "bg-green-50 text-green-700"
                }`}
              >
                {formatINR(diff)}
              </span>

              {/* Delete */}
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
          {formatINR(totalActual)} / {formatINR(totalBudget)}
        </span>
      </div>
    </section>
  );
}
