import { formatINR } from "../utils/money";

function Card({ title, value, sub, tone = "neutral" }) {
  const tones = {
    positive: "bg-green-50 text-green-700",
    negative: "bg-red-50 text-red-700",
    neutral: "bg-gray-50 text-gray-800",
    info: "bg-blue-50 text-blue-700",
    warning: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <p className="text-sm text-gray-500 mb-1">{title}</p>

      <p className="text-2xl font-semibold text-slate-900">
        {value}
      </p>

      {sub && (
        <span
          className={`inline-block mt-2 px-2.5 py-1 text-xs font-medium rounded-md ${tones[tone]}`}
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
  totalSavings = 0,
  totalDebt = 0,
}) {
  const totalSpent = needsActual + wantsActual;
  const available = totalIncome - totalSpent;

  const allocationPct =
    totalIncome > 0
      ? Math.round((totalSpent / totalIncome) * 100)
      : 0;

  const netWorth = totalSavings - totalDebt;

  return (
    <>
      {/* CASH FLOW */}
      <section>
        <p className="text-xs font-semibold text-gray-400 mb-3 uppercase">
          Cash flow · This month
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card
            title="Available balance"
            value={formatINR(available)}
            sub={
              available >= 0
                ? "Cash surplus available"
                : "Cash shortfall"
            }
            tone={available >= 0 ? "positive" : "negative"}
          />

          <Card
            title="Needs spent"
            value={formatINR(needsActual)}
            sub={
              needsActual <= needsBudget
                ? "Within essential budget"
                : "Exceeded essential budget"
            }
            tone={needsActual <= needsBudget ? "positive" : "negative"}
          />

          <Card
            title="Wants spent"
            value={formatINR(wantsActual)}
            sub="Optional spending"
            tone="info"
          />

          <Card
            title="Income allocated"
            value={`${allocationPct}%`}
            sub={
              allocationPct < 80
                ? "Well allocated"
                : allocationPct < 100
                  ? "High allocation"
                  : "Over-allocated"
            }
            tone={
              allocationPct < 80
                ? "positive"
                : allocationPct < 100
                  ? "warning"
                  : "negative"
            }
          />
        </div>
      </section>

      {/* BALANCE SHEET */}
      <section className="mt-8">
        <p className="text-xs font-semibold text-gray-400 mb-3 uppercase">
          Balance sheet · Overall position
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            title="Total savings"
            value={formatINR(totalSavings)}
            sub={
              totalSavings > 0
                ? "Emergency fund in progress"
                : "No savings yet"
            }
            tone={totalSavings > 0 ? "positive" : "warning"}
          />

          <Card
            title="Total debt"
            value={formatINR(totalDebt)}
            sub={
              totalDebt > 0
                ? "Outstanding liabilities"
                : "Debt-free"
            }
            tone={totalDebt > 0 ? "negative" : "positive"}
          />

          <Card
            title="Net worth"
            value={formatINR(netWorth)}
            sub={
              netWorth >= 0
                ? "Positive net worth"
                : "Negative net worth"
            }
            tone={netWorth >= 0 ? "positive" : "negative"}
          />
        </div>
      </section>
    </>
  );
}
