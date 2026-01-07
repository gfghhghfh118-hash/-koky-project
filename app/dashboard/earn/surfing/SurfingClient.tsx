"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { completeTask } from "@/actions/earn";
import { Loader2, CheckCircle, ArrowLeft, ShieldCheck, Zap, DollarSign, Globe } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function SurfingClient({ task }: { task: any }) {
    const { t } = useLanguage();
    const router = useRouter();
    const [timeLeft, setTimeLeft] = useState(task.duration);
    const [status, setStatus] = useState<"RUNNING" | "COMPLETING" | "SUCCESS" | "ERROR">("RUNNING");
    const [earned, setEarned] = useState(0);
    const [message, setMessage] = useState<{ error?: string } | null>(null);

    const progress = ((task.duration - timeLeft) / task.duration) * 100;

    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev: number) => Math.max(0, prev - 1));
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleFinish = async () => {
        setStatus("COMPLETING");
        try {
            const result = await completeTask(task.id);
            if (result.error) {
                setMessage({ error: result.error });
                setStatus("ERROR");
            } else {
                setEarned(result.earned || 0);
                setStatus("SUCCESS");
            }
        } catch (e) {
            setMessage({ error: "System Error" });
            setStatus("ERROR");
        }
    };

    return (
        <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
            {/* Premium Top Bar */}
            <div className="h-20 glass border-b border-white/5 bg-slate-900/80 flex items-center justify-between px-8 z-50 relative shadow-2xl backdrop-blur-xl">
                {/* Progress Bar Background */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-white/5 w-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all duration-1000 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-inner">
                            <Globe size={20} strokeWidth={2.5} />
                        </div>
                        <div className="hidden sm:block">
                            <h2 className="text-sm font-black tracking-tight">{task.title}</h2>
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                                <ShieldCheck size={10} className="text-emerald-500" /> {t('premium.secure_session')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    {status === "RUNNING" && timeLeft > 0 && (
                        <div className="flex flex-col items-center">
                            <div className="flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-colors px-6 py-2 rounded-2xl border border-white/10 shadow-inner group cursor-default">
                                <Loader2 className="animate-spin text-primary group-hover:text-emerald-400 transition-colors" size={20} strokeWidth={3} />
                                <span className="font-black text-2xl font-mono tabular-nums bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent">{timeLeft}s</span>
                            </div>
                        </div>
                    )}

                    {status === "RUNNING" && timeLeft === 0 && (
                        <button
                            onClick={handleFinish}
                            className="btn-gradient px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest border border-white/20 animate-pulse hover:scale-105 transition-all shadow-blue-500/50"
                        >
                            {t('premium.claim')} ${task.userPayout.toFixed(3)}
                        </button>
                    )}

                    {status === "COMPLETING" && (
                        <div className="flex items-center gap-3 px-6 py-2 rounded-2xl bg-slate-800 border border-slate-700 text-slate-300 font-black text-xs uppercase tracking-widest">
                            <Loader2 className="animate-spin text-primary" size={18} /> {t('premium.verifying')}
                        </div>
                    )}

                    {status === "SUCCESS" && (
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 text-emerald-400 font-black bg-emerald-500/10 px-6 py-2.5 rounded-2xl border border-emerald-500/20 shadow-lg shadow-emerald-500/10">
                                <div className="p-1 rounded-full bg-emerald-500 text-slate-900">
                                    <CheckCircle size={14} strokeWidth={4} />
                                </div>
                                <span className="text-sm uppercase">{t('premium.earned')} +${earned.toFixed(4)}</span>
                            </div>
                            <button
                                onClick={() => router.push("/dashboard/earn")}
                                className="p-2.5 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all flex items-center gap-2 text-xs font-black uppercase tracking-widest"
                            >
                                <ArrowLeft size={16} /> {t('premium.back')}
                            </button>
                        </div>
                    )}

                    {status === "ERROR" && (
                        <div className="flex flex-col items-center gap-2 text-red-400 font-black bg-red-500/10 px-6 py-4 rounded-2xl border border-red-500/20">
                            <div className="uppercase tracking-widest text-[10px]">Error Details:</div>
                            <div className="text-sm bg-black/20 p-2 rounded text-mono">
                                {message?.error ? message.error : "Unknown Error (No Message)"}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* DEBUG INDICATOR */}
            <div className="fixed bottom-2 right-2 text-[8px] text-white/10 pointer-events-none">v1.1-debug</div>

            {/* Iframe Content Container */}
            <div className="flex-1 bg-white relative">
                {/* Debug Info for User */}
                <div className="absolute top-0 left-0 right-0 z-20 bg-slate-900 text-white text-[10px] p-1 flex justify-between px-4 opacity-80 hover:opacity-100 transition-opacity">
                    <span>Loading: {task.url}</span>
                    <a href={task.url} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-white underline">Open in New Tab</a>
                </div>

                {/* Premium subtle shadow overlay on top of iframe */}
                <div className="absolute inset-x-0 top-4 h-4 bg-gradient-to-b from-black/10 to-transparent pointer-events-none z-10" />

                <iframe
                    src={task.url || "https://example.com"}
                    className="w-full h-full border-none pt-6" // pt-6 to account for debug bar
                    allow="autoplay; fullscreen"
                    title="Ad Content"
                />
            </div>

            {/* Bottom Safe Guard */}
            <div className="h-1 dark:bg-slate-900" />
        </div>
    );
}
