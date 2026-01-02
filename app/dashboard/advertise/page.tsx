import { db } from "@/lib/db";
import { auth } from "@/auth";
import Link from "next/link";
import { Youtube, MousePointerClick, Briefcase, Plus, Signal, Megaphone, TrendingUp, ChevronRight, Activity } from "lucide-react";
import AdBalanceExchange from "@/components/AdBalanceExchange";
import DeleteCampaignButton from "@/components/DeleteCampaignButton";

export default async function ManageCampaigns() {
    const session = await auth();
    if (!session?.user?.id) return <div className="p-8 h-40 flex items-center justify-center glass rounded-2xl text-slate-500 font-bold">Authentication Required</div>;

    const myTasks = await db.task.findMany({
        where: { creatorId: session.user.id },
        orderBy: { createdAt: "desc" }
    });

    const user = await db.user.findUnique({ where: { id: session.user.id } });
    const adBalance = user?.adBalance || 0;
    const mainBalance = user?.balance || 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header & Stats */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
                        Advertising <span className="text-gradient">Management</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">Create and track your promotional campaigns.</p>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="flex-1 md:flex-none p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-4 min-w-[200px]">
                        <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <Megaphone size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Ad Balance</div>
                            <div className="text-xl font-black text-blue-600 tabular-nums">${adBalance.toFixed(3)}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Exchange */}
            <div className="glass bg-white/40 dark:bg-slate-900/10 p-2 rounded-2xl border border-white/20 dark:border-slate-800/20">
                <AdBalanceExchange userBalance={mainBalance} />
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap gap-3">
                <Link href="/dashboard/advertise/surfing/new" className="premium-card p-3 px-5 flex items-center gap-3 bg-white hover:bg-slate-50 border-slate-200 hover:border-primary transition-all group">
                    <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:text-primary group-hover:bg-primary/5 transition-colors">
                        <MousePointerClick size={16} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-600 group-hover:text-slate-900">New Surfing</span>
                </Link>
                <Link href="/dashboard/advertise/youtube/new" className="premium-card p-3 px-5 flex items-center gap-3 bg-white hover:bg-red-50 border-slate-200 hover:border-red-400 transition-all group">
                    <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:text-red-500 group-hover:bg-red-50 transition-colors">
                        <Youtube size={16} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-600 group-hover:text-slate-900">New YouTube</span>
                </Link>
                <Link href="/dashboard/advertise/tasks/new" className="premium-card p-3 px-5 flex items-center gap-3 bg-white hover:bg-blue-50 border-slate-200 hover:border-blue-400 transition-all group">
                    <div className="p-2 rounded-lg bg-slate-50 text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50 transition-colors">
                        <Briefcase size={16} />
                    </div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-600 group-hover:text-slate-900">New Task</span>
                </Link>
            </div>

            {/* Campaign List */}
            <div className="premium-card p-0 overflow-hidden shadow-xl border-slate-100">
                <div className="bg-slate-50/80 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Activity size={16} className="text-slate-400" />
                        <span className="font-black text-slate-900 dark:text-white text-sm tracking-tight">Active Campaigns ({myTasks.length})</span>
                    </div>
                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Status</div>
                </div>

                {myTasks.length === 0 ? (
                    <div className="p-20 text-center">
                        <div className="bg-slate-50 dark:bg-slate-900 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300 shadow-inner">
                            <Signal size={36} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">No Active Campaigns</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mb-8 text-sm font-medium leading-relaxed">
                            Launch your first promotional campaign to boost your projects and reach a wider audience.
                        </p>
                        <Link href="/dashboard/advertise/surfing/new" className="btn-gradient inline-flex items-center gap-2">
                            <Plus size={18} strokeWidth={3} /> Create First Campaign
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {myTasks.map(task => (
                            <div key={task.id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border ${task.type === "YOUTUBE" ? "bg-red-50 border-red-100 text-red-500" :
                                        task.type === "SURFING" ? "bg-blue-50 border-blue-100 text-blue-500" :
                                            "bg-emerald-50 border-emerald-100 text-emerald-500"
                                        }`}>
                                        {task.type === "YOUTUBE" && <Youtube size={24} strokeWidth={1.5} />}
                                        {task.type === "SURFING" && <MousePointerClick size={24} strokeWidth={1.5} />}
                                        {task.type === "TASK" && <Briefcase size={24} strokeWidth={1.5} />}
                                    </div>
                                    <div>
                                        <h4 className="font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">{task.title}</h4>
                                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-3 mt-1.5 font-mono">
                                            <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-500">{task.type}</span>
                                            <span>•</span>
                                            <span>Created {new Date(task.createdAt).toLocaleDateString()}</span>
                                            {task.approvalType === "MANUAL" && <span className="text-orange-500 bg-orange-50 px-2 py-0.5 rounded border border-orange-100">Manual Review</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6 justify-between md:justify-end">
                                    <div className="text-right">
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">Budget / Unit</div>
                                        <div className="text-lg font-black text-slate-900 dark:text-white tabular-nums">${task.realPrice.toFixed(4)}</div>
                                    </div>

                                    <div className="flex items-center gap-3 pl-6 border-l border-slate-100 dark:border-slate-800">
                                        <div className="text-right mr-2 hidden sm:block">
                                            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Progress</div>
                                            <div className="text-xs font-black text-slate-900 dark:text-white family-mono">
                                                {(task as any).completedQuantity || 0} <span className="text-slate-400">/</span> {(task as any).targetQuantity || "∞"}
                                            </div>
                                        </div>

                                        <div className={`text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border transition-all ${(task as any).adminStatus === "PENDING"
                                            ? "bg-amber-50 border-amber-100 text-amber-600"
                                            : "bg-emerald-50 border-emerald-100 text-emerald-600"
                                            }`}>
                                            {(task as any).adminStatus || "ACTIVE"}
                                        </div>

                                        <DeleteCampaignButton taskId={task.id} title={task.title} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
