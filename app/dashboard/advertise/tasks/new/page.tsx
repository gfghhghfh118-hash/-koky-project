"use client";

import { createGeneralTaskCampaign } from "@/actions/advertise";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Briefcase, ShieldCheck, UserCheck, Bot, Link as LinkIcon, AlertCircle, CheckCircle2, PlusSquare, Zap, Sparkles, ChevronRight, Layout, Info } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

function SubmitButton() {
    const { pending } = useFormStatus();
    const { t } = useLanguage();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full btn-gradient p-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-blue-500/25 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group border border-white/20"
        >
            {pending ? (
                <>
                    <Loader2 className="animate-spin" size={20} />
                    {t("advertise_tasks.submitting")}
                </>
            ) : (
                <>
                    <Zap size={20} className="group-hover:scale-125 transition-transform text-white" />
                    {t("advertise_tasks.submit")}
                </>
            )}
        </button>
    );
}

const Loader2 = ({ className, size }: { className?: string; size?: number }) => (
    <div className={cn("border-2 border-white/30 border-t-white rounded-full animate-spin", className)} style={{ width: size, height: size }} />
);

export default function NewGeneralTaskCampaign() {
    const { t, language } = useLanguage();
    const [reward, setReward] = useState(0.05);
    const [executions, setExecutions] = useState(100);
    const [approvalType, setApprovalType] = useState("MANUAL"); // MANUAL or AUTO
    const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const totalCost = (reward * executions).toFixed(3);
    const isAr = language === "ar";

    async function clientAction(formData: FormData) {
        setMessage(null);
        const res = await createGeneralTaskCampaign(formData);
        if (res?.error) setMessage({ error: res.error });
        if (res?.success) {
            setMessage({ success: res.success });
            setIsRedirecting(true);
            setTimeout(() => {
                window.location.href = "/dashboard/advertise";
            }, 2000);
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-6 px-4 md:px-0 animate-in fade-in slide-in-from-bottom-6 duration-1000" dir={isAr ? "rtl" : "ltr"}>
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] px-2.5 py-1 rounded-full border border-amber-500/20">Task Architect</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        General <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-400">Task</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium max-w-lg">
                        {isAr ? "قم بإطلاق حملة إعلانية جديدة واحصل على نتائج حقيقية من مئات المحترفين." : "Launch a precision campaign and get real results from micro-workers worldwide."}
                    </p>
                </div>

                <div className="hidden lg:flex items-center gap-3 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-950 text-amber-500">
                        <Briefcase size={20} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Worker Matrix</div>
                        <div className="text-xs font-black text-slate-900 dark:text-white">High Priority Routing</div>
                    </div>
                </div>
            </div>

            <form action={clientAction} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Form Inputs */}
                <div className="lg:col-span-7 space-y-8">
                    {message?.error && (
                        <div className="bg-rose-500/5 text-rose-500 p-5 rounded-[2rem] text-xs border border-rose-500/10 flex items-center gap-4 animate-in zoom-in-95 font-black uppercase tracking-widest">
                            <AlertCircle size={20} strokeWidth={2.5} />
                            {message.error}
                        </div>
                    )}
                    {message?.success && (
                        <div className="bg-emerald-500/5 text-emerald-500 p-5 rounded-[2rem] text-xs border border-emerald-500/10 flex items-center gap-4 animate-in zoom-in-95 font-black uppercase tracking-widest">
                            <CheckCircle2 size={20} strokeWidth={2.5} />
                            {message.success}
                        </div>
                    )}

                    <div className="premium-card p-8 space-y-8">
                        {/* Title */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                <Sparkles size={12} className="text-amber-500" /> {t("advertise_tasks.task_title")}
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-amber-500/50 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-bold"
                                placeholder={t("advertise_tasks.task_title_placeholder")}
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                <Layout size={12} className="text-amber-500" /> {t("advertise_tasks.description")}
                            </label>
                            <textarea
                                name="description"
                                required
                                rows={4}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-amber-500/50 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-medium text-sm resize-none"
                                placeholder={t("advertise_tasks.description_placeholder")}
                            />
                        </div>

                        {/* URL */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                <LinkIcon size={12} className="text-amber-500" /> {t("advertise_tasks.target_link")}
                            </label>
                            <div className="relative group">
                                <div className={cn("absolute top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-amber-500 transition-colors", isAr ? 'right-4' : 'left-4')}>
                                    <LinkIcon size={18} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="url"
                                    name="url"
                                    required
                                    className={cn("w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-amber-500/50 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-bold", isAr ? 'pr-12' : 'pl-12')}
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="premium-card p-4 bg-slate-50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-2">
                            {t("advertise_tasks.verification_method")}
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div
                                onClick={() => setApprovalType("MANUAL")}
                                className={cn(
                                    "relative p-5 rounded-3xl border transition-all cursor-pointer group overflow-hidden",
                                    approvalType === 'MANUAL'
                                        ? 'bg-white dark:bg-slate-900 border-amber-500/50 shadow-xl shadow-amber-500/5'
                                        : 'bg-transparent border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                )}
                            >
                                <input type="radio" name="approvalType" value="MANUAL" checked={approvalType === "MANUAL"} readOnly className="sr-only" />
                                <div className="flex items-start gap-4 relative z-10">
                                    <div className={cn("p-2 rounded-xl transition-colors", approvalType === 'MANUAL' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400')}>
                                        <UserCheck size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{t("advertise_tasks.manual_review")}</div>
                                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">{t("advertise_tasks.manual_review_desc")}</p>
                                    </div>
                                </div>
                            </div>

                            <div
                                onClick={() => setApprovalType("AUTO")}
                                className={cn(
                                    "relative p-5 rounded-3xl border transition-all cursor-pointer group overflow-hidden",
                                    approvalType === 'AUTO'
                                        ? 'bg-white dark:bg-slate-900 border-emerald-500/50 shadow-xl shadow-emerald-500/5'
                                        : 'bg-transparent border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                                )}
                            >
                                <input type="radio" name="approvalType" value="AUTO" checked={approvalType === "AUTO"} readOnly className="sr-only" />
                                <div className="flex items-start gap-4 relative z-10">
                                    <div className={cn("p-2 rounded-xl transition-colors", approvalType === 'AUTO' ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400')}>
                                        <Bot size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{t("advertise_tasks.auto_approval")}</div>
                                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed mt-1">{t("advertise_tasks.auto_approval_desc")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {approvalType === "AUTO" && (
                            <div className="mt-6 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 animate-in slide-in-from-top-4">
                                <label className="block text-[11px] font-black text-emerald-600 dark:text-emerald-400 mb-3 px-1 uppercase tracking-widest">
                                    {t("advertise_tasks.secret_answer")}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="validationAnswer"
                                        required={approvalType === "AUTO"}
                                        className="w-full p-4 bg-white dark:bg-slate-950 border border-emerald-200 dark:border-emerald-900 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all text-sm font-black tracking-widest"
                                        placeholder={t("advertise_tasks.secret_answer_placeholder")}
                                    />
                                    <ShieldCheck size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                                </div>
                                <p className="text-[10px] text-emerald-600/70 mt-3 font-bold flex items-center gap-2">
                                    <Info size={12} /> {t("advertise_tasks.secret_answer_note")}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary & Checkout Sidebar */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-slate-950 rounded-[3rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-amber-500/10">
                        {/* Abstract background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-orange-600/10 blur-[80px] -ml-20 -mb-20 rounded-full" />

                        <div className="relative z-10 space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-500">
                                    <Sparkles size={24} strokeWidth={2.5} />
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Project Budgeting</div>
                                    <div className="text-xs font-black text-amber-400">Flexi-Tier 1</div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("advertise_tasks.reward")}</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black">$</span>
                                        <input
                                            type="number"
                                            name="reward"
                                            step="0.001"
                                            min="0.01"
                                            className="w-full pl-8 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-amber-500 transition-all font-black tabular-nums text-xl"
                                            value={reward}
                                            onChange={(e) => setReward(parseFloat(e.target.value) || 0)}
                                        />
                                    </div>
                                    <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">{t("advertise_tasks.min_reward")}</div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t("advertise_tasks.executions")}</label>
                                    <input
                                        type="number"
                                        name="executions"
                                        min="10"
                                        className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-amber-500 transition-all font-black tabular-nums text-xl"
                                        value={executions}
                                        onChange={(e) => setExecutions(parseInt(e.target.value) || 0)}
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="text-[10px] font-black text-amber-400 uppercase tracking-[0.3em]">{t("advertise_tasks.summary_total")}</div>
                                <div className="text-6xl font-black tabular-nums tracking-tighter flex items-start gap-1">
                                    <span className="text-2xl mt-2 text-slate-500">$</span>
                                    {totalCost}
                                </div>

                                {/* Insufficient Funds Warning */}
                                {message?.error?.toLowerCase().includes("funds") && (
                                    <div className="mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px] font-bold space-y-3">
                                        <p className="flex items-center gap-2">
                                            <AlertCircle size={14} />
                                            {message.error}
                                        </p>
                                        <Link
                                            href="/dashboard/deposit"
                                            className="block w-full text-center p-2.5 bg-rose-600 text-white rounded-xl hover:bg-rose-500 transition-colors uppercase tracking-[0.1em] font-black"
                                        >
                                            {t("dashboard.add_funds")}
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <SubmitButton />

                            <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest px-4 leading-relaxed">
                                Campaign will be reviewed by administrators before going live globally.
                            </p>
                        </div>
                    </div>

                    {/* Meta Tips */}
                    <div className="p-6 rounded-[2rem] bg-indigo-500/5 border border-indigo-500/10 space-y-4">
                        <div className="flex items-center gap-3 text-indigo-500">
                            <ShieldCheck size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">Quality Assurance</span>
                        </div>
                        <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                            Micro-tasks are the most effective way to scale operations. Ensure your instructions are crystal clear to avoid rejection disputes.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}

