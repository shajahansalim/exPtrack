import { formatINR } from "../utils/money";

export default function SavingsCard({
    savings,
    totalSaved,
}) {
    return (
        <section className="bg-white border rounded-xl p-6">
            <h2 className="font-semibold">Savings</h2>
            <p className="text-sm text-slate-500 mt-1">
                Funds set aside
            </p>

            <div className="mt-6 space-y-3">
                {savings.map((s) => (
                    <div
                        key={s.id}
                        className="flex justify-between text-sm"
                    >
                        <span>{s.name}</span>
                        <span className="font-medium">
                            {formatINR(s.saved)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t flex justify-between text-sm">
                <span className="text-slate-500">Total saved</span>
                <span className="font-semibold">
                    {formatINR(totalSaved)}
                </span>
            </div>
        </section>
    );
}
