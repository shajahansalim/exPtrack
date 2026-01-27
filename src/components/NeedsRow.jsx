import { formatINR, toNumber } from "../utils/money";

export default function NeedsRow({
  needs,
  onUpdate,
  onAdd,
  totalBudget,
  totalActual,
}) {
  const overspent = needs.filter(
    (n) => toNumber(n.actual) > toNumber(n.budget)
  );

  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT: Needs List */}
      <div className="lg:col-span-2 bg-white rounded-2xl border p-6">
        <div className="flex justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Needs
            </h2>
            <p className="text-sm text-gray-500">
              Fixed & essential expenses
            </p>
          </div>

          <button
            onClick={onAdd}
            className="px-4 py-2 rounded-xl text-sm font-medium
                       bg-gray-900 text-white hover:bg-gray-800"
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
                    value={row.budget}
                    onChange={(e) =>
                      onUpdate(
                        row.id,
                        "budget",
                        e.target.value
                      )
                    }
                    className="w-20 text-right bg-transparent"
                  />
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
                  className={`px-3 py-1 rounded-lg text-xs font-medium ${
                    diff < 0
                      ? "bg-red-50 text-red-700"
                      : "bg-green-50 text-green-700"
                  }`}
                >
                  {formatINR(diff)}
                </span>
              </div>
            );
          })}
        </div>

        {/* Totals */}
        <div className="mt-4 pt-4 border-t flex justify-between text-sm">
          <span className="text-gray-500">
            Total needs
          </span>
          <span className="font-medium">
            {formatINR(totalActual)} /{" "}
            {formatINR(totalBudget)}
          </span>
        </div>
      </div>

      {/* RIGHT: Needs Insights */}
      <div className="bg-white rounded-2xl border p-6 space-y-4">
        <h3 className="text-sm font-medium text-gray-900">
          Attention
        </h3>

        {overspent.length === 0 ? (
          <p className="text-sm text-gray-500">
            All essential expenses are within budget 👍
          </p>
        ) : (
          overspent.map((n) => (
            <div
              key={n.id}
              className="text-sm bg-red-50 text-red-700 px-3 py-2 rounded-lg"
            >
              {n.name} is over budget by{" "}
              {formatINR(
                toNumber(n.actual) - toNumber(n.budget)
              )}
            </div>
          ))
        )}
      </div>
    </section>
  );
}
