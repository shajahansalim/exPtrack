import { formatINR, toNumber } from "../utils/money";

export default function WantsRow({
  wants,
  onUpdate,
  onAdd,
  totalActual,
}) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT */}
      <div className="lg:col-span-2 bg-white rounded-2xl border p-6">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Wants
            </h2>
            <p className="text-sm text-gray-500">
              Optional & lifestyle spending
            </p>
          </div>

          <button
            onClick={onAdd}
            className="px-4 py-2 rounded-xl text-sm border hover:bg-gray-50"
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
                className="flex justify-between items-center
                           px-3 py-2 rounded-xl hover:bg-gray-50"
              >
                <input
                  value={row.name}
                  onChange={(e) =>
                    onUpdate(row.id, "name", e.target.value)
                  }
                  className="w-1/3 bg-transparent text-sm"
                />

                <div className="flex gap-6 text-sm">
                  <input
                    type="number"
                    value={row.actual}
                    onChange={(e) =>
                      onUpdate(
                        row.id,
                        "actual",
                        e.target.value
                      )
                    }
                    className="w-20 text-right bg-transparent"
                  />
                </div>

                <span
                  className={`text-xs ${
                    diff < 0
                      ? "text-red-600"
                      : "text-gray-400"
                  }`}
                >
                  {formatINR(diff)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT */}
      <div className="bg-blue-50 rounded-2xl p-6">
        <h3 className="text-sm font-medium text-blue-900 mb-2">
          Wants summary
        </h3>
        <p className="text-2xl font-semibold text-blue-900">
          {formatINR(totalActual)}
        </p>
        <p className="text-sm text-blue-700 mt-1">
          Total discretionary spend
        </p>
      </div>
    </section>
  );
}
