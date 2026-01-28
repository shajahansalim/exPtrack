import { formatINR } from "../utils/money";

export default function ReportView({
    month,
    year,
    user,
    income,
    needs,
    wants,
    savings,
    debt,
    kpis,
}) {
    return (
        <div className="pdf-root text-[12px] text-gray-900 leading-relaxed">
            {/* ================= HEADER ================= */}
            <header className="flex justify-between items-end border-b pb-4 mb-6">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight">exPtrack</h1>
                    <p className="text-xs text-gray-500">
                        Monthly Financial Report
                    </p>
                </div>

                <div className="text-right text-xs">
                    <div className="font-medium">
                        {month} {year}
                    </div>
                    <div className="text-gray-500">User: {user}</div>
                </div>
            </header>

            {/* ================= KPI STRIP ================= */}
            <section className="grid grid-cols-3 gap-6 mb-8">
                <KPI label="Total Income" value={kpis.totalIncome} />
                <KPI label="Total Spent" value={kpis.totalSpent} />
                <KPI
                    label="Net Worth"
                    value={kpis.netWorth}
                    highlight={kpis.netWorth < 0}
                />
            </section>

            {/* ================= SUMMARY ================= */}
            <section className="mb-8">
                <p className="text-sm">
                    You allocated{" "}
                    <strong>{kpis.incomeAllocatedPct}%</strong> of your income
                    this month.
                    {kpis.netWorth < 0 ? (
                        <>
                            {" "}
                            Your net worth is{" "}
                            <strong className="text-red-600">negative</strong>,
                            primarily due to outstanding debt.
                        </>
                    ) : (
                        <>
                            {" "}
                            Your finances remain{" "}
                            <strong className="text-green-600">stable</strong>.
                        </>
                    )}
                </p>
            </section>

            {/* ================= CASH FLOW ================= */}
            <Section title="Cash Flow Summary">
                <KeyValue label="Total Income" value={kpis.totalIncome} />
                <KeyValue label="Total Expenses" value={kpis.needsActual + kpis.wantsActual} />
                <KeyValue label="Total Savings" value={kpis.totalSavings} />
                <KeyValue label="Outstanding Debt" value={kpis.totalDebt} />
                <KeyValue label="Net Worth" value={kpis.netWorth} bold />
            </Section>

            {/* PAGE BREAK */}
            <PageBreak />

            {/* ================= INCOME ================= */}
            <Section title="Income">
                <Table
                    headers={["Source", "Expected", "Actual"]}
                    rows={income.map((i) => [
                        i.name,
                        formatINR(i.expected),
                        formatINR(i.actual),
                    ])}
                />
            </Section>

            {/* ================= NEEDS ================= */}
            <Section title="Essential Expenses (Needs)">
                <Table
                    headers={["Name", "Budget", "Actual"]}
                    rows={needs.map((n) => [
                        n.name,
                        formatINR(n.budget),
                        formatINR(n.actual),
                    ])}
                    footer={["Total", "", formatINR(kpis.needsActual)]}
                />
            </Section>

            {/* ================= WANTS ================= */}
            <Section title="Discretionary Spending (Wants)">
                <Table
                    headers={["Name", "Budget", "Actual"]}
                    rows={wants.map((w) => [
                        w.name,
                        formatINR(w.budget),
                        formatINR(w.actual),
                    ])}
                    footer={["Total", "", formatINR(kpis.wantsActual)]}
                />
            </Section>

            <PageBreak />

            {/* ================= SAVINGS ================= */}
            <Section title="Savings Goals">
                <Table
                    headers={["Goal", "Target", "Saved", "Remaining"]}
                    rows={savings.map((s) => [
                        s.name,
                        formatINR(s.goal),
                        formatINR(s.saved),
                        formatINR(s.goal - s.saved),
                    ])}
                />
            </Section>

            {/* ================= DEBT ================= */}
            <Section title="Outstanding Debt">
                <Table
                    headers={["Loan", "Total", "Paid", "Remaining"]}
                    rows={debt.map((d) => [
                        d.name,
                        formatINR(d.balance),
                        formatINR(d.paid),
                        formatINR(d.balance - d.paid),
                    ])}
                    footer={["Total Debt", "", "", formatINR(kpis.totalDebt)]}
                />
            </Section>

            {/* ================= RECOMMENDATIONS ================= */}
            <Section title="Recommendations">
                <ul className="list-disc pl-5 text-sm space-y-2">
                    {kpis.netWorth < 0 && (
                        <li>
                            Focus on reducing high-interest debt to improve net
                            worth.
                        </li>
                    )}
                    {kpis.incomeAllocatedPct > 60 && (
                        <li>
                            Your spending is relatively high. Consider increasing
                            savings allocation.
                        </li>
                    )}
                    {kpis.totalSavings === 0 && (
                        <li>
                            Start building an emergency fund covering at least 3–6
                            months of expenses.
                        </li>
                    )}
                </ul>
            </Section>

            {/* ================= FOOTER ================= */}
            <footer className="mt-10 pt-4 border-t text-xs text-center text-gray-400">
                Generated by exPtrack • Confidential Financial Report
            </footer>
        </div>
    );
}

/* ================= HELPERS ================= */

function KPI({ label, value, highlight }) {
    return (
        <div>
            <div className="text-xs text-gray-500 mb-1">{label}</div>
            <div
                className={`text-lg font-semibold ${highlight ? "text-red-600" : ""
                    }`}
            >
                {formatINR(value)}
            </div>
        </div>
    );
}

function Section({ title, children }) {
    return (
        <section className="mb-8">
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-3">
                {title}
            </h2>
            {children}
        </section>
    );
}

function KeyValue({ label, value, bold }) {
    return (
        <div className="flex justify-between py-1 border-b last:border-0">
            <span className="text-gray-600">{label}</span>
            <span className={bold ? "font-semibold" : ""}>
                {formatINR(value)}
            </span>
        </div>
    );
}

function Table({ headers, rows, footer }) {
    return (
        <table className="w-full border-collapse text-sm">
            <thead>
                <tr className="border-b">
                    {headers.map((h) => (
                        <th
                            key={h}
                            className="text-left font-medium py-2"
                        >
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, i) => (
                    <tr key={i} className="border-b last:border-0">
                        {row.map((cell, j) => (
                            <td key={j} className="py-2">
                                {cell}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
            {footer && (
                <tfoot>
                    <tr className="border-t font-semibold">
                        {footer.map((f, i) => (
                            <td key={i} className="py-2">
                                {f}
                            </td>
                        ))}
                    </tr>
                </tfoot>
            )}
        </table>
    );
}

function PageBreak() {
    return <div className="page-break my-8" />;
}
