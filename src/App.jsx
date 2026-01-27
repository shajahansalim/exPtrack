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

  const incomeAllocatedPct =
    totalIncome > 0
      ? Math.round((totalSpent / totalIncome) * 100)
      : 0;

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
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
          totalIncome={totalIncome}
          availableBalance={availableBalance}
          needsBudget={needsBudget}
          needsActual={needsActual}
          wantsActual={wantsActual}
          incomeAllocatedPct={incomeAllocatedPct}
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

        {/* ================= INCOME ================= */}
        <IncomeCard
          income={income.income}
          onUpdate={income.updateIncome}
          onAdd={income.addIncome}
          onDelete={income.deleteIncome}
          totalExpected={income.totalExpected}
          totalActual={income.totalActual}
        />

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
