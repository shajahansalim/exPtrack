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
import RecurringExpensesModal from "./components/RecurringExpensesModal";
import Navbar from "./components/Navbar";

import { exportPdf } from "./utils/exportPdf";
import { useAuthUser } from "./hooks/useAuthUser";

import { useIncome } from "./hooks/useIncome";
import { useExpenses } from "./hooks/useExpenses";
import { useSavings } from "./hooks/useSavings";
import { useDebt } from "./hooks/useDebt";

import { copyMonth } from "./api/month"; // ⭐ NEW API
import MonthCopyModal from "./components/MonthCopyModal";

export default function Dashboard() {

    // ================= MONTH SELECTOR =================
    const MONTHS = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December",
    ];

    const ACTIVE_MONTH_KEY = "active_month_index";
    const ACTIVE_YEAR_KEY = "active_year";

    const [monthIndex, setMonthIndex] = useState(() => {
        const saved = localStorage.getItem(ACTIVE_MONTH_KEY);
        return saved !== null ? Number(saved) : new Date().getMonth();
    });

    const [year, setYear] = useState(() => {
        const saved = localStorage.getItem(ACTIVE_YEAR_KEY);
        return saved !== null ? Number(saved) : new Date().getFullYear();
    });

    useEffect(() => {
        localStorage.setItem(ACTIVE_MONTH_KEY, monthIndex);
    }, [monthIndex]);

    useEffect(() => {
        localStorage.setItem(ACTIVE_YEAR_KEY, String(year));
    }, [year]);

    const monthKey = `${year}-${String(monthIndex + 1).padStart(2, "0")}`;

    // ================= COPY MODAL & NAV STATE =================
    const [showCopyModal, setShowCopyModal] = useState(false);
    const [nextIndex, setNextIndex] = useState(null);
    const [nextYear, setNextYear] = useState(null);
    const [nextMonthKey, setNextMonthKey] = useState(null);
    const [toast, setToast] = useState("");
    const [isExporting, setIsExporting] = useState(false);
    const [nextMonthData, setNextMonthData] = useState({
        hasIncome: false,
        hasNeeds: false,
        hasWants: false,
        hasSavings: false,
        hasDebt: false,
    });

    // Month/year picker for direct navigation
    const [pickerMonth, setPickerMonth] = useState(monthIndex);
    const [pickerYear, setPickerYear] = useState(year);
    const [showRecurringModal, setShowRecurringModal] = useState(false);

    // Keep picker in sync with active month/year
    useEffect(() => {
        setPickerMonth(monthIndex);
        setPickerYear(year);
    }, [monthIndex, year]);

    const prevMonth = () => {
        setMonthIndex((i) => {
            if (i === 0) {
                // Go to December of previous year
                setYear((y) => y - 1);
                return 11;
            }
            return i - 1;
        });
    };

    const nextMonth = async () => {
        const isDecember = monthIndex === 11;
        const nextIdx = isDecember ? 0 : monthIndex + 1;
        const targetYear = isDecember ? year + 1 : year;
        const nextKey = `${targetYear}-${String(nextIdx + 1).padStart(2, "0")}`;

        try {
            // Check if next month has any data
            const [i, n, w, s, d] = await Promise.all([
                fetchIncome(nextKey),
                fetchExpenses(nextKey, "need"),
                fetchExpenses(nextKey, "want"),
                fetchSavings(nextKey),
                fetchDebt(nextKey),
            ]);

            const hasData =
                i.length || n.length || w.length || s.length || d.length;

            // If next month has no data, check if current month has data to copy
            // Use hook data for current month (already loaded)
            const currentHasData = income.income.length > 0 || 
                                   needs.length > 0 || 
                                   wants.length > 0 || 
                                   savings.length > 0 || 
                                   debt.length > 0;

            // If next month has no data and current month has data, show modal
            if (!hasData && currentHasData) {
                setNextIndex(nextIdx);
                setNextYear(targetYear);
                setNextMonthKey(nextKey);
                setNextMonthData({
                    hasIncome: income.income.length > 0,
                    hasNeeds: needs.length > 0,
                    hasWants: wants.length > 0,
                    hasSavings: savings.length > 0,
                    hasDebt: debt.length > 0,
                });
                setShowCopyModal(true);
            } else {
                // No data to copy, just switch months
                setMonthIndex(nextIdx);
                setYear(targetYear);
            }

        } catch (err) {
            console.error("Month switch failed:", err);
            setMonthIndex(nextIdx);
            setYear(targetYear);
        }
    };

    const handleConfirmCopy = async (selectedCategories) => {
        if (selectedCategories.length === 0) {
            setShowCopyModal(false);
            if (nextIndex !== null) {
                setMonthIndex(nextIndex);
                if (nextYear !== null) {
                    setYear(nextYear);
                }
            }
            return;
        }

        try {
            console.log("Copying categories:", selectedCategories);
            await copyMonth(monthKey, nextMonthKey, selectedCategories);
            setToast(`Copied ${selectedCategories.join(", ")} from previous month`);
            setTimeout(() => setToast(""), 3000);
            setShowCopyModal(false);
            if (nextIndex !== null) {
                setMonthIndex(nextIndex);
                if (nextYear !== null) {
                    setYear(nextYear);
                }
            }
        } catch (err) {
            console.error("Copy failed:", err);
            setToast("Failed to copy data. Please try again.");
            setTimeout(() => setToast(""), 3000);
        }
    };

    const handleCancelCopy = () => {
        setShowCopyModal(false);
        if (nextIndex !== null) {
            setMonthIndex(nextIndex);
            if (nextYear !== null) {
                setYear(nextYear);
            }
        }
    };

    const goToSelectedMonth = async () => {
        const targetIdx = Number(pickerMonth);
        const targetYr = Number(pickerYear) || year;

        if (
            Number.isNaN(targetIdx) ||
            targetIdx < 0 ||
            targetIdx > 11
        ) {
            return;
        }

        // If already on this month/year, do nothing
        if (targetIdx === monthIndex && targetYr === year) return;

        const targetKey = `${targetYr}-${String(targetIdx + 1).padStart(2, "0")}`;

        try {
            // Check if target month has any data
            const [i, n, w, s, d] = await Promise.all([
                fetchIncome(targetKey),
                fetchExpenses(targetKey, "need"),
                fetchExpenses(targetKey, "want"),
                fetchSavings(targetKey),
                fetchDebt(targetKey),
            ]);

            const hasData =
                i.length || n.length || w.length || s.length || d.length;

            const currentHasData = income.income.length > 0 ||
                needs.length > 0 ||
                wants.length > 0 ||
                savings.length > 0 ||
                debt.length > 0;

            if (!hasData && currentHasData) {
                // Offer to copy current month into target
                setNextIndex(targetIdx);
                setNextYear(targetYr);
                setNextMonthKey(targetKey);
                setNextMonthData({
                    hasIncome: income.income.length > 0,
                    hasNeeds: needs.length > 0,
                    hasWants: wants.length > 0,
                    hasSavings: savings.length > 0,
                    hasDebt: debt.length > 0,
                });
                setShowCopyModal(true);
            } else {
                // Just switch to target
                setMonthIndex(targetIdx);
                setYear(targetYr);
            }
        } catch (err) {
            console.error("Direct month switch failed:", err);
            setMonthIndex(targetIdx);
            setYear(targetYr);
        }
    };

    const formatMonthKey = (key) => {
        const [yr, month] = key.split("-");
        return `${MONTHS[parseInt(month) - 1]} ${yr}`;
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
            <MonthCopyModal
                open={showCopyModal}
                onConfirm={handleConfirmCopy}
                onCancel={handleCancelCopy}
                fromMonth={formatMonthKey(monthKey)}
                toMonth={nextMonthKey ? formatMonthKey(nextMonthKey) : ""}
                hasIncome={nextMonthData.hasIncome}
                hasNeeds={nextMonthData.hasNeeds}
                hasWants={nextMonthData.hasWants}
                hasSavings={nextMonthData.hasSavings}
                hasDebt={nextMonthData.hasDebt}
            />

            <RecurringExpensesModal
                open={showRecurringModal}
                onClose={() => setShowRecurringModal(false)}
            />

            <div className="relative z-10 w-full max-w-7xl px-8 py-10 space-y-10">

                {/* ================= NAVBAR ================= */}
                <Navbar
                    monthIndex={monthIndex}
                    year={year}
                    onPrevMonth={prevMonth}
                    onNextMonth={nextMonth}
                    pickerMonth={pickerMonth}
                    pickerYear={pickerYear}
                    onPickerMonthChange={setPickerMonth}
                    onPickerYearChange={setPickerYear}
                    onGoToSelectedMonth={goToSelectedMonth}
                    onExportPdf={async () => {
                        setIsExporting(true);
                        try {
                            await exportPdf(`exptrack-${MONTHS[monthIndex]}-${year}.pdf`);
                        } catch (error) {
                            console.error("Export error:", error);
                        } finally {
                            setIsExporting(false);
                        }
                    }}
                    isExporting={isExporting}
                    onRecurringBills={() => setShowRecurringModal(true)}
                    MONTHS={MONTHS}
                />

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

                {/* PDF - Hidden but accessible for export */}
                <div className="hidden">
                    <ReportView
                        month={MONTHS[monthIndex]}
                        year={year}
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
