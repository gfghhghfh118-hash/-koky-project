import { db } from "@/lib/db";
import { auth } from "@/auth";
import Link from "next/link";
import { MousePointerClick, Youtube, ExternalLink, Globe, Zap, Clock, DollarSign } from "lucide-react";
import { getTranslation } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function EarnPage() {
    const t = await getTranslation();
    const session = await auth();
    if (!session?.user) return <div className="p-8 h-40 flex items-center justify-center glass rounded-2xl text-slate-500 font-bold">{t('auth.authorization')}</div>;

    // Get tasks that are active AND not completed by this user
    const tasks = await db.task.findMany({
        where: {
            active: true,
            logs: {
                none: {
                    userId: session.user.id
                }
            }
        },
        orderBy: { userPayout: "desc" }
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Premium Header Block */}
            <div className="glass bg-white/50 dark:bg-slate-900/10 p-8 rounded-3xl border border-white/20 dark:border-slate-800/30 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -mr-32 -mt-32 rounded-full" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] px-2.5 py-1 rounded-full border border-primary/20">{t('premium.site_crawler')}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                            {t('premium.surfing_sites').split(' ')[0]} <span className="text-gradient">{t('premium.surfing_sites').split(' ').slice(1).join(' ')}</span>
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
                        <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                <Zap size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase leading-none">{t('premium.flash_pay')}</div>
                                <div className="text-xs font-black text-emerald-600">{t('premium.instant')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Grid/List */}
            <div className="space-y-3">
                <div className="flex items-center justify-between px-2 mb-4">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('premium.queue')}</h2>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <span>{t('advertise_surfing.duration')}</span>
                        <span className="w-20 text-right">{t('premium.est_payout')}</span>
                    </div>
                </div>

                {tasks.map((task) => (
                    <div key={task.id} className="premium-card p-0 overflow-hidden group hover:border-primary/50 transition-all duration-300">
                        <Link
                            href={`/dashboard/earn/surfing?taskId=${task.id}`}
                            className="flex items-center gap-4 p-4 md:p-6"
                        >
                            {/* Icon/Type */}
                            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors group-hover:bg-primary/5">
                                <Globe size={24} strokeWidth={1.5} />
                            </div>

                            {/* Content Middle */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors truncate">
                                        {task.title}
                                    </h3>
                                    <span className="hidden sm:inline-block bg-slate-100 dark:bg-slate-800 text-slate-400 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-tighter">{t('common.status')}</span>
                                </div>
                                <p className="text-xs text-slate-500 font-medium truncate max-w-xl italic">
                                    {task.description || "Browse this premium destination to earn your reward payout."}
                                </p>
                            </div>

                            {/* Reward & Meta */}
                            <div className="flex items-center gap-6">
                                <div className="hidden md:flex flex-col items-end">
                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <Clock size={12} />
                                        <span className="text-xs font-bold tabular-nums">{task.duration}s</span>
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{t('premium.wait_time')}</div>
                                </div>

                                <div className="text-right min-w-[100px] p-3 rounded-2xl bg-emerald-50/50 dark:bg-emerald-500/5 border border-emerald-100/50 dark:border-emerald-500/10 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                    <div className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 group-hover:text-white/80 uppercase tracking-tighter leading-none mb-1">{t('premium.est_payout')}</div>
                                    <div className="text-lg font-black tabular-nums flex items-center justify-end gap-0.5">
                                        <DollarSign size={14} strokeWidth={3} className="mb-0.5" />
                                        {task.userPayout.toFixed(4)}
                                    </div>
                                </div>

                                <div className="hidden lg:flex w-10 h-10 rounded-full border border-slate-100 dark:border-slate-800 items-center justify-center text-slate-300 group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all duration-300">
                                    <ExternalLink size={16} />
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}

                {tasks.length === 0 && (
                    <div className="glass p-20 text-center rounded-3xl border-dashed border-2 border-slate-200 dark:border-slate-800">
                        <div className="bg-slate-50 dark:bg-slate-900 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Zap size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{t('premium.empty_queue')}</h3>
                        <p className="text-slate-400 text-sm font-medium">{t('exchange.error')}</p>
                    </div>
                )}
            </div>

            {/* Footer Tip */}
            <div className="flex items-center justify-center gap-4 py-6 border-t border-slate-100 dark:border-slate-800">
                <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1" />
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">{t('premium.op_matrix')}</p>
                <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1" />
            </div>
        </div>
    );
}
