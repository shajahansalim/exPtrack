import { formatINR } from "../utils/money";

export default function DebtCard({
    debt,
    totalBalance,
    totalPaid,
}) {
    return (
        <section className="bg-white border rounded-xl p-6">
            <h2 className="font-semibold">Debt</h2>
            <p className="text-sm text-slate-500 mt-1">
                Outstanding liabilities
            </p>

            <div className="mt-6 space-y-3">
                {debt.map((d) => (
                    <div
                        key={d.id}
                        className="flex justify-between text-sm"
                    >
                        <span>{d.name}</span>
                        <span className="font-medium">
                            {formatINR(d.balance - d.paid)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t flex justify-between text-sm">
                <span className="text-slate-500">Total debt</span>
                <span className="font-semibold">
                    {formatINR(totalBalance - totalPaid)}
                </span>
            </div>
        </section>
    );
}
