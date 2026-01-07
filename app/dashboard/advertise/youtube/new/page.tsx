"use client";

import { createSocialTask } from "@/actions/social-tasks";
import { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { Youtube, Link as LinkIcon, AlertCircle, CheckCircle2, ThumbsUp, UserPlus, MessageSquare, ShieldCheck, Sparkles, Zap } from "lucide-react";
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
                    <Zap size={20} className="group-hover:scale-125 transition-transform text-white" />
                    Create Task
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
    const [type, setType] = useState("YOUTUBE_LIKE");
    const [views, setViews] = useState(1000); // Actually "Quantity"
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

    // Fixed Pricing Logic
    const PRICING: Record<string, number> = {
        YOUTUBE_LIKE: 0.002,
        YOUTUBE_SUBSCRIBE: 0.004,
        YOUTUBE_COMMENT: 0.005
    };

    const rewardUnit = PRICING[type] || 0.002;
    const totalCost = (rewardUnit * views).toFixed(3);

    async function clientAction(formData: FormData) {
        setMessage(null);
        // Map form data to server action
        const data = {
            title: formData.get("title") as string,
            type: formData.get("type") as string,
            url: formData.get("url") as string,
            quantity: parseInt(formData.get("quantity") as string)
        };

        try {
            const res = await createSocialTask(data);
            // @ts-ignore
            if (res?.error) setMessage({ error: res.error });
            if (res?.success) {
                setMessage({ success: "Task created successfully!" });
                setIsRedirecting(true);
                setTimeout(() => {
                    window.location.href = "/dashboard/advertise";
                }, 2000);
            }
        } catch (e: any) {
            setMessage({ error: e.message || "Something went wrong" });
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10 py-6 px-4 md:px-0 animate-in fade-in slide-in-from-bottom-6 duration-1000" dir={isAr ? "rtl" : "ltr"}>
            {/* Premium Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] px-2.5 py-1 rounded-full border border-red-500/20">Social Boost</span>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                        YouTube <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-400">Interaction</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium max-w-lg">
                        Get real Likes, Subscribers, and Comments from verified users.
                    </p>
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
                        {/* Task Type Selector */}
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: "YOUTUBE_LIKE", icon: ThumbsUp, label: "Like", price: 0.002 },
                                { id: "YOUTUBE_SUBSCRIBE", icon: UserPlus, label: "Subscribe", price: 0.004 },
                                { id: "YOUTUBE_COMMENT", icon: MessageSquare, label: "Comment", price: 0.005 }
                            ].map((item) => (
                                <div
                                    key={item.id}
                                    onClick={() => setType(item.id)}
                                    className={cn(
                                        "cursor-pointer rounded-2xl border p-4 flex flex-col items-center gap-2 transition-all",
                                        type === item.id
                                            ? "bg-red-500/10 border-red-500 text-red-600"
                                            : "bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-red-500/50"
                                    )}
                                >
                                    <item.icon size={24} />
                                    <div className="text-[10px] font-black uppercase tracking-wider">{item.label}</div>
                                    <div className="text-xs font-bold text-slate-400">${item.price}</div>
                                </div>
                            ))}
                            <input type="hidden" name="type" value={type} />
                        </div>

                        {/* Title */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                <Sparkles size={12} className="text-red-500" /> Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                required
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-red-500/50 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-bold"
                                placeholder="e.g. Subscribe to my channel"
                            />
                        </div>

                        {/* URL */}
                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                <LinkIcon size={12} className="text-red-500" /> Video/Channel URL
                            </label>
                            <input
                                type="url"
                                name="url"
                                required
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-red-500/50 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-bold"
                                placeholder="https://youtube.com/..."
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1 flex items-center gap-2">
                                <Zap size={12} className="text-red-500" /> Quantity
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                min="10"
                                required
                                className="w-full p-4 bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-2xl focus:bg-white dark:focus:bg-slate-950 focus:border-red-500/50 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 font-bold"
                                value={views}
                                onChange={(e) => setViews(parseInt(e.target.value) || 0)}
                            />
                        </div>
                    </div>
                </div>

                {/* Summary & Checkout Sidebar */}
                <div className="lg:col-span-5 space-y-8">
                    <div className="bg-slate-950 rounded-[3rem] p-8 text-white relative overflow-hidden group shadow-2xl shadow-red-500/10">
                        {/* Abstract background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[100px] -mr-32 -mt-32 rounded-full" />

                        <div className="relative z-10 space-y-10">
                            <div className="flex items-center justify-between">
                                <div className="p-3 rounded-2xl bg-red-500/20 border border-red-500/30 text-red-500">
                                    <Youtube size={24} strokeWidth={2.5} />
                                </div>
                                <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Order Summary</div>
                                    <div className="text-xs font-black text-red-400">Social Task Pricing</div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span className="text-xs font-bold text-slate-400">Action Type:</span>
                                    <span className="text-sm font-black text-white bg-slate-800 px-2 py-1 rounded-lg">{type.split('_')[1]}</span>
                                </div>
                                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                                    <span className="text-xs font-bold text-slate-400">Cost per Action:</span>
                                    <span className="text-xl font-black tabular-nums">${rewardUnit}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400">Quantity:</span>
                                    <span className="text-xl font-black tabular-nums">{views.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-white/10 space-y-4">
                                <div className="text-[10px] font-black text-red-400 uppercase tracking-[0.3em]">Total Cost</div>
                                <div className="text-6xl font-black tabular-nums tracking-tighter flex items-start gap-1">
                                    <span className="text-2xl mt-2 text-slate-500">$</span>
                                    {totalCost}
                                </div>
                            </div>

                            <SubmitButton />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
