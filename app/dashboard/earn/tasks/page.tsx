import { db } from "@/lib/db";
import { auth } from "@/auth";
import Link from "next/link";
import { CheckCircle, Clock, XCircle, Briefcase, ChevronRight, Zap, Sparkles, ShieldCheck, Info } from "lucide-react";
import { submitTaskProof } from "@/actions/tasks";
import TaskSubmissionForm from "@/components/TaskSubmissionForm";
import { cn } from "@/lib/utils";
import { getTranslation } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function TasksPage() {
    const t = await getTranslation();
    const session = await auth();
    if (!session?.user) return <div className="p-8 h-40 flex items-center justify-center glass rounded-2xl text-slate-500 font-bold">{t('auth.authorization')}</div>;

    // Get Active Tasks that the user has NOT attempted yet
    const tasks = await db.task.findMany({
        where: {
            active: true,
            type: "TASK",
            adminStatus: "APPROVED",
            logs: {
                none: {
                    userId: session.user.id
                }
            }
        },
        orderBy: { userPayout: "desc" }
    });

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {/* Premium Header Block */}
            <div className="glass bg-white/50 dark:bg-slate-900/10 p-8 rounded-[3rem] border border-white/20 dark:border-slate-800/30 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] -mr-32 -mt-32 rounded-full" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-amber-500/10 text-amber-600 dark:text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] px-2.5 py-1 rounded-full border border-amber-500/20">{t('premium.op_matrix')}</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                            {t('premium.micro_tasks').split(' ')[0]} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-amber-400">{t('premium.micro_tasks').split(' ').slice(1).join(' ')}</span>
                        </h1>
                        <p className="text-slate-500 text-sm font-medium mt-1">{t('landing.features.tasks_desc')}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none mb-1">{t('premium.available_work')}</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                                {tasks.length} <span className="text-slate-400 font-light text-sm">{t('premium.units')}</span>
                            </div>
                        </div>
                        <div className="p-4 rounded-3xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                <ShieldCheck size={20} strokeWidth={2.5} />
                            </div>
                            <div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase leading-none">{t('common.status')}</div>
                                <div className="text-xs font-black text-amber-600 uppercase">{t('common.active')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{t('premium.queue')}</h2>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <Info size={12} /> {t('premium.instructions_note')}
                    </div>
                </div>

                {tasks.map(task => {
                    const status: string = "NEW";

                    return (
                        <div key={task.id} className={cn(
                            "premium-card overflow-hidden group transition-all duration-300",
                            status === "APPROVED" ? "border-emerald-500/30 bg-emerald-500/5" :
                                status === "PENDING" ? "border-amber-500/30 bg-amber-500/5" :
                                    status === "REJECTED" ? "border-rose-500/30 bg-rose-500/5" : ""
                        )}>
                            <div className="p-6 md:p-8">
                                <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "p-3 rounded-2xl border transition-colors",
                                                status === "APPROVED" ? "bg-emerald-500 text-white border-emerald-400" :
                                                    status === "PENDING" ? "bg-amber-500 text-white border-amber-400" :
                                                        status === "REJECTED" ? "bg-rose-500 text-white border-rose-400" :
                                                            "bg-slate-100 dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-400"
                                            )}>
                                                <Briefcase size={24} strokeWidth={1.5} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
                                                    {task.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest mt-1">
                                                    {task.approvalType === "AUTO" ? (
                                                        <span className="text-emerald-500 flex items-center gap-1">
                                                            <Zap size={10} fill="currentColor" /> {t('premium.instant')}
                                                        </span>
                                                    ) : (
                                                        <span className="text-amber-500 flex items-center gap-1">
                                                            <Clock size={10} /> {t('premium.manual_review')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-900 text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                                            {task.description}
                                        </div>
                                    </div>

                                    <div className="text-right w-full lg:w-auto flex flex-col items-end justify-between self-stretch">
                                        <div className="p-4 rounded-3xl bg-emerald-500 dark:bg-emerald-600 text-white shadow-xl shadow-emerald-500/20">
                                            <div className="text-[10px] font-black uppercase tracking-tighter opacity-80 leading-none mb-1">{t('premium.est_payout')}</div>
                                            <div className="text-3xl font-black tabular-nums">${task.userPayout.toFixed(4)}</div>
                                        </div>

                                        <div className="hidden lg:block">
                                            {status === "APPROVED" && (
                                                <div className="flex items-center gap-2 text-emerald-600 font-black text-[10px] uppercase tracking-widest">
                                                    <CheckCircle size={14} /> {t('premium.completed')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-900">
                                    {status === "NEW" && (
                                        <TaskSubmissionForm task={task} />
                                    )}

                                    {status === "PENDING" && (
                                        <div className="flex items-center gap-3 text-amber-600 bg-amber-500/10 p-5 rounded-[2rem] justify-center font-black text-xs uppercase tracking-widest border border-amber-500/20">
                                            <Clock size={18} className="animate-spin-slow" />
                                            {t('premium.verifying_progress')}
                                        </div>
                                    )}

                                    {status === "APPROVED" && (
                                        <div className="flex items-center gap-3 text-emerald-600 bg-emerald-500/10 p-5 rounded-[2rem] justify-center font-black text-xs uppercase tracking-widest border border-emerald-500/20">
                                            <CheckCircle size={18} />
                                            {t('premium.op_success')}
                                        </div>
                                    )}

                                    {status === "REJECTED" && (
                                        <div className="flex items-center gap-3 text-rose-600 bg-rose-500/10 p-5 rounded-[2rem] justify-center font-black text-xs uppercase tracking-widest border border-rose-500/20">
                                            <XCircle size={18} />
                                            {t('premium.val_failed')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {tasks.length === 0 && (
                    <div className="glass p-20 text-center rounded-[3rem] border-dashed border-2 border-slate-200 dark:border-slate-800">
                        <div className="bg-slate-50 dark:bg-slate-900 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                            <Briefcase size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-1">{t('premium.empty_queue')}</h3>
                        <p className="text-slate-400 text-sm font-medium">{t('exchange.error')}</p>
                    </div>
                )}
            </div>

            {/* Footer Tip */}
            <div className="flex items-center justify-center gap-4 py-8 opacity-50">
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{t('premium.op_matrix')}</p>
                <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>
        </div>
    );
}
