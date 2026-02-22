import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { fetchAnalyticsData } from "../api/analytics";
import { formatINR } from "../utils/money";
import Navbar from "../components/Navbar";

const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const COLORS = {
    income: "#3b82f6",      // blue
    expenses: "#ef4444",    // red
    needs: "#f59e0b",       // amber
    wants: "#8b5cf6",       // purple
    savings: "#10b981",     // green
    debt: "#dc2626",         // red-600
};

export default function Analytics() {
    const navigate = useNavigate();
    const currentYear = new Date().getFullYear();
    
    const [year, setYear] = useState(currentYear);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const result = await fetchAnalyticsData(year);
                setData(result.months || []);
            } catch (err) {
                console.error("Failed to load analytics", err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [year]);

    // Prepare chart data
    const chartData = data.map((m) => ({
        ...m,
        monthLabel: MONTHS_SHORT[parseInt(m.month.split("-")[1]) - 1],
    }));

    // Category breakdown (last month or average)
    const lastMonth = data[data.length - 1] || {};
    const categoryData = [
        { name: "Needs", value: lastMonth.needs || 0, color: COLORS.needs },
        { name: "Wants", value: lastMonth.wants || 0, color: COLORS.wants },
        { name: "Savings", value: lastMonth.savings || 0, color: COLORS.savings },
        { name: "Debt Paid", value: lastMonth.debt_paid || 0, color: COLORS.debt },
    ].filter((item) => item.value > 0);

    // Cumulative savings/debt progress
    const cumulativeData = [];
    let cumulativeSavings = 0;
    
    data.forEach((month) => {
        cumulativeSavings += month.savings || 0;
        // Use the debt_balance directly (already calculated as outstanding debt)
        cumulativeData.push({
            ...month,
            monthLabel: MONTHS_SHORT[parseInt(month.month.split("-")[1]) - 1],
            cumulativeSavings,
            cumulativeDebt: month.debt_balance || 0,
        });
    });

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                    {payload.map((entry, index) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {`${entry.name}: ${formatINR(entry.value)}`}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen flex justify-center relative overflow-hidden">
            <div className="relative z-10 w-full max-w-7xl px-8 py-10 space-y-10">
                {/* ================= NAVBAR ================= */}
                <Navbar
                    analyticsYear={year}
                    onAnalyticsYearChange={setYear}
                    MONTHS={MONTHS}
                />

                {/* ================= CONTENT ================= */}
                <div className="space-y-8">
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading analytics...</p>
                    </div>
                ) : data.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No data available for {year}</p>
                    </div>
                ) : (
                    <>
                        {/* Spending Trends Chart */}
                        <section className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-lg font-semibold mb-4">Spending Trends</h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Monthly income vs expenses over time
                            </p>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="monthLabel"
                                        stroke="#6b7280"
                                        style={{ fontSize: "12px" }}
                                    />
                                    <YAxis
                                        stroke="#6b7280"
                                        style={{ fontSize: "12px" }}
                                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="income"
                                        name="Income"
                                        stroke={COLORS.income}
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="expenses"
                                        name="Total Expenses"
                                        stroke={COLORS.expenses}
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </section>

                        {/* Category Breakdown */}
                        <section className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-lg font-semibold mb-4">Category Breakdown</h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Distribution of spending in {data[data.length - 1]?.month_name || "latest month"}
                            </p>
                            {categoryData.length > 0 ? (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={categoryData}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) =>
                                                    `${name} ${(percent * 100).toFixed(0)}%`
                                                }
                                                outerRadius={100}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {categoryData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip content={<CustomTooltip />} />
                                        </PieChart>
                                    </ResponsiveContainer>

                                    <div className="flex flex-col justify-center space-y-3">
                                        {categoryData.map((item) => (
                                            <div key={item.name} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-4 h-4 rounded"
                                                        style={{ backgroundColor: item.color }}
                                                    />
                                                    <span className="text-sm font-medium">{item.name}</span>
                                                </div>
                                                <span className="text-sm font-semibold">
                                                    {formatINR(item.value)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500 text-center py-8">
                                    No spending data available
                                </p>
                            )}
                        </section>

                        {/* Income vs Expenses Comparison */}
                        <section className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-lg font-semibold mb-4">Income vs Expenses Comparison</h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Monthly comparison showing surplus or deficit
                            </p>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="monthLabel"
                                        stroke="#6b7280"
                                        style={{ fontSize: "12px" }}
                                    />
                                    <YAxis
                                        stroke="#6b7280"
                                        style={{ fontSize: "12px" }}
                                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Bar dataKey="income" name="Income" fill={COLORS.income} />
                                    <Bar dataKey="expenses" name="Expenses" fill={COLORS.expenses} />
                                </BarChart>
                            </ResponsiveContainer>
                        </section>

                        {/* Savings & Debt Progress */}
                        <section className="bg-white border border-gray-200 rounded-xl p-6">
                            <h2 className="text-lg font-semibold mb-4">Savings & Debt Progress</h2>
                            <p className="text-sm text-gray-500 mb-6">
                                Cumulative savings growth and debt reduction over time
                            </p>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={cumulativeData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                    <XAxis
                                        dataKey="monthLabel"
                                        stroke="#6b7280"
                                        style={{ fontSize: "12px" }}
                                    />
                                    <YAxis
                                        stroke="#6b7280"
                                        style={{ fontSize: "12px" }}
                                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend />
                                    <Line
                                        type="monotone"
                                        dataKey="cumulativeSavings"
                                        name="Cumulative Savings"
                                        stroke={COLORS.savings}
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="cumulativeDebt"
                                        name="Outstanding Debt"
                                        stroke={COLORS.debt}
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </section>
                    </>
                )}
                </div>
            </div>
        </div>
    );
}
