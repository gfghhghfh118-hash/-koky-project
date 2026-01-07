"use client";

import { exchangeToAdBalance } from "@/actions/finance";
import { useState, useRef, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRightLeft, AlertTriangle, X, ShieldAlert, Sparkles, ChevronRight, CheckCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

function SubmitButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={pending || disabled}
            className="btn-gradient px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest disabled:opacity-50 transition-all shadow-blue-500/20 active:scale-95"
        >
            {pending ? "Processing..." : "Transfer Funds"}
        </button>
    );
}

export default function AdBalanceExchange({ userBalance }: { userBalance: number }) {
    const [amount, setAmount] = useState(1.0);
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    const [skipConfirm, setSkipConfirm] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("skipAdExchangeConfirm");
        if (saved) {
            setSkipConfirm(true);
        }
    }, []);

    async function executeTransfer() {
        if (!skipConfirm) {
            localStorage.setItem("skipAdExchangeConfirm", "true");
            setSkipConfirm(true);
        }
        setShowModal(false);
        const res = await exchangeToAdBalance(amount);
        if (res?.error) setMessage({ error: res.error });
        if (res?.success) {
            setMessage({ success: res.success });
            setAmount(0);
        }
    }

    const handleTransferClick = () => {
        if (skipConfirm) {
            executeTransfer();
        } else {
            setShowModal(true);
        }
    };

    return (
        <div className="relative overflow-hidden rounded-3xl border border-white/20 dark:border-slate-800/30 bg-white/40 dark:bg-slate-900/10 p-6 backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                            <Sparkles size={16} />
                        </div>
                        <h3 className="font-black text-slate-900 dark:text-white tracking-tight">Instant Fund Conversion</h3>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md">
                        Move your earnings to your Advertising Balance instantly and get a <span className="text-primary font-bold">10% Global Bonus</span> on all first-time transfers today.
                    </p>
                </div>

                <form ref={formRef} className="flex flex-col sm:flex-row gap-4 items-end bg-white/50 dark:bg-slate-950/30 p-4 rounded-2xl border border-white/40 dark:border-slate-800/20 shadow-inner">
                    <div className="w-full sm:w-40">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 px-1">Amount ($)</label>
                        <div className="relative group">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">$</span>
                            <input
                                type="number"
                                name="amount"
                                step="0.01"
                                min="0.1"
                                max={userBalance}
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value))}
                                className="w-full pl-7 pr-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-black outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all tabular-nums text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <SubmitButton onClick={handleTransferClick} disabled={amount <= 0 || amount > userBalance} />
                </form>
            </div>

            {message?.error && (
                <div className="mt-4 flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest bg-rose-500/5 p-2 rounded-lg border border-rose-500/10">
                    <ShieldAlert size={14} /> {message.error}
                </div>
            )}

            {message?.success && (
                <div className="mt-4 flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-500/5 p-2 rounded-lg border border-emerald-500/10 animate-in fade-in slide-in-from-top-1">
                    <CheckCircle size={14} /> {message.success}
                </div>
            )}

            {/* CONFIRMATION MODAL - Simple Design */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-white/10 relative animate-in zoom-in-95 duration-200">
                        <div className="text-center" dir="rtl">
                            <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-white">تأكيد التحويل</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
                                هل أنت متأكد من تحويل <span className="font-bold">${amount.toFixed(2)}</span> إلى رصيد الإعلانات؟<br />
                                <span className="text-xs text-red-500 mt-1 block font-bold">لا يمكن التراجع عن هذه العملية.</span>
                            </p>

                            <div className="flex gap-3 justify-center">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={executeTransfer}
                                    className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
                                >
                                    موافق، تنفيذ العملية
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
