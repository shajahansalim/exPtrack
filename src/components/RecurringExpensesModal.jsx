import { useEffect, useState } from "react";
import {
  fetchRecurringExpenses,
  deleteRecurringExpense,
} from "../api/recurring";
import { formatINR } from "../utils/money";

export default function RecurringExpensesModal({ open, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchRecurringExpenses();
        setItems(data || []);
      } catch (err) {
        console.error("Failed to load recurring expenses", err);
        setError("Failed to load recurring expenses");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [open]);

  const handleDelete = async (id) => {
    try {
      await deleteRecurringExpense(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Failed to delete recurring expense", err);
      setError("Failed to delete recurring expense");
    }
  };

  if (!open) return null;

  const needs = items.filter((i) => i.type === "need");
  const wants = items.filter((i) => i.type === "want");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Recurring expenses</h2>
            <p className="text-xs text-gray-500">
              Bills and lifestyle expenses that will auto-populate each month.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Close
          </button>
        </div>

        {loading && (
          <p className="text-sm text-gray-500 mb-3">Loading…</p>
        )}

        {error && (
          <p className="text-xs text-red-500 mb-3">{error}</p>
        )}

        {items.length === 0 && !loading && (
          <p className="text-sm text-gray-500">
            You don&apos;t have any recurring expenses yet. When you add a Need or
            Want, tick &quot;Repeat every month&quot; to create one.
          </p>
        )}

        {needs.length > 0 && (
          <section className="mb-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Needs
            </h3>
            <div className="space-y-1">
              {needs.map((item) => (
                <Row
                  key={item.id}
                  item={item}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}
            </div>
          </section>
        )}

        {wants.length > 0 && (
          <section>
            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
              Wants
            </h3>
            <div className="space-y-1">
              {wants.map((item) => (
                <Row
                  key={item.id}
                  item={item}
                  onDelete={() => handleDelete(item.id)}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function Row({ item, onDelete }) {
  return (
    <div className="flex items-center justify-between rounded-lg border px 3 py-2 px-3 py-2 text-sm">
      <div>
        <div className="font-medium text-gray-800">{item.name}</div>
        <div className="text-xs text-gray-500">
          {item.type === "need" ? "Essential bill" : "Lifestyle / discretionary"}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-800">
          {formatINR(item.budget)}
        </span>
        <button
          onClick={onDelete}
          className="text-xs text-red-600 hover:underline"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

