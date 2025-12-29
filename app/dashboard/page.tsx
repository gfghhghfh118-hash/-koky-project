import { auth } from "@/auth";
import { db } from "@/lib/db";
import { Wallet, CheckCircle, ArrowRightLeft, Megaphone, TrendingUp, Clock, ShieldCheck, User as UserIcon } from "lucide-react";
import Link from "next/link";

export default async function UserDashboard() {
    const session = await auth();
    if (!session?.user?.id) return <div className="p-8 glass rounded-2xl text-red-600 font-bold border-red-100 flex items-center gap-3">
        <ShieldCheck className="text-red-500" /> Not authenticated
    </div>;

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: { tasksDone: { take: 5, orderBy: { timestamp: 'desc' } } }
    });

    if (!user) return <div>User not found</div>;

    return (
        <div className="space-y-8 pb-12">
            {/* Header Greeting */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-1">
                        Welcome back, <span className="text-gradient">{user.username || "User"}</span>!
                    </h1>
                    <p className="text-slate-500 text-sm font-medium">Here's what's happening with your account today.</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Status: Worker
                    </span>
                </div>
            </div>

            {/* Top Info Alert */}
            <div className="glass bg-blue-50/50 dark:bg-blue-900/10 border-blue-200/50 dark:border-blue-500/20 p-4 rounded-2xl flex items-start gap-4 shadow-sm">
                <div className="bg-blue-500 text-white p-2 rounded-xl">
                    <Clock size={18} strokeWidth={2.5} />
                </div>
                <div className="text-sm">
                    <p className="font-bold text-blue-900 dark:text-blue-300 mb-0.5">Withdrawal Processing</p>
                    <p className="text-blue-700/80 dark:text-blue-400/80 font-medium italic">Safety first: All withdrawals are manually audited and processed within 24 hours.</p>
                </div>
            </div>

            {/* Referral Promotion Banner */}
            <Link href="/dashboard/referrals" className="block transform transition-all hover:scale-[1.01] active:scale-[0.99]">
                <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white shadow-2xl shadow-indigo-500/20 group">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-white/10 blur-3xl transition-transform group-hover:scale-150" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-pink-500/20 blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="hidden sm:flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl">
                                <TrendingUp size={32} className="text-white" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="bg-amber-400 text-indigo-900 text-[10px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-full shadow-lg">Referral Program</span>
                                    <div className="flex -space-x-2">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="w-5 h-5 rounded-full border-2 border-indigo-600 bg-slate-200" />
                                        ))}
                                    </div>
                                </div>
                                <h3 className="text-2xl font-black tracking-tight leading-none mb-2">
                                    Invite Friends & Earn <span className="text-amber-400">10% Lifetime</span>
                                </h3>
                                <p className="text-white/80 text-sm font-medium">Get 10% from every task completed by your referrals, instantly credited.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-black/20 backdrop-blur-lg px-6 py-4 rounded-2xl border border-white/10">
                            <div className="text-right">
                                <div className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-none mb-1">Commission Rate</div>
                                <div className="text-3xl font-black text-amber-400 tabular-nums">10%</div>
                            </div>
                            <div className="h-10 w-px bg-white/20 mx-2" />
                            <ArrowRightLeft className="text-white/60" />
                        </div>
                    </div>
                </div>
            </Link>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Financial Overview Card */}
                <div className="lg:col-span-2 premium-card overflow-hidden group">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">Financial Overview</h2>
                        <div className="flex gap-2">
                            <Link href="/dashboard/deposit" className="text-[10px] font-black uppercase tracking-wider bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 px-3 py-1.5 rounded-lg transition-all">Add Funds</Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        {/* Main Balance Container */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 transition-transform group-hover:scale-110">
                                    <Wallet size={24} />
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available Balance</div>
                            </div>
                            <div>
                                <div className="text-4xl font-black text-slate-900 dark:text-white flex items-end gap-1">
                                    <span className="text-xl text-slate-400 mb-1">$</span>
                                    {user.balance.toFixed(4)}
                                </div>
                                <p className="text-xs text-emerald-500 font-bold mt-1 flex items-center gap-1">
                                    <TrendingUp size={12} /> +0.00% this week
                                </p>
                            </div>
                            <Link href="/dashboard/withdraw" className="btn-gradient inline-flex items-center justify-center gap-2 w-full mt-4">
                                <LogOut size={16} /> Withdraw Now
                            </Link>
                        </div>

                        {/* Ad Balance Container */}
                        <div className="space-y-4 md:border-l dark:border-slate-800 md:pl-8">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 transition-transform group-hover:scale-110">
                                    <Megaphone size={24} />
                                </div>
                                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">Ad Balance</div>
                            </div>
                            <div>
                                <div className="text-3xl font-black text-slate-900 dark:text-white flex items-end gap-1">
                                    <span className="text-lg text-slate-400 mb-1">$</span>
                                    {user.adBalance.toFixed(4)}
                                </div>
                                <p className="text-xs text-blue-500 font-bold mt-1">Ready for campaigns</p>
                            </div>
                            <Link href="/dashboard/exchange" className="w-full text-center border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 mt-4">
                                <ArrowRightLeft size={16} /> Exchange Funds
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Profile Summary Card */}
                <div className="premium-card bg-slate-900 text-white border-0 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16" />

                    <h2 className="font-black text-slate-500 text-[10px] uppercase tracking-[0.2em] mb-6 relative z-10">Account Identity</h2>

                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-primary shadow-lg shadow-black/50">
                                <UserIcon size={28} />
                            </div>
                            <div>
                                <div className="text-lg font-black truncate max-w-[140px]">{user.username || "User"}</div>
                                <div className="text-[10px] text-slate-400 font-mono">ID: {user.id.split('-')[0]}</div>
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <span className="text-xs text-slate-400 font-medium">Joined On</span>
                                <span className="text-xs font-bold">{new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-800">
                                <span className="text-xs text-slate-400 font-medium">Total Tasks</span>
                                <span className="text-xs font-bold text-primary">{user.tasksDone.length} Done</span>
                            </div>
                        </div>

                        <Link href="/dashboard/settings" className="block text-center text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors pt-4">
                            Manage Profile Settings
                        </Link>
                    </div>
                </div>
            </div>

            {/* Task History Table Section */}
            <div className="premium-card p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">Recent Activity</h2>
                        <p className="text-slate-400 text-xs font-medium">Your latest earning transactions and tasks.</p>
                    </div>
                    <Link href="/dashboard/earn/tasks" className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">View All Activity</Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Type</th>
                                <th className="px-6 py-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Date & Time</th>
                                <th className="px-6 py-4 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right">Reward</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {(user.tasksDone || []).map((log: any) => (
                                <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3 transition-transform group-hover:translate-x-1 duration-200">
                                            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600">
                                                <CheckCircle size={16} strokeWidth={2.5} />
                                            </div>
                                            <span className="font-bold text-slate-700 dark:text-slate-300">Reward Collected</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-slate-500 font-medium">
                                        {new Date(log.timestamp).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-5 text-right font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                                        +${log.earnedAmount.toFixed(4)}
                                    </td>
                                </tr>
                            ))}
                            {user.tasksDone.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center gap-2 opacity-30">
                                            <ShieldCheck size={48} />
                                            <p className="font-black text-[10px] uppercase tracking-[.2em]">No transactions recorded yet</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

// Helper icons needed by new UI (Adding imports above)
import { LogOut } from "lucide-react";
