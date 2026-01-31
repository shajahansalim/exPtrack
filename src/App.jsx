import { useState, useEffect } from "react";
import KPIOverview from "./components/KPIOverview";
import NeedsCard from "./components/NeedsCard";
import WantsCard from "./components/WantsCard";
import IncomeCard from "./components/IncomeCard";
import SavingsCard from "./components/SavingsCard";
import DebtCard from "./components/DebtCard";
import ReportView from "./components/ReportView";
import { exportPdf } from "./utils/exportPdf";

import { useIncome } from "./hooks/useIncome";
import { useNeeds } from "./hooks/useNeeds";
import { useWants } from "./hooks/useWants";
import { useSavings } from "./hooks/useSavings";
import { useDebt } from "./hooks/useDebt";

export default function App() {
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

  const prevMonth = () =>
    setMonthIndex((i) => (i === 0 ? 11 : i - 1));

  const nextMonth = () =>
    setMonthIndex((i) => (i === 11 ? 0 : i + 1));

  // ================= HOOKS (MONTH-SCOPED) =================
  const income = useIncome(monthKey);

  const {
    needs,
    addNeed,
    updateNeed,
    deleteNeed,
    totalBudget: needsBudget,
    totalActual: needsActual,
  } = useNeeds(monthKey);

  const {
    wants,
    addWant,
    updateWant,
    deleteWant,
    totalBudget: wantsBudget,
    totalActual: wantsActual,
  } = useWants(monthKey);

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
    totalBalance,
    totalPaid,
  } = useDebt(monthKey);

  // ================= CALCULATIONS =================
  const totalIncome = income.totalActual || 0;

  /**
   * IMPORTANT LOGIC (as requested):
   * Available balance MUST include savings spend
   * Debt affects balance ONLY via paid amount (monthly cash flow)
   */
  const totalSpent =
    needsActual +
    wantsActual +
    totalSaved +   // savings treated as spending
    totalPaid;     // debt EMI / payment only

  const availableBalance = totalIncome - totalSpent;

  const outstandingDebt = Math.max(totalBalance - totalPaid, 0);

  const netWorth =
    totalIncome + totalSaved - outstandingDebt;

  const incomeAllocatedPct =
    totalIncome > 0
      ? Math.round((totalSpent / totalIncome) * 100)
      : 0;

  // KPI object for PDF
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

  // ================= UI =================
  return (
    <div className="min-h-screen flex justify-center relative overflow-hidden">
      {/* background */}
      <div
        className="absolute inset-0 z-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.06) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl px-8 py-10 space-y-10">
        {/* ================= HEADER ================= */}
        <header className="flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-500 text-white flex items-center justify-center font-semibold">
              ex
            </div>
            <span className="text-lg font-semibold text-gray-900">
              exPtrack
            </span>

          </div>

          {/* Month switcher */}
          <div className="hidden md:flex items-center gap-3 text-sm">
            <span className="text-gray-400">Dashboard</span>
            <span className="text-gray-300">/</span>

            <button
              onClick={prevMonth}
              className="h-7 w-7 rounded-md border flex items-center justify-center"
            >
              ‹
            </button>

            <span className="font-medium min-w-20 text-center">
              {MONTHS[monthIndex]}
            </span>

            <button
              onClick={nextMonth}
              className="h-7 w-7 rounded-md border flex items-center justify-center"
            >
              ›
            </button>

            <button
              onClick={() =>
                exportPdf(
                  `exptrack-${MONTHS[monthIndex]}-${YEAR}.pdf`
                )
              }
              className="ml-3 text-sm font-medium px-4 py-2 rounded-md border hover:bg-gray-100"
            >
              Export PDF
            </button>
          </div>

          {/* User */}
          <div className="flex items-center gap-3">
            <span className="text-sm">
              Hi, <strong>Shajahan S</strong>
            </span>
            <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold">
              SJ
            </div>
          </div>
        </header>

        {/* ================= INCOME ================= */}
        <IncomeCard
          income={income.income}
          onAdd={income.addIncome}
          onUpdate={income.updateIncome}
          onDelete={income.deleteIncome}
          totalExpected={income.totalExpected}
          totalActual={income.totalActual}
        />

        {/* ================= KPI ================= */}
        <KPIOverview
          totalIncome={totalIncome}
          availableBalance={availableBalance}
          needsBudget={needsBudget}
          needsActual={needsActual}
          wantsActual={wantsActual}
          incomeAllocatedPct={incomeAllocatedPct}
          totalSavings={totalSaved}
          totalDebt={outstandingDebt}
          netWorth={netWorth}
        />

        {/* ================= NEEDS + WANTS ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NeedsCard
            needs={needs}
            addNeed={addNeed}
            updateNeed={updateNeed}
            deleteNeed={deleteNeed}
            totalBudget={needsBudget}
            totalActual={needsActual}
          />

          <WantsCard
            wants={wants}
            addWant={addWant}
            updateWant={updateWant}
            deleteWant={deleteWant}
            totalBudget={wantsBudget}
            totalActual={wantsActual}
          />
        </div>

        {/* ================= SAVINGS + DEBT ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SavingsCard
            savings={savings}
            addSaving={addSaving}
            updateSaving={updateSaving}
            deleteSaving={deleteSaving}
            totalSaved={totalSaved}
          />

          <DebtCard
            debt={debt}
            addDebt={addDebt}
            updateDebt={updateDebt}
            deleteDebt={deleteDebt}
            totalBalance={totalBalance}
            totalPaid={totalPaid}
          />
        </div>

        {/* ================= PDF ROOT ================= */}
        <div
          style={{
            position: "fixed",
            top: "-10000px",
            left: "-10000px",
            width: "800px",
            background: "white",
          }}
        >
          <div id="pdf-root">

            <ReportView
              month={MONTHS[monthIndex]}
              year={YEAR}
              user="Shajahan S"
              income={income.income}
              needs={needs}
              wants={wants}
              savings={savings}
              debt={debt}
              kpis={kpis}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
