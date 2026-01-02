"use client";

import { createSurfingCampaign } from "@/actions/advertise";
import { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { MousePointerClick, Link as LinkIcon, AlertCircle, CheckCircle2, Clock, Eye, ShieldCheck, PlusSquare, Zap, Globe, Sparkles, ChevronRight, Layout } from "lucide-react";
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
                    {t("advertise_surfing.submitting")}
                </>
            ) : (
                <>
                    <Zap size={20} className="group-hover:scale-125 transition-transform text-white" />
                    {t("advertise_surfing.submit")}
                </>
            )}
        </button>
    );
}

const Loader2 = ({ className, size }: { className?: string; size?: number }) => (
    <div className={cn("border-2 border-white/30 border-t-white rounded-full animate-spin", className)} style={{ width: size, height: size }} />
);

export default function NewSurfingCampaign() {
    const { t, language } = useLanguage();
    const [duration, setDuration] = useState(15);
    const [views, setViews] = useState(1000);
    const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [hideGuidelines, setHideGuidelines] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("hideTaskGuidelines");
        if (saved) {
            setHideGuidelines(true);
        }
    }, []);

    const isAr = language === "ar";

    // Surfing Cost Logic
    const getCostPerView = (dur: number) => {
        if (dur >= 60) return 0.003;
        if (dur >= 30) return 0.002;
        return 0.001;
    };
    const rewardUnit = getCostPerView(duration);
    const totalCost = (rewardUnit * views).toFixed(3);

    async function clientAction(formData: FormData) {
        setMessage(null);
        const res = await createSurfingCampaign(formData);
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
                        <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] px-2.5 py-1 rounded-full border border-primary/20">Distribution Engine</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        {t("advertise_surfing.title").split(' ')[0]} <span className="text-gradient">Campaign</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium max-w-lg">
                        {t("advertise_surfing.subtitle")}
                    </p>
                </div>

                <div className="hidden lg:flex items-center gap-3 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-950 text-slate-400">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Guaranteed Traffic</div>
                        <div className="text-xs font-black text-slate-900 dark:text-white">Active Protection Active</div>
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
                                <Sparkles size={12} className="text-primary" /> {t("advertise_surfing.site_title")}
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-primary/50 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-bold"
                                placeholder={t("advertise_surfing.site_title_placeholder")}
                            />
                        </div>

                        {/* URL */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                <LinkIcon size={12} className="text-primary" /> {t("advertise_surfing.site_url")}
                            </label>
                            <div className="relative group">
                                <div className={cn("absolute top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors", isAr ? 'right-4' : 'left-4')}>
                                    <Globe size={18} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="url"
                                    name="url"
                                    required
                                    className={cn("w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-primary/50 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-bold", isAr ? 'pr-12' : 'pl-12')}
                                    placeholder="https://mysite.com"
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                <Layout size={12} className="text-primary" /> {t("advertise_surfing.site_description")}
                            </label>
                            <textarea
                                name="description"
                                rows={2}
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-primary/50 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-medium text-sm resize-none"
                                placeholder={t("advertise_surfing.site_description_placeholder")}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="premium-card p-6 border-slate-100 dark:border-slate-800">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Clock size={14} className="text-primary" />
                                {t("advertise_surfing.duration")}
                            </label>
                            <select
                                name="duration"
                                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-primary transition-all text-sm font-black cursor-pointer appearance-none"
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value))}
                            >
                                <option value="15">15 {t("advertise_surfing.sec")} ($0.001)</option>
                                <option value="30">30 {t("advertise_surfing.sec")} ($0.002)</option>
                                <option value="60">60 {t("advertise_surfing.sec")} ($0.003)</option>
                            </select>
                        </div>

                        <div className="premium-card p-6 border-slate-100 dark:border-slate-800">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Eye size={14} className="text-primary" />
                                {t("advertise_surfing.views")}
                            </label>
                            <input
                                type="number"
                                name="views"
                                min="100"
                                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-primary transition-all text-sm font-black"
                                value={views}
                                onChange={(e) => setViews(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                </div>

                {/* Summary & Checkout Sidebar */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-slate-950 rounded-[3rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-blue-500/10">
                        {/* Abstract background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-600/10 blur-[80px] -ml-20 -mb-20 rounded-full" />

                        <div className="relative z-10 space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white">
                                    <Sparkles size={24} strokeWidth={2.5} />
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Pricing Model</div>
                                    <div className="text-xs font-black text-emerald-400">Competitive Tier 1</div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span className="text-xs font-bold text-slate-400">Unit Price:</span>
                                    <span className="text-xl font-black tabular-nums">${rewardUnit.toFixed(4)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400">Target Views:</span>
                                    <span className="text-xl font-black tabular-nums">{views.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Total Campaign Budget</div>
                                <div className="text-6xl font-black tabular-nums tracking-tighter flex items-start gap-1">
                                    <span className="text-2xl mt-2 text-slate-500">$</span>
                                    {totalCost}
                                </div>

                                {/* Insufficient Funds Warning */}
                                {message?.error?.toLowerCase().includes("funds") && (
                                    <div className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[11px] font-bold space-y-3">
                                        <p className="flex items-center gap-2">
                                            <AlertCircle size={14} />
                                            {message.error}
                                        </p>
                                        <Link
                                            href="/dashboard/deposit"
                                            className="block w-full text-center p-2.5 bg-amber-500 text-black rounded-xl hover:bg-amber-400 transition-colors uppercase tracking-[0.1em] font-black"
                                        >
                                            {t("dashboard.add_funds")}
                                        </Link>
                                    </div>
                                )}
                            </div>

                            <SubmitButton />

                            <p className="text-[10px] text-center text-slate-500 font-bold uppercase tracking-widest px-4">
                                Funds will be deducted from your Advertising Balance instantly upon launch.
                            </p>
                        </div>
                    </div>

                    {/* Content Policy & Guidelines - Shows One Time Only */}
                    {!hideGuidelines && (
                        <div className="p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/10 space-y-4 animate-in fade-in slide-in-from-top-4">
                            <div className="flex items-center gap-3 text-amber-600">
                                <ShieldCheck size={20} />
                                <span className="text-xs font-black uppercase tracking-widest">
                                    {isAr ? "سياسة المحتوى والنشر" : "Content & Publishing Policy"}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[11px] font-bold text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {isAr
                                        ? "لضمان بيئة آمنة، يتم مراجعة جميع الحملات تلقائياً بواسطة الذكاء الاصطناعي."
                                        : "To ensure a safe environment, all campaigns are automatically reviewed by AI."}
                                </p>

                                <ul className="space-y-2 bg-white dark:bg-slate-900/50 p-4 rounded-xl border border-amber-500/10">
                                    <li className="text-[10px] font-bold text-rose-500 flex items-center gap-2">
                                        <AlertCircle size={12} />
                                        {isAr ? "ممنوع المحتوى الجنسي أو الإباحي نهائياً." : "Strictly NO sexual or adult content."}
                                    </li>
                                    <li className="text-[10px] font-bold text-rose-500 flex items-center gap-2">
                                        <AlertCircle size={12} />
                                        {isAr ? "ممنوع المحتوى المتعلق بالإرهاب أو العنف." : "NO terrorism or violent content."}
                                    </li>
                                    <li className="text-[10px] font-bold text-rose-500 flex items-center gap-2">
                                        <AlertCircle size={12} />
                                        {isAr ? "ممنوع أي محتوى يخالف القوانين الدولية." : "NO illegal content or scams."}
                                    </li>
                                </ul>

                                <button
                                    type="button"
                                    onClick={() => {
                                        localStorage.setItem("hideTaskGuidelines", "true");
                                        setHideGuidelines(true);
                                    }}
                                    className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20"
                                >
                                    {isAr ? "أوافق على الشروط - لا تظهر مرة أخرى" : "I Agree - Don't Show Again"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
}
