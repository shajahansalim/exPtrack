import { formatINR } from "../utils/money";

function Card({ title, value, sub, tone = "neutral" }) {
  const tones = {
    positive: "bg-green-50 text-green-700",
    negative: "bg-red-50 text-red-700",
    neutral: "bg-gray-50 text-gray-800",
    info: "bg-blue-50 text-blue-700",
  };

  return (
    <div
      className="
     bg-white
  border border-gray-200
  rounded-xl
  p-5
  "
    >
      <p className="text-sm text-gray-500 mb-1">{title}</p>
      <p className="text-2xl font-semibold text-slate-900">
        {value}
      </p>
      {sub && (
        <span
          className={`text-xs font-medium
  px-2.5 py-1
  rounded-md
  bg-green-50 text-green-700 ${tones[tone]}`}
        >
          {sub}
        </span>
      )}
    </div>
  );
}

export default function KPIOverview({
  totalIncome,
  needsBudget,
  needsActual,
  wantsActual,
}) {
  const available =
    totalIncome - needsActual - wantsActual;

  const allocationPct =
    totalIncome > 0
      ? Math.round(
        ((needsActual + wantsActual) / totalIncome) *
        100
      )
      : 0;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Available Balance */}
      <Card
        title="Available balance"
        value={formatINR(available)}
        sub={
          available >= 0
            ? "You’re within limits"
            : "Over-allocated"
        }
        tone={available >= 0 ? "positive" : "negative"}
      />

      {/* Needs */}
      <Card
        title="Needs spent"
        value={formatINR(needsActual)}
        sub={`${formatINR(needsBudget)} budgeted`}
        tone={
          needsActual <= needsBudget
            ? "positive"
            : "negative"
        }
      />

      {/* Wants */}
      <Card
        title="Wants spent"
        value={formatINR(wantsActual)}
        sub="Discretionary"
        tone="info"
      />

      {/* Allocation */}
      <Card
        title="Income allocated"
        value={`${allocationPct}%`}
        sub={
          allocationPct < 80
            ? "Healthy"
            : allocationPct < 100
              ? "Tight"
              : "Overbooked"
        }
        tone={
          allocationPct < 80
            ? "positive"
            : allocationPct < 100
              ? "info"
              : "negative"
        }
      />
    </section>
  );
}
