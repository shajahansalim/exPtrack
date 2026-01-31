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

  // ⭐ NEW — local rows for unsaved items
  const [localRows, setLocalRows] = useState([]);

  // ⭐ ADD LOCAL ROW ONLY (no backend call)
  const addLocalRow = () => {
    setLocalRows((prev) => [
      ...prev,
      {
        id: "temp-" + Date.now(),
        name: "",
        expected: "",
        actual: "",
        isNew: true,
      },
    ]);
  };

  // ⭐ save new row to backend only after typing
  const saveLocalRow = async (row) => {
    await onAdd({
      name: row.name,
      expected: toNumber(row.expected),
      actual: toNumber(row.actual),
    });

    // remove temp row
    setLocalRows((prev) => prev.filter((r) => r.id !== row.id));
  };

  const allRows = [...income, ...localRows];

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

      {/* COLLAPSED */}
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
        </div>
      )}

      {/* EDIT MODE */}
      {open && (
        <>
          <div className="grid grid-cols-12 gap-3 text-xs text-gray-500 px-2 mb-2">
            <div className="col-span-4">Source</div>
            <div className="col-span-3 text-right">Expected</div>
            <div className="col-span-3 text-right">Actual</div>
            <div className="col-span-2 text-right">Diff</div>
          </div>

          <div className="space-y-2">
            {allRows.map((row) => {
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
                    onChange={(e) => {
                      if (row.isNew) {
                        setLocalRows((prev) =>
                          prev.map((r) =>
                            r.id === row.id
                              ? { ...r, name: e.target.value }
                              : r
                          )
                        );
                      } else {
                        onUpdate(row.id, "name", e.target.value);
                      }
                    }}
                    className="col-span-4 text-sm px-2 py-1 rounded-md border"
                  />

                  {/* Expected */}
                  <input
                    type="number"
                    value={row.expected}
                    onChange={(e) => {
                      if (row.isNew) {
                        setLocalRows((prev) =>
                          prev.map((r) =>
                            r.id === row.id
                              ? { ...r, expected: e.target.value }
                              : r
                          )
                        );
                      } else {
                        onUpdate(row.id, "expected", e.target.value);
                      }
                    }}
                    className="col-span-3 text-right text-sm px-2 py-1 rounded-md border"
                  />

                  {/* Actual */}
                  <input
                    type="number"
                    value={row.actual}
                    onChange={(e) => {
                      if (row.isNew) {
                        setLocalRows((prev) =>
                          prev.map((r) =>
                            r.id === row.id
                              ? { ...r, actual: e.target.value }
                              : r
                          )
                        );
                      } else {
                        onUpdate(row.id, "actual", e.target.value);
                      }
                    }}
                    className="col-span-3 text-right text-sm px-2 py-1 rounded-md border"
                  />

                  {/* Diff */}
                  <div className="col-span-2 flex justify-end items-center gap-2">
                    <span className="text-xs">
                      {formatINR(diff)}
                    </span>

                    {row.isNew ? (
                      <button
                        onClick={() => saveLocalRow(row)}
                        className="text-green-600 text-xs"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => onDelete(row.id)}
                        className="text-red-600 text-xs"
                      >
                        −
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* FOOTER */}
          <div className="mt-4 flex justify-between items-center border-t pt-4">
            <button
              onClick={addLocalRow}
              className="text-sm px-3 py-1.5 rounded-lg border hover:bg-gray-50"
            >
              + Add income source
            </button>

            <div className="text-sm font-medium">
              {formatINR(totalActual)} / {formatINR(totalExpected)}
            </div>
          </div>
        </>
      )}
    </section>
  );
}
