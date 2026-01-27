import { formatINR, toNumber } from "../utils/money";

export default function IncomeCard({
  income,
  onUpdate,
  onAdd,
  totalExpected,
  totalActual,
}) {
  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Income
          </h2>
          <p className="text-sm text-gray-500">
            Expected vs actual income
          </p>
        </div>

        <button
          onClick={onAdd}
          className="px-4 py-2 rounded-xl text-sm font-medium
                     bg-gray-900 text-white hover:bg-gray-800 transition"
        >
          + Add income
        </button>
      </div>

      {/* Rows */}
      <div className="space-y-3">
        {income.map((row) => {
          const diff =
            toNumber(row.actual) - toNumber(row.expected);

          return (
            <div
              key={row.id}
              className="grid grid-cols-12 gap-4 items-center
                         rounded-xl px-4 py-3
                         hover:bg-gray-50 transition"
            >
              {/* Name */}
              <input
                value={row.name}
                onChange={(e) =>
                  onUpdate(row.id, "name", e.target.value)
                }
                placeholder="Income source"
                className="col-span-5 bg-transparent
                           text-sm text-gray-900
                           focus:outline-none"
              />

              {/* Expected */}
              <input
                type="number"
                value={row.expected}
                onChange={(e) =>
                  onUpdate(row.id, "expected", e.target.value)
                }
                className="col-span-2 text-right text-sm
                           bg-transparent focus:outline-none"
              />

              {/* Actual */}
              <input
                type="number"
                value={row.actual}
                onChange={(e) =>
                  onUpdate(row.id, "actual", e.target.value)
                }
                className="col-span-2 text-right text-sm
                           bg-transparent focus:outline-none"
              />

              {/* Diff */}
              <div
                className={`col-span-3 text-right font-medium ${
                  diff >= 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {formatINR(diff)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer totals */}
      <div className="mt-6 pt-4 border-t flex justify-between text-sm">
        <span className="text-gray-500">Total</span>
        <div className="flex gap-8 font-medium">
          <span>{formatINR(totalExpected)}</span>
          <span>{formatINR(totalActual)}</span>
          <span
            className={
              totalActual - totalExpected >= 0
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {formatINR(totalActual - totalExpected)}
          </span>
        </div>
      </div>
    </section>
  );
}
