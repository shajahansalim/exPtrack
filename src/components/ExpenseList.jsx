export default function ExpenseList({ expenses, onDelete }) {
  if (!expenses.length) {
    return (
      <p className="text-gray-400 text-center mt-10 text-sm">
        No expenses yet. Add your first one 🚀
      </p>
    );
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm mt-6 overflow-hidden">
      {expenses.map((exp) => (
        <div
          key={exp.id}
          className="flex justify-between items-center px-4 py-3 border-b last:border-none hover:bg-gray-50"
        >
          <div>
            <p className="font-medium text-gray-800">
              {exp.category}
            </p>
            <p className="text-sm text-gray-500">
              {exp.note || "—"} · {exp.date}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <p className="font-semibold">₹ {exp.amount}</p>
            <button
              onClick={() => onDelete(exp.id)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
