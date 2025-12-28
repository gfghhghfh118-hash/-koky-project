"use client";

import { exchangeToAdBalance } from "@/actions/finance";
import { useState, useRef } from "react";
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

    async function handleConfirm() {
        setShowModal(false);
        const res = await exchangeToAdBalance(amount);
        if (res?.error) setMessage({ error: res.error });
        if (res?.success) {
            setMessage({ success: res.success });
            setAmount(0);
        }
    }

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
                    <SubmitButton onClick={() => setShowModal(true)} disabled={amount <= 0 || amount > userBalance} />
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

            {/* CONFIRMATION MODAL - Premium Redesign */}
            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl p-4 animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] max-w-md w-full p-8 relative animate-in zoom-in-95 duration-300 border border-white/20 dark:border-slate-800/50">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 rounded-[2rem] bg-amber-500/10 text-amber-500 flex items-center justify-center mb-6 shadow-inner ring-8 ring-amber-500/5 animate-pulse">
                                <AlertTriangle size={40} strokeWidth={2.5} />
                            </div>

                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Security Checkpoint</h3>
                            <p className="text-slate-500 text-sm font-medium mb-8">
                                You are transferring <span className="text-slate-900 dark:text-white font-black px-1.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 tabular-nums">${amount.toFixed(2)}</span> to your Advertising Assets.
                            </p>

                            <div className="w-full space-y-3 mb-8">
                                <div className="p-4 rounded-3xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800/50 text-left">
                                    <div className="flex items-start gap-3 text-slate-600 dark:text-slate-400 text-xs font-bold leading-relaxed mb-4">
                                        <div className="p-1 rounded-full bg-slate-200 dark:bg-slate-800 mt-0.5"><Info size={10} /></div>
                                        <span>Advertising funds are non-refundable and dedicated solely for campaign distribution.</span>
                                    </div>

                                    <div className="flex justify-between items-center px-1">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Network Fee (1%)</div>
                                        <div className="text-xs font-black text-rose-500 tabular-nums">-${(amount * 0.01).toFixed(4)}</div>
                                    </div>

                                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-3" />

                                    <div className="flex justify-between items-center px-1">
                                        <div className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-widest">Net Credit</div>
                                        <div className="text-xl font-black text-primary tabular-nums">${(amount * 0.99).toFixed(4)}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="py-4 px-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-black text-xs uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="btn-gradient py-4 px-6 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-500/25 active:scale-95 border border-white/20"
                                >
                                    Confirm Transfer
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
