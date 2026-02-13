import { useState } from "react";
import WantsModal from "./WantsModal";
import { formatINR } from "../utils/money";
import { createRecurringExpense } from "../api/recurring";

export default function WantsCard({
  wants = [],
  addWant,
  updateWant,
  deleteWant,
  totalBudget,
  totalActual,
}) {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const openAdd = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    if (editingItem) {
      updateWant(editingItem.id, "name", data.name);
      updateWant(editingItem.id, "budget", data.budget);
      updateWant(editingItem.id, "actual", data.actual);
    } else {
      const { recurring, ...payload } = data;
      await addWant(payload);

      if (recurring) {
        try {
          await createRecurringExpense({
            name: payload.name,
            budget: Number(payload.budget),
            type: "want",
          });
        } catch (err) {
          console.error("Failed to create recurring want", err);
        }
      }
    }
    setShowModal(false);
    setEditingItem(null);
  };


  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold">Wants</h2>
          <p className="text-sm text-slate-500 mt-1">
            Optional & lifestyle spending
          </p>
        </div>

        <button
          onClick={openAdd}
          className="text-sm font-medium px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
        >
          + Add expense
        </button>
      </div>

      {/* Table */}
      {wants.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-6 text-xs font-medium text-slate-500 mb-2">
            <span>Name</span>
            <span className="text-right">Budget</span>
            <span className="text-right">Actual</span>
            <span className="text-right">Variance</span>
            <span className="text-right">Edit</span>
            <span className="text-right">Remove</span>
          </div>

          {wants.map((item) => {
            const diff = item.actual - item.budget;
            const isOver = diff > 0;

            return (
              <div
                key={item.id}
                className="grid grid-cols-6 items-center py-3 border-b border-gray-100"

              >
                <span className="text-sm">{item.name}</span>

                <span className="text-sm text-right">
                  {formatINR(item.budget)}
                </span>

                <span className="text-sm text-right">
                  {formatINR(item.actual)}
                </span>

                <span
                  className={`text-sm text-right font-medium ${isOver ? "text-red-600" : "text-green-600"
                    }`}
                >
                  {formatINR(diff)}
                </span>

                <button
                  onClick={() => openEdit(item)}
                  className="text-sm text-blue-600 text-right hover:underline"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteWant(item.id)}
                  className="text-sm text-red-600 text-right hover:underline"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {wants.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">
          Capture non-essential spending such as food, shopping, and subscriptions.
          <br />
          This helps you control lifestyle inflation and discretionary costs.
        </p>
      )}

      {/* Footer */}
      {wants.length > 0 && (
        <div className="mt-6 pt-4 border-t flex justify-between text-sm">
          <span className="text-slate-500">Total</span>
          <span className="font-medium">
            {formatINR(totalActual)} / {formatINR(totalBudget)}
          </span>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <WantsModal
          mode={editingItem ? "edit" : "add"}
          initialData={editingItem}
          onClose={() => {
            setShowModal(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
        />
      )}
    </section>
  );
}
