import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchIncome } from "./api/income";
import { fetchExpenses } from "./api/expenses";
import { fetchSavings } from "./api/savings";
import { fetchDebt } from "./api/debt";
import KPIOverview from "./components/KPIOverview";
import NeedsCard from "./components/NeedsCard";
import WantsCard from "./components/WantsCard";
import IncomeCard from "./components/IncomeCard";
import SavingsCard from "./components/SavingsCard";
import DebtCard from "./components/DebtCard";
import ReportView from "./components/ReportView";
import ProfileMenu from "./components/ProfileMenu";

import { exportPdf } from "./utils/exportPdf";
import { useAuthUser } from "./hooks/useAuthUser";

import { useIncome } from "./hooks/useIncome";
import { useExpenses } from "./hooks/useExpenses";
import { useSavings } from "./hooks/useSavings";
import { useDebt } from "./hooks/useDebt";

import { copyMonth } from "./api/month"; // ⭐ NEW API

export default function Dashboard() {

    // ================= MONTH SELECTOR =================
    const MONTHS = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const YEAR = new Date().getFullYear();
    const ACTIVE_MONTH_KEY = "active_month_index";

    const [monthIndex, setMonthIndex] = useState(() => {
        const saved = localStorage.getItem(ACTIVE_MONTH_KEY);
        return saved !== null ? Number(saved) : new Date().getMonth();
    });

    useEffect(() => {
        localStorage.setItem(ACTIVE_MONTH_KEY, monthIndex);
    }, [monthIndex]);

    const monthKey = `${YEAR}-${String(monthIndex + 1).padStart(2, "0")}`;

    // ================= COPY MODAL STATE =================
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [nextIndex, setNextIndex] = useState(null);
    const [toast, setToast] = useState("");

    const prevMonth = () =>
        setMonthIndex((i) => (i === 0 ? 11 : i - 1));

    const nextMonth = async () => {
        const nextIndex = monthIndex === 11 ? 0 : monthIndex + 1;
        const nextKey = `${YEAR}-${String(nextIndex + 1).padStart(2, "0")}`;

        try {
            const [i, n, w, s, d] = await Promise.all([
                fetchIncome(nextKey),
                fetchExpenses(nextKey, "need"),
                fetchExpenses(nextKey, "want"),
                fetchSavings(nextKey),
                fetchDebt(nextKey),
            ]);

            const hasData =
                i.length || n.length || w.length || s.length || d.length;

            if (!hasData) {
                await copyMonth(monthKey, nextKey);
                setToast("Copied previous month data");
                setTimeout(() => setToast(""), 2500);
            }

            setMonthIndex(nextIndex);

        } catch (err) {
            console.error("Month switch failed:", err);
            setMonthIndex(nextIndex);
        }
    };
    const confirmCopy = async () => {
        const from = monthKey;
        const to = `${YEAR}-${String(nextIndex + 1).padStart(2, "0")}`;

        await copyMonth(from, to);

        setShowCopyModal(false);
        setMonthIndex(nextIndex);
    };

    const skipCopy = () => {
        setShowCopyModal(false);
        setMonthIndex(nextIndex);
    };

    // ================= HOOKS =================
    const income = useIncome(monthKey);

    const {
        expenses: needs,
        addExpense: addNeed,
        updateExpense: updateNeed,
        deleteExpense: deleteNeed,
        totalBudget: needsBudget,
        totalActual: needsActual,
    } = useExpenses(monthKey, "need");

    const {
        expenses: wants,
        addExpense: addWant,
        updateExpense: updateWant,
        deleteExpense: deleteWant,
        totalBudget: wantsBudget,
        totalActual: wantsActual,
    } = useExpenses(monthKey, "want");

    const {
        savings,
        addSaving,
        updateSaving,
        deleteSaving,
        totalSaved,
    } = useSavings(monthKey);

    const {
        debt,
        addDebt,
        updateDebt,
        deleteDebt,
        totalOutstanding: totalBalance,
        totalPaid,
    } = useDebt(monthKey);

    // ================= CALCULATIONS =================
    const safe = (n) => Number(n || 0);

    const totalIncome = safe(income.totalActual);
    const totalSpent =
        safe(needsActual) +
        safe(wantsActual) +
        safe(totalSaved) +
        safe(totalPaid);

    const availableBalance = totalIncome - totalSpent;
    const outstandingDebt = Math.max(totalBalance - totalPaid, 0);

    const netWorth =
        totalIncome + totalSaved - outstandingDebt;

    const incomeAllocatedPct =
        totalIncome > 0
            ? Math.round((totalSpent / totalIncome) * 100)
            : 0;

    const kpis = {
        totalIncome,
        totalSpent,
        availableBalance,
        needsActual,
        wantsActual,
        totalSavings: totalSaved,
        totalDebt: outstandingDebt,
        netWorth,
        incomeAllocatedPct,
    };

    const user = useAuthUser();
    const navigate = useNavigate();

    // ================= UI =================
    return (
        <div className="min-h-screen flex justify-center relative overflow-hidden">

            {/* COPY MODAL */}
            {showCopyModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-8 w-96 text-center shadow-xl">
                        <h3 className="font-semibold mb-4">
                            Copy previous month data?
                        </h3>

                        <p className="text-sm text-gray-500 mb-6">
                            Do you want to copy income, expenses, savings and debt
                            from last month?
                        </p>

                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={skipCopy}
                                className="px-4 py-2 rounded-lg border"
                            >
                                No
                            </button>

                            <button
                                onClick={confirmCopy}
                                className="px-4 py-2 rounded-lg bg-blue-600 text-white"
                            >
                                Yes, copy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-10 w-full max-w-7xl px-8 py-10 space-y-10">

                {/* ================= HEADER ================= */}
                <header className="flex items-center justify-between">

                    <span className="text-xl font-bold text-blue-500 cursor-pointer">
                        exPtrack
                    </span>

                    <div className="flex items-center gap-3 text-sm">

                        <button onClick={prevMonth} className="h-7 w-7 border rounded">
                            ‹
                        </button>

                        <span className="font-medium min-w-20 text-center">
                            {MONTHS[monthIndex]}
                        </span>

                        <button onClick={nextMonth} className="h-7 w-7 border rounded">
                            ›
                        </button>

                        <button
                            onClick={() =>
                                exportPdf(`exptrack-${MONTHS[monthIndex]}-${YEAR}.pdf`)
                            }
                            className="ml-3 px-4 py-2 rounded-md border"
                        >
                            Export PDF
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm">
                            Hi, <strong>{user?.name}</strong>
                        </span>
                        <ProfileMenu user={user} />
                    </div>
                </header>

                {/* INCOME */}
                <IncomeCard {...income} />

                {/* KPI */}
                <KPIOverview
                    totalIncome={totalIncome}
                    needsBudget={needsBudget}
                    needsActual={needsActual}
                    wantsActual={wantsActual}
                    totalSavings={totalSaved}
                    debtPaid={totalPaid}
                    totalDebt={outstandingDebt}
                />

                {/* NEEDS + WANTS */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <NeedsCard {...{ needs, addNeed, updateNeed, deleteNeed, totalBudget: needsBudget, totalActual: needsActual }} />
                    <WantsCard {...{ wants, addWant, updateWant, deleteWant, totalBudget: wantsBudget, totalActual: wantsActual }} />
                </div>

                {/* SAVINGS + DEBT */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <SavingsCard {...{ savings, addSaving, updateSaving, deleteSaving, totalSaved }} />
                    <DebtCard {...{ debt, addDebt, updateDebt, deleteDebt, totalBalance, totalPaid }} />
                </div>

                {/* PDF */}
                <div className="hidden">
                    <ReportView
                        month={MONTHS[monthIndex]}
                        year={YEAR}
                        user={user?.name}
                        income={income.income}
                        needs={needs}
                        wants={wants}
                        savings={savings}
                        debt={debt}
                        kpis={kpis}
                    />
                </div>
                {toast && (
                    <div className="
                        fixed bottom-6 right-6
                        bg-green-600 text-white
                        px-5 py-3 rounded-xl
                        shadow-xl
                        text-sm font-medium
                        animate-slideIn
                    ">
                        {toast}
                    </div>
                )}
            </div>
        </div>
    );
}
