import { useState } from "react";
import NeedsModal from "./NeedsModal";
import { formatINR } from "../utils/money";

export default function NeedsCard({
  needs = [],
  addNeed,
  updateNeed,
  deleteNeed,
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

  const handleSave = (data) => {
    if (editingItem) {
      updateNeed(editingItem.id, "name", data.name);
      updateNeed(editingItem.id, "budget", data.budget);
      updateNeed(editingItem.id, "actual", data.actual);
    } else {
      addNeed(data);
    }
    setShowModal(false);
    setEditingItem(null);
  };

  return (
    <section className="bg-white border border-gray-200 rounded-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-semibold">Needs</h2>
          <p className="text-sm text-slate-500 mt-1">
            Fixed & essential expenses
          </p>
        </div>

        <button
          onClick={openAdd}
          className="text-sm font-medium px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
        >
          + Add bill
        </button>
      </div>

      {/* Table */}
      {needs.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-6 text-xs font-medium text-slate-500 mb-2">
            <span>Name</span>
            <span className="text-right">Budget</span>
            <span className="text-right">Actual</span>
            <span className="text-right">Variance</span>
            <span className="text-right">Edit</span>
            <span className="text-right">Remove</span>
          </div>

          {needs.map((item) => {
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
                  onClick={() => deleteNeed(item.id)}
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
      {needs.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">
          Build your financial safety net and plan for future goals.
          <br />
          Start with an emergency fund or a long-term savings goal.
        </p>
      )}

      {/* Footer */}
      {needs.length > 0 && (
        <div className="mt-6 pt-4 border-t flex justify-between text-sm">
          <span className="text-slate-500">Total</span>
          <span className="font-medium">
            {formatINR(totalActual)} / {formatINR(totalBudget)}
          </span>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <NeedsModal
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
