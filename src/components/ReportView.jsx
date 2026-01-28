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
        <div className="pdf-export">
            {/* ================= HEADER ================= */}
            <header style={{ marginBottom: 16 }}>
                <h1>exPtrack</h1>
                <p style={{ fontSize: 11, color: "#555" }}>
                    Financial Report · {month} {year}
                </p>
                <p style={{ fontSize: 11 }}>
                    User: <strong>{user}</strong>
                </p>
                <hr />
            </header>

            {/* ================= KPI SUMMARY ================= */}
            <section>
                <h2>Key Metrics</h2>
                <table>
                    <tbody>
                        <tr>
                            <td>Total Income</td>
                            <td>{formatINR(kpis.totalIncome)}</td>
                        </tr>
                        <tr>
                            <td>Total Spent</td>
                            <td>{formatINR(kpis.totalSpent)}</td>
                        </tr>
                        <tr>
                            <td>Total Savings</td>
                            <td>{formatINR(kpis.totalSavings)}</td>
                        </tr>
                        <tr>
                            <td>Total Debt</td>
                            <td>{formatINR(kpis.totalDebt)}</td>
                        </tr>
                        <tr>
                            <td>Net Worth</td>
                            <td>{formatINR(kpis.netWorth)}</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            {/* ================= INCOME ================= */}
            <section>
                <h2>Income</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Source</th>
                            <th>Expected</th>
                            <th>Actual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {income.map((i) => (
                            <tr key={i.id}>
                                <td>{i.name}</td>
                                <td>{formatINR(i.expected)}</td>
                                <td>{formatINR(i.actual)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* ================= NEEDS ================= */}
            <section>
                <h2>Needs</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Budget</th>
                            <th>Actual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {needs.map((n) => (
                            <tr key={n.id}>
                                <td>{n.name}</td>
                                <td>{formatINR(n.budget)}</td>
                                <td>{formatINR(n.actual)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* ================= WANTS ================= */}
            <section>
                <h2>Wants</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Budget</th>
                            <th>Actual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wants.map((w) => (
                            <tr key={w.id}>
                                <td>{w.name}</td>
                                <td>{formatINR(w.budget)}</td>
                                <td>{formatINR(w.actual)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* ================= SAVINGS ================= */}
            <section>
                <h2>Savings</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Goal</th>
                            <th>Saved</th>
                        </tr>
                    </thead>
                    <tbody>
                        {savings.map((s) => (
                            <tr key={s.id}>
                                <td>{s.name}</td>
                                <td>{formatINR(s.goal)}</td>
                                <td>{formatINR(s.saved)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* ================= PAGE BREAK ================= */}
            <div className="pdf-page-break" />

            {/* ================= DEBT ================= */}
            <section>
                <h2>Debt</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Remaining</th>
                        </tr>
                    </thead>
                    <tbody>
                        {debt.map((d) => (
                            <tr key={d.id}>
                                <td>{d.name}</td>
                                <td>{formatINR(d.balance)}</td>
                                <td>{formatINR(d.paid)}</td>
                                <td>{formatINR(d.balance - d.paid)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* ================= FOOTER ================= */}
            <footer
                style={{
                    position: "fixed",
                    bottom: 10,
                    left: 0,
                    right: 0,
                    textAlign: "center",
                    fontSize: 10,
                    color: "#777",
                }}
            >
                Page <span className="pageNumber"></span>
            </footer>
        </div>
    );
}
