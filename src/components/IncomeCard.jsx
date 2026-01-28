import { useState } from "react";
import { formatINR, toNumber } from "../utils/money";

export default function IncomeCard({
  income,
  onUpdate,
  onAdd,
  onDelete,
  totalExpected,
  totalActual,
}) {
  const [open, setOpen] = useState(false);

  return (
    <section className="bg-blue-50 border border-blue-200 rounded-xl p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-lg font-semibold">Income</h2>
          <p className="text-sm text-gray-500">
            Expected vs actual income
          </p>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="px-4 py-2 rounded-lg text-sm border hover:bg-gray-50"
        >
          {open ? "Close" : "Edit income"}
        </button>

      </div>

      {/* COLLAPSED VIEW */}
      {!open && (
        <div className="flex justify-between items-center text-sm">
          <div>
            <p className="text-gray-500">Total income</p>
            <p className="text-xl font-semibold">
              {formatINR(totalActual)}
            </p>
            <p className="text-xs text-gray-400">
              {income.length} source{income.length > 1 ? "s" : ""}
            </p>
          </div>

          <span
            className={`px-3 py-1 rounded-md text-xs ${totalActual >= totalExpected
              ? "bg-green-50 text-green-700"
              : "bg-yellow-50 text-yellow-700"
              }`}
          >
            {totalActual >= totalExpected
              ? "On track"
              : "Below expected"}
          </span>
        </div>
      )}

      {/* EDIT MODE */}
      {open && (
        <>
          {/* TABLE HEADINGS */}
          <div className="grid grid-cols-12 gap-3 text-xs text-gray-500 px-2 mb-2">
            <div className="col-span-4">Source</div>
            <div className="col-span-3 text-right">Expected</div>
            <div className="col-span-3 text-right">Actual</div>
            <div className="col-span-2 text-right">Diff</div>
          </div>

          <div className="space-y-2">
            {income.map((row) => {
              const diff =
                toNumber(row.actual) - toNumber(row.expected);

              return (
                <div
                  key={row.id}
                  className="group grid grid-cols-12 gap-3 items-center
                             px-2 py-2 rounded-lg hover:bg-gray-50"
                >
                  {/* Name */}
                  <input
                    value={row.name}
                    placeholder="Income source"
                    onChange={(e) =>
                      onUpdate(row.id, "name", e.target.value)
                    }
                    className="col-span-4 text-sm px-2 py-1 rounded-md
                               border border-transparent
                               hover:border-gray-300
                               focus:border-gray-400 focus:outline-none"
                  />

                  {/* Expected */}
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
                    className="col-span-3 text-right text-sm px-2 py-1 rounded-md
                               border border-transparent
                               hover:border-gray-300
                               focus:border-gray-400 focus:outline-none"
                  />

                  {/* Actual */}
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
                    className="col-span-3 text-right text-sm px-2 py-1 rounded-md
                               border border-transparent
                               hover:border-gray-300
                               focus:border-gray-400 focus:outline-none"
                  />

                  {/* Diff + Delete */}
                  <div className="col-span-2 flex justify-end items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded-md ${diff >= 0
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
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
                </div>
              );
            })}
          </div>

          {/* FOOTER */}
          <div className="mt-4 flex justify-between items-center border-t pt-4">
            <button
              onClick={onAdd}
              className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50"
            >
              + Add income source
            </button>

            <div className="text-sm font-medium">
              {formatINR(totalActual)} /{" "}
              {formatINR(totalExpected)}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
