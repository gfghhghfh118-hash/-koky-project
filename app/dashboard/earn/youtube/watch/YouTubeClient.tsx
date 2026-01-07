"use client";

import { useState, useEffect, useRef } from "react";
import { Task } from "@prisma/client";
import { completeTask } from "@/actions/earn"; // Assuming completeTaskMock isn't used, just keeping imports clean
import { completeSocialTask } from "@/actions/social-tasks";
import { Youtube, Clock, Zap, CheckCircle, AlertCircle, Loader2, Play, ShieldCheck, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface YouTubeClientProps {
    task: any; // Relaxed type to support both Task and SocialTask
}

export function YouTubeClient({ task }: YouTubeClientProps) {
    const { t } = useLanguage();
    const [secondsLeft, setSecondsLeft] = useState(task.duration || 15); // Default 15s for social tasks
    const [status, setStatus] = useState<"running" | "completing" | "success" | "error">("running");
    const [error, setError] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (secondsLeft > 0 && status === "running") {
            timerRef.current = setInterval(() => {
                setSecondsLeft((prev: number) => prev - 1);
            }, 1000);
        } else if (secondsLeft === 0 && status === "running") {
            handleComplete();
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [secondsLeft, status]);

    const handleComplete = async () => {
        setStatus("completing");

        let res;
        if (task.type && (task.type.includes("LIKE") || task.type.includes("SUBSCRIBE") || task.type.includes("COMMENT"))) {
            res = await completeSocialTask(task.id);
        } else {
            res = await completeTask(task.id);
        }

        if (res?.success) {
            setStatus("success");
        } else {
            setStatus("error");
            // @ts-ignore
            setError(res?.error || "Failed to confirm view");
        }
    };

    // Extract YouTube ID
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(task.url || "");

    return (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col overflow-hidden">
            {/* Premium Top Bar */}
            <div className="h-20 border-b border-white/5 bg-slate-900/50 backdrop-blur-2xl flex items-center justify-between px-6 md:px-10 shrink-0">
                <div className="flex items-center gap-6">
                    <Link
                        href="/dashboard/earn/youtube"
                        className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </Link>

                    <div>
                        <div className="flex items-center gap-2 mb-0.5">
                            <Youtube size={16} className="text-red-500" />
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{t('premium.stream_engine')}</span>
                        </div>
                        <h1 className="text-lg font-black text-white truncate max-w-[200px] md:max-w-md">
                            {task.title}
                        </h1>
                    </div>
                </div>

                <div className="flex items-center gap-4 md:gap-8">
                    {/* Timer Circle */}
                    <div className="relative w-14 h-14 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90 transform">
                            <circle
                                cx="28"
                                cy="28"
                                r="24"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                className="text-white/5"
                            />
                            <circle
                                cx="28"
                                cy="28"
                                r="24"
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={150}
                                strokeDashoffset={150 - (150 * secondsLeft) / task.duration}
                                className={cn(
                                    "transition-all duration-1000",
                                    status === "success" ? "text-emerald-500" : "text-red-500"
                                )}
                            />
                        </svg>
                        <span className="absolute text-sm font-black text-white tabular-nums">
                            {status === "success" ? "0" : secondsLeft}
                        </span>
                    </div>

                    <div className="hidden sm:flex flex-col items-end">
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{t('premium.est_payout')}</div>
                        <div className="text-xl font-black text-emerald-500 tabular-nums">
                            ${task.userPayout.toFixed(4)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content: Video Iframe */}
            <div className="flex-1 relative bg-black flex items-center justify-center">
                {status === "success" ? (
                    <div className="max-w-md w-full mx-4 animate-in zoom-in-95 duration-500">
                        <div className="bg-slate-900 border border-emerald-500/20 rounded-[3rem] p-10 text-center space-y-8 shadow-2xl shadow-emerald-500/10">
                            <div className="relative">
                                <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
                                <div className="relative w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/50">
                                    <CheckCircle size={48} className="text-white" strokeWidth={2.5} />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-white">{t('premium.stream_verified')}</h2>
                                <p className="text-slate-400 font-medium">{t('premium.credited_msg').replace('{amount}', `$${task.userPayout.toFixed(4)}`)}</p>
                            </div>

                            <Link
                                href="/dashboard/earn/youtube"
                                className="inline-flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                            >
                                {t('premium.continue_next')}
                                <Zap size={18} />
                            </Link>
                        </div>
                    </div>
                ) : status === "error" ? (
                    <div className="max-w-md w-full mx-4">
                        <div className="bg-slate-900 border border-rose-500/20 rounded-[3rem] p-10 text-center space-y-6">
                            <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto text-rose-500">
                                <AlertCircle size={40} />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-black text-white">{t('premium.validation_error')}</h2>
                                <p className="text-slate-400 font-medium">{error}</p>
                            </div>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all"
                            >
                                {t('premium.try_again')}
                            </button>
                        </div>
                    </div>
                ) : (
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=1&rel=0`}
                        className="w-full h-full border-none shadow-2xl"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                )}

                {status === "running" && secondsLeft > 0 && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-6 py-3 bg-red-600/90 backdrop-blur-xl border border-white/20 rounded-full shadow-2xl animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-white" />
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">{t('premium.live_validation')}</span>
                    </div>
                )}
            </div>

            {/* Bottom Info Bar */}
            <div className="h-16 bg-slate-900 border-t border-white/5 flex items-center justify-center px-6 shrink-0">
                <div className="flex items-center gap-10 opacity-60">
                    <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('premium.anti_fraud')}</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                        <Zap size={14} className="text-amber-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('premium.instant_payout')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Clock size={14} className="text-blue-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">{t('premium.auto_sync')}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
