import { useState } from "react";

const CATEGORIES = ["Food", "Travel", "Shopping", "Bills", "Other"];

export default function ExpenseForm({ onAdd }) {
  const [form, setForm] = useState({
    amount: "",
    category: "Food",
    note: "",
    date: new Date().toISOString().slice(0, 10),
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.amount) return;
    onAdd(form);
    setForm({ ...form, amount: "", note: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm border space-y-5"
    >
      <h2 className="text-lg font-semibold text-gray-800">
        Add Expense
      </h2>

      <div className="flex gap-3">
        <input
          type="number"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          className="border rounded-lg px-3 py-2"
        >
          {CATEGORIES.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <input
        type="text"
        placeholder="Note (optional)"
        value={form.note}
        onChange={(e) =>
          setForm({ ...form, note: e.target.value })
        }
        className="w-full border rounded-lg px-3 py-2"
      />

      <input
        type="date"
        value={form.date}
        onChange={(e) =>
          setForm({ ...form, date: e.target.value })
        }
        className="border rounded-lg px-3 py-2"
      />

      <button className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-800 transition">
        Add Expense
      </button>
    </form>
  );
}
