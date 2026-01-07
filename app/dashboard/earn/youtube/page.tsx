import { db } from "@/lib/db";
import { auth } from "@/auth";
import Link from "next/link";
import { Youtube, ExternalLink, Play, Zap, Clock, DollarSign, Sparkles, AlertCircle } from "lucide-react";
import { getTranslation } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function YouTubeEarnPage() {
    const t = await getTranslation();
    const session = await auth();
    if (!session?.user) return <div className="p-8 h-40 flex items-center justify-center glass rounded-2xl text-slate-500 font-bold">{t('auth.authorization')}</div>;

    // Get YouTube tasks that are active
    // Get YouTube tasks that are active AND not completed by user
    // 1. Get Legacy YouTube Tasks
    const legacyTasks = await db.task.findMany({
        where: {
            active: true,
            type: "YOUTUBE",
            logs: { none: { userId: session.user.id } }
        }
    });

    // 2. Get New Social Tasks (Like, Subscribe, Comment)
    const socialTasks = await db.socialTask.findMany({
        where: {
            active: true,
            logs: { none: { userId: session.user.id } }
        }
    });

    // 3. Normalize & Merge
    const tasks = [
        ...legacyTasks,
        ...socialTasks.map(t => ({
            ...t,
            userPayout: t.payout, // Map payout
            duration: 15, // Default duration
            description: `Perform ${t.type.split('_')[1]} action`, // Helper description
            // Ensure ID format doesn't conflict if UUIDs are used for both
        }))
    ].sort((a, b) => b.userPayout - a.userPayout);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* YouTube Header Block */}
            <div className="glass bg-white/50 dark:bg-slate-900/10 p-8 rounded-[3rem] border border-white/20 dark:border-slate-800/30 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/5 blur-[80px] -mr-32 -mt-32 rounded-full" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-red-500/10 text-red-600 dark:text-red-500 text-[10px] font-black uppercase tracking-[0.3em] px-2.5 py-1 rounded-full border border-red-500/20">{t('premium.stream_engine')}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                            {t('sidebar.youtube').split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-400">{t('sidebar.youtube').split(' ').slice(1).join(' ') || t('landing.features.tasks')}</span>
                        </h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">{t('landing.features.tasks_desc')}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">{t('premium.available_work')}</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                                {tasks.length} <span className="text-slate-400 font-light text-sm">{t('premium.ads')}</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400">
                                <Play size={20} fill="currentColor" />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase leading-none">{t('common.status')}</div>
                                <div className="text-xs font-black text-red-600 uppercase">{t('common.active')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PENALTY WARNING BANNER */}
            <div className="bg-amber-500/10 border border-amber-500/20 p-6 rounded-[2rem] flex items-start gap-4 animate-pulse">
                <div className="p-3 bg-amber-500/20 rounded-xl text-amber-500">
                    <AlertCircle size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-black text-amber-500 uppercase tracking-widest mb-1">
                        {t('tasks.penalty_warning.title') || "Warning: Do Not Unsubscribe!"}
                    </h3>
                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">
                        {t('tasks.penalty_warning.desc') || "If you unsubscribe or unlike within 24 hours, a penalty of $0.10 will be deducted from your account automatically."}
                    </p>
                    <div className="text-xs font-black text-amber-600 uppercase tracking-wide bg-amber-500/10 px-3 py-1 rounded-lg inline-block">
                        Penalty Fee: -$0.10
                    </div>
                </div>
            </div>

            {/* Task Grid/List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('premium.playlist')}</h2>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>{t('advertise_youtube.duration')}</span>
                        <span className="w-24 text-right">{t('premium.est_payout')}</span>
                    </div>
                </div>

                {tasks.map((task) => (
                    <div key={task.id} className="premium-card p-0 overflow-hidden group border-slate-100 dark:border-slate-900 hover:border-red-500/30 transition-all duration-300">
                        <Link
                            href={`/dashboard/earn/youtube/watch?taskId=${task.id}`}
                            className="flex items-center gap-4 p-4 md:p-6"
                        >
                            {/* Play Icon */}
                            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors group-hover:bg-red-500/5 group-hover:border-red-500/20">
                                <Youtube size={28} strokeWidth={1.5} />
                            </div>

                            {/* Content Middle */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors truncate">
                                        {task.title}
                                    </h3>
                                    <Sparkles size={12} className="text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-xs text-slate-500 font-medium truncate max-w-xl italic">
                                    {task.description || "Watch this verified content to unlock your reward."}
                                </p>
                            </div>

                            {/* Reward & Meta */}
                            <div className="flex items-center gap-6">
                                <div className="hidden md:flex flex-col items-end">
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <Clock size={12} />
                                        <span className="text-xs font-bold tabular-nums">{task.duration}s</span>
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{t('premium.required')}</div>
                                </div>

                                <div className="text-right min-w-[110px] p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                    <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-white/80 uppercase tracking-tighter leading-none mb-1">{t('premium.est_payout')}</div>
                                    <div className="text-xl font-black tabular-nums flex items-center justify-end gap-0.5">
                                        <DollarSign size={14} strokeWidth={3} className="mb-0.5" />
                                        {task.userPayout.toFixed(4)}
                                    </div>
                                </div>

                                <div className="hidden lg:flex w-10 h-10 rounded-full border border-slate-100 dark:border-slate-800 items-center justify-center text-slate-300 group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500 transition-all duration-300">
                                    <ExternalLink size={16} />
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}

                {tasks.length === 0 && (
                    <div className="glass p-20 text-center rounded-[3rem] border-dashed border-2 border-slate-200 dark:border-slate-800">
                        <div className="bg-slate-50 dark:bg-slate-900 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Youtube size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{t('premium.empty_queue')}</h3>
                        <p className="text-slate-400 text-sm font-medium">{t('exchange.error')}</p>
                    </div>
                )}
            </div>

            {/* Footer Tip */}
            <div className="flex items-center justify-center gap-4 py-8 opacity-40">
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{t('premium.stream_engine')}</p>
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>
        </div>
    );
}
