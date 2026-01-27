import { useState } from "react";
import KPIOverview from "./components/KPIOverview";
import NeedsCard from "./components/NeedsCard";
import WantsCard from "./components/WantsCard";
import IncomeCard from "./components/IncomeCard";
import SavingsCard from "./components/SavingsCard";
import DebtCard from "./components/DebtCard";

import { useIncome } from "./hooks/useIncome";
import { useNeeds } from "./hooks/useNeeds";
import { useWants } from "./hooks/useWants";
import { useSavings } from "./hooks/useSavings";
import { useDebt } from "./hooks/useDebt";

export default function App() {

  // ================= MONTH SELECTOR =================
  const MONTHS = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const [monthIndex, setMonthIndex] = useState(0); // January

  const prevMonth = () => {
    setMonthIndex((i) => (i === 0 ? 11 : i - 1));
  };

  const nextMonth = () => {
    setMonthIndex((i) => (i === 11 ? 0 : i + 1));
  };

  // ================= INCOME =================
  const income = useIncome();

  // ================= NEEDS =================
  const {
    needs,
    addNeed,
    updateNeed,
    deleteNeed,
    totalBudget: needsBudget,
    totalActual: needsActual,
  } = useNeeds();

  // ================= WANTS =================
  const {
    wants,
    addWant,
    updateWant,
    deleteWant,
    totalBudget: wantsBudget,
    totalActual: wantsActual,
  } = useWants();

  // ================= SAVINGS =================
  const {
    savings,
    addSaving,
    updateSaving,
    deleteSaving,
    totalSaved,
  } = useSavings();

  // ================= DEBT =================
  const {
    debt,
    addDebt,
    updateDebt,
    deleteDebt,
    totalBalance,
    totalPaid,
  } = useDebt();

  // ================= DERIVED KPI VALUES =================
  const totalIncome = income.totalActual || 0;
  const totalSpent = needsActual + wantsActual;
  const availableBalance = totalIncome - totalSpent;

  const totalSavings = totalSaved || 0;
  const outstandingDebt = Math.max(totalBalance - totalPaid, 0);

  const netWorth =
    totalIncome + totalSavings - outstandingDebt;

  const netWorthStatus =
    netWorth >= 0 ? "Healthy" : "Needs attention";

  const incomeAllocatedPct =
    totalIncome > 0
      ? Math.round((totalSpent / totalIncome) * 100)
      : 0;
  // ================= UI =================
  return (
    <div className="min-h-screen  flex justify-center relative overflow-hidden">
      <div
        className="absolute  pointer-events-none z-0 inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(15,23,42,0.06) 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="w-full max-w-7xl px-8 py-10 space-y-10">
        {/* ================= HEADER ================= */}
        <header className="flex items-center justify-between">
          {/* LEFT: Brand */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div className="h-9 w-9 rounded-lg bg-slate-900 text-white flex items-center justify-center font-semibold">
              ex
            </div>

            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                exPtrack
              </h1>
              <p className="text-xs text-gray-500">
                Smart expense & budget tracking
              </p>
            </div>
          </div>

          {/* CENTER: Page context */}
          <div className="hidden md:flex items-center gap-3 text-sm">
            <span className="text-gray-400">Dashboard</span>

            <span className="text-gray-300">/</span>

            <button
              onClick={prevMonth}
              className="h-7 w-7 rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
              aria-label="Previous month"
            >
              ‹
            </button>

            <span className="font-medium text-gray-900 min-w-27.5 text-center">
              {MONTHS[monthIndex]}
            </span>

            <button
              onClick={nextMonth}
              className="h-7 w-7 rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          {/* RIGHT: Auth actions */}
          <div className="flex items-center gap-3">
            <button className="text-sm text-gray-600 hover:text-gray-900">
              Login
            </button>

            <button className="text-sm font-medium px-4 py-2 rounded-md bg-slate-900 text-white hover:bg-slate-800">
              Get started
            </button>
          </div>
        </header>

        {/* ================= INCOME ================= */}
        <IncomeCard
          income={income.income}
          onUpdate={income.updateIncome}
          onAdd={income.addIncome}
          onDelete={income.deleteIncome}
          totalExpected={income.totalExpected}
          totalActual={income.totalActual}
        />

        {/* ================= KPI OVERVIEW ================= */}
        <KPIOverview
          totalIncome={totalIncome}
          availableBalance={availableBalance}
          needsBudget={needsBudget}
          needsActual={needsActual}
          wantsActual={wantsActual}
          incomeAllocatedPct={incomeAllocatedPct}
          netWorth={netWorth}
          netWorthStatus={netWorthStatus}
          totalDebt={outstandingDebt}
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



      </div>
    </div>
  );
}
