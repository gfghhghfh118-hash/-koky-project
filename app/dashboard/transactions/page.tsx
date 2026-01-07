import { auth } from "@/auth";
import { db } from "@/lib/db";
import { getTranslation } from "@/lib/i18n/server";
import { CheckCircle, Clock, XCircle, ShieldCheck, ArrowUpRight, ArrowDownLeft, Search } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function TransactionsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const t = await getTranslation();

    const transactions = await db.transaction.findMany({
        where: { userId: session.user.id },
        orderBy: { timestamp: "desc" }
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Transaction History
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">
                        Track all your deposits, withdrawals, and financial activities.
                    </p>
                </div>
            </div>

            {/* Transactions Table Card */}
            <div className="premium-card p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-lg">
                            <Clock size={16} className="text-slate-500" />
                        </div>
                        <span className="font-bold text-sm text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                            All Transactions ({transactions.length})
                        </span>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-800">
                            <tr>
                                <th className="px-6 py-4 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Transaction ID</th>
                                <th className="px-6 py-4 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Type</th>
                                <th className="px-6 py-4 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Method & Wallet</th>
                                <th className="px-6 py-4 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Date</th>
                                <th className="px-6 py-4 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Status</th>
                                <th className="px-6 py-4 font-black text-slate-400 text-[10px] uppercase tracking-[0.2em] text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {transactions.map((tx) => (
                                <tr key={tx.id} className="group hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="font-mono text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded w-fit select-all">
                                            {tx.txId || tx.id.slice(0, 8)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            {tx.type === "DEPOSIT" ? (
                                                <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-md">
                                                    <ArrowDownLeft size={14} />
                                                </div>
                                            ) : (
                                                <div className="p-1.5 bg-rose-100 text-rose-600 rounded-md">
                                                    <ArrowUpRight size={14} />
                                                </div>
                                            )}
                                            <span className="font-bold text-slate-700 dark:text-slate-300">
                                                {tx.type === "DEPOSIT" ? "Deposit" : "Withdrawal"}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-xs text-slate-700 dark:text-slate-300">{tx.method}</span>
                                            {/* Show Wallet Address: Sender for Deposit, Receiver for Withdrawal */}
                                            <span className="text-[10px] text-slate-400 font-mono mt-0.5 select-all">
                                                {tx.type === "DEPOSIT"
                                                    ? (tx.senderWallet ? `From: ${tx.senderWallet}` : "Info not provided")
                                                    : (tx.wallet ? `To: ${tx.wallet}` : "Info not provided")
                                                }
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-500 text-xs font-medium">
                                        {new Date(tx.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${tx.status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                                tx.status === "REJECTED" ? "bg-rose-50 text-rose-600 border-rose-100" :
                                                    "bg-amber-50 text-amber-600 border-amber-100"
                                            }`}>
                                            {tx.status === "COMPLETED" && <CheckCircle size={10} />}
                                            {tx.status === "REJECTED" && <XCircle size={10} />}
                                            {tx.status === "PENDING" && <Clock size={10} />}
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-5 text-right font-black tabular-nums ${tx.type === "DEPOSIT" ? "text-emerald-600" : "text-rose-600"
                                        }`}>
                                        {tx.type === "DEPOSIT" ? "+" : "-"}${tx.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}

                            {transactions.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-slate-400">
                                        <div className="flex flex-col items-center gap-4 opacity-50">
                                            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full">
                                                <Search size={32} />
                                            </div>
                                            <p className="font-bold text-xs uppercase tracking-widest">No transactions found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
