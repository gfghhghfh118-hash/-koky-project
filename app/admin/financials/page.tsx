"use client";

import { useEffect, useState } from "react";
import { approveTransaction, rejectTransaction, getPendingTransactions } from "@/actions/admin-finance";
import { Wallet, CheckCircle, XCircle, Clock, Search, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminFinancialsPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        setLoading(true);
        const data = await getPendingTransactions();
        setRequests(data);
        setLoading(false);
    };

    const handleAction = async (id: string, action: "approve" | "reject") => {
        setProcessingId(id);
        const res = action === "approve" ? await approveTransaction(id, "admin") : await rejectTransaction(id, "admin");
        if (res.success) {
            setRequests(requests.filter(r => r.id !== id));
        } else {
            alert(res.error);
        }
        setProcessingId(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        Financial <span className="text-emerald-500">Gateway</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">Review and process manual deposit and withdrawal requests.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={loadRequests}
                        className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
                        title="Refresh"
                    >
                        <Clock size={20} className={cn(loading && "animate-spin")} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="premium-card p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                    <h2 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Pending Authorization Requests ({requests.length})</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-900/10">
                            <tr>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">User / Identity</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Type / Method</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Amount</th>
                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {requests.map((request) => (
                                <tr key={request.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all group">
                                    <td className="px-6 py-5">
                                        <div>
                                            <div className="font-bold text-slate-900 dark:text-white uppercase text-xs">{request.user.username}</div>
                                            <div className="text-[10px] text-slate-400 font-medium">{request.user.email}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "p-2 rounded-lg",
                                                request.type === "DEPOSIT" ? "bg-emerald-500/10 text-emerald-600" : "bg-blue-500/10 text-blue-600"
                                            )}>
                                                {request.type === "DEPOSIT" ? <ArrowDownCircle size={16} /> : <ArrowUpCircle size={16} />}
                                            </div>
                                            <div>
                                                <div className="font-black text-[10px] uppercase tracking-wider">{request.type}</div>
                                                <div className="text-[10px] font-bold text-slate-400">
                                                    {request.method} • {request.type === "DEPOSIT" ? request.senderWallet : request.wallet}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="text-lg font-black text-slate-900 dark:text-white tabular-nums">
                                            {request.type === "DEPOSIT" ? "+" : "-"}${request.amount.toFixed(2)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleAction(request.id, "approve")}
                                                disabled={processingId === request.id}
                                                className="p-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                                title="Approve & Credit User"
                                            >
                                                <CheckCircle size={18} strokeWidth={2.5} />
                                            </button>
                                            <button
                                                onClick={() => handleAction(request.id, "reject")}
                                                disabled={processingId === request.id}
                                                className="p-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl shadow-lg shadow-rose-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                                                title="Reject Request"
                                            >
                                                <XCircle size={18} strokeWidth={2.5} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {requests.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4 opacity-30">
                                            <div className="p-5 rounded-[2rem] bg-slate-100 dark:bg-slate-800">
                                                <Search size={40} />
                                            </div>
                                            <div>
                                                <p className="font-black text-xs uppercase tracking-[0.2em] text-slate-900 dark:text-white">Inbox Clean</p>
                                                <p className="text-xs font-medium text-slate-500">No pending financial requests at the moment.</p>
                                            </div>
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
