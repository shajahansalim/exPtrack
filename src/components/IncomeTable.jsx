import { formatINR, toNumber } from "../utils/money";

export default function IncomeTable({
  income,
  onUpdate,
  onAdd,
  totalExpected,
  totalActual,
}) {
  return (
    <div className="bg-white border rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Income
        </h2>
        <button
          onClick={onAdd}
          className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50"
        >
          + Add Income
        </button>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2">Income Name</th>
            <th className="text-right p-2">Expected</th>
            <th className="text-right p-2">Actual</th>
            <th className="text-right p-2">Diff</th>
          </tr>
        </thead>

        <tbody>
          {income.map((row) => {
            const diff =
              toNumber(row.actual) - toNumber(row.expected);

            return (
              <tr key={row.id} className="border-b last:border-none">
                <td className="p-2">
                  <input
                    value={row.name}
                    onChange={(e) =>
                      onUpdate(row.id, "name", e.target.value)
                    }
                    className="w-full border rounded px-2 py-1"
                  />
                </td>

                <td className="p-2 text-right">
                  <input
                    type="number"
                    value={row.expected}
                    onChange={(e) =>
                      onUpdate(
                        row.id,
                        "expected",
                        e.target.value
                      )
                    }
                    className="w-28 text-right border rounded px-2 py-1"
                  />
                </td>

                <td className="p-2 text-right">
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
                    className="w-28 text-right border rounded px-2 py-1"
                  />
                </td>

                <td
                  className={`p-2 text-right font-medium ${
                    diff >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {formatINR(diff)}
                </td>
              </tr>
            );
          })}
        </tbody>

        <tfoot>
          <tr className="font-semibold bg-gray-50">
            <td className="p-2">Total</td>
            <td className="p-2 text-right">
              {formatINR(totalExpected)}
            </td>
            <td className="p-2 text-right">
              {formatINR(totalActual)}
            </td>
            <td className="p-2 text-right">
              {formatINR(totalActual - totalExpected)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
