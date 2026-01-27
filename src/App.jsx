import KPIOverview from "./components/KPIOverview";
import NeedsCard from "./components/NeedsCard";
import WantsCard from "./components/WantsCard";
import IncomeCard from "./components/IncomeCard";

import { useIncome } from "./hooks/useIncome";
import { useNeeds } from "./hooks/useNeeds";
import { useWants } from "./hooks/useWants";

export default function App() {
  const income = useIncome();
  const needs = useNeeds();
  const wants = useWants();

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-7xl px-8 py-10 space-y-10">
        {/* ================= HEADER ================= */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">
            Budget · January
          </h1>
          <p className="text-sm text-gray-500">
            Personal finance overview
          </p>
        </header>

        {/* ================= KPI OVERVIEW ================= */}
        <KPIOverview
          totalIncome={income.totalActual}
          needsBudget={needs.totalBudget}
          needsActual={needs.totalActual}
          wantsActual={wants.totalActual}
        />

        {/* ================= NEEDS + WANTS ROW ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <NeedsCard
            needs={needs.needs}
            onUpdate={needs.updateNeed}
            onAdd={needs.addNeed}
            onDelete={needs.deleteNeed}
            totalBudget={needs.totalBudget}
            totalActual={needs.totalActual}
          />

          <WantsCard
            wants={wants.wants}
            onUpdate={wants.updateWant}
            onAdd={wants.addWant}
            onDelete={wants.deleteWant}
            totalActual={wants.totalActual}
          />
        </div>

        {/* ================= INCOME (SECONDARY) ================= */}
        <IncomeCard
          income={income.income}
          onUpdate={income.updateIncome}
          onAdd={income.addIncome}
          totalExpected={income.totalExpected}
          totalActual={income.totalActual}
        />
      </div>
    </div>
  );
}
