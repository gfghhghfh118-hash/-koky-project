"use client";

import { createYouTubeCampaign } from "@/actions/advertise";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Youtube, Link as LinkIcon, AlertCircle, CheckCircle2, Clock, Eye, ShieldCheck, PlusSquare, Zap, Play, Sparkles, ChevronRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

function SubmitButton() {
    const { pending } = useFormStatus();
    const { t } = useLanguage();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full btn-gradient bg-red-600 hover:bg-red-700 p-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-red-500/25 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group border border-white/20"
        >
            {pending ? (
                <>
                    <Loader2 className="animate-spin" size={20} />
                    {t("advertise_youtube.submitting")}
                </>
            ) : (
                <>
                    <Youtube size={20} className="group-hover:scale-125 transition-transform text-white" />
                    {t("advertise_youtube.submit")}
                </>
            )}
        </button>
    );
}

const Loader2 = ({ className, size }: { className?: string; size?: number }) => (
    <div className={cn("border-2 border-white/30 border-t-white rounded-full animate-spin", className)} style={{ width: size, height: size }} />
);

export default function NewYouTubeCampaign() {
    const { t, language } = useLanguage();
    const [duration, setDuration] = useState(15);
    const [views, setViews] = useState(1000);
    const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const isAr = language === "ar";

    // Simple cost calc for UI
    const getCostPerView = (dur: number) => {
        if (dur >= 60) return 0.005;
        if (dur >= 30) return 0.003;
        return 0.002;
    };
    const rewardUnit = getCostPerView(duration);
    const totalCost = (rewardUnit * views).toFixed(3);

    async function clientAction(formData: FormData) {
        setMessage(null);
        const res = await createYouTubeCampaign(formData);
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
                        <span className="bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] px-2.5 py-1 rounded-full border border-red-500/20">Engagement Engine</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        YouTube <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-400">Campaign</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium max-w-lg">
                        {t("advertise_youtube.subtitle")}
                    </p>
                </div>

                <div className="hidden lg:flex items-center gap-3 p-4 rounded-3xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
                    <div className="p-2.5 rounded-2xl bg-white dark:bg-slate-950 text-red-500">
                        <Play size={20} fill="currentColor" />
                    </div>
                    <div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Direct API Feed</div>
                        <div className="text-xs font-black text-slate-900 dark:text-white">Verified Views Active</div>
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
                                <Sparkles size={12} className="text-red-500" /> {t("advertise_youtube.video_title")}
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-red-500/50 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-bold"
                                placeholder={t("advertise_youtube.video_title_placeholder")}
                            />
                        </div>

                        {/* URL */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                <LinkIcon size={12} className="text-red-500" /> {t("advertise_youtube.video_url")}
                            </label>
                            <div className="relative group">
                                <div className={cn("absolute top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-red-500 transition-colors", isAr ? 'right-4' : 'left-4')}>
                                    <Play size={18} strokeWidth={2.5} />
                                </div>
                                <input
                                    type="url"
                                    name="url"
                                    required
                                    className={cn("w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-red-500/50 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-bold", isAr ? 'pr-12' : 'pl-12')}
                                    placeholder="https://youtube.com/watch?v=..."
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="premium-card p-6 border-slate-100 dark:border-slate-800">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Clock size={14} className="text-red-500" />
                                {t("advertise_youtube.duration")}
                            </label>
                            <select
                                name="duration"
                                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-red-500 transition-all text-sm font-black cursor-pointer appearance-none"
                                value={duration}
                                onChange={(e) => setDuration(parseInt(e.target.value))}
                            >
                                <option value="15">15 {t("advertise_surfing.sec")} ($0.002)</option>
                                <option value="30">30 {t("advertise_surfing.sec")} ($0.003)</option>
                                <option value="60">60 {t("advertise_surfing.sec")} ($0.005)</option>
                            </select>
                        </div>

                        <div className="premium-card p-6 border-slate-100 dark:border-slate-800">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Eye size={14} className="text-red-500" />
                                {t("advertise_youtube.views")}
                            </label>
                            <input
                                type="number"
                                name="views"
                                min="100"
                                className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-red-500 transition-all text-sm font-black"
                                value={views}
                                onChange={(e) => setViews(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>

                    <input type="hidden" name="description" value="Watch video on YouTube" />
                </div>

                {/* Summary & Checkout Sidebar */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-slate-950 rounded-[3rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-red-500/10">
                        {/* Abstract background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[100px] -mr-32 -mt-32 rounded-full" />
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-rose-600/10 blur-[80px] -ml-20 -mb-20 rounded-full" />

                        <div className="relative z-10 space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-500">
                                    <Youtube size={24} strokeWidth={2.5} />
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Video Pricing</div>
                                    <div className="text-xs font-black text-red-400">Premium Tier 1</div>
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
                                <div className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em]">Total Campaign Budget</div>
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
                                Dedicated server nodes will process your video feed for instant distribution.
                            </p>
                        </div>
                    </div>

                    {/* Meta Tips */}
                    <div className="p-6 rounded-[2rem] bg-red-500/5 border border-red-500/10 space-y-4">
                        <div className="flex items-center gap-3 text-red-600">
                            <ShieldCheck size={20} />
                            <span className="text-xs font-black uppercase tracking-widest">Pro Guidelines</span>
                        </div>
                        <ul className="space-y-2">
                            <li className="text-[11px] font-medium text-red-700/80 flex items-start gap-2">
                                <ChevronRight size={10} className="mt-1 shrink-0" />
                                Use high-quality thumbnails to increase CTR by up to 40%.
                            </li>
                            <li className="text-[11px] font-medium text-red-700/80 flex items-start gap-2">
                                <ChevronRight size={10} className="mt-1 shrink-0" />
                                Longer watch times (60s+) boost YouTube algorithm ranking.
                            </li>
                        </ul>
                    </div>
                </div>
            </form>
        </div>
    );
}
