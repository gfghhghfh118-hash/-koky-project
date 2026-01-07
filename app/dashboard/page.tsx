import { auth } from "@/auth";
import { db } from "@/lib/db";
import { BannerSlot } from "@/components/BannerSlot";
import { SidebarAds } from "@/components/SidebarAds";
import { getBannerBatch } from "@/actions/banners";
import { Wallet, CheckCircle, ArrowRightLeft, Megaphone, TrendingUp, Clock, ShieldCheck, User as UserIcon, LogOut, Users } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function UserDashboard() {
    const session = await auth();
    if (!session?.user?.id) return <div className="p-8 glass rounded-2xl text-red-600 font-bold border-red-100 flex items-center gap-3">
        <ShieldCheck className="text-red-500" /> Not authenticated
    </div>;

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
            tasksDone: { take: 5, orderBy: { timestamp: 'desc' } },
            transactions: { take: 5, orderBy: { timestamp: 'desc' } }
        }
    });

    if (!user) return <div>User not found</div>;

    const bannersBatch = await getBannerBatch([{ type: "SIDEBAR", count: 5 }]);
    const greenAds = bannersBatch["SIDEBAR"] || [];

    return (
        <div className="space-y-8 pb-12">
            {/* 1. RED SQUARES: 8-Slot Ad Grid ($0.20/day) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-8">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="w-full aspect-video">
                        <BannerSlot type={`DASHBOARD_GRID_${i + 1}`} />
                    </div>
                ))}
            </div>

            {/* 2. SPLIT SECTION: Blue (Welcome) & Green (Ads) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

                {/* BLUE BOX: Welcome Section */}
                <div className="flex flex-col items-center justify-center text-center py-8 bg-blue-50/50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/20" />
                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4 shadow-lg shadow-blue-500/20">
                        <UserIcon size={36} strokeWidth={2.5} />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
                        Welcome, <span className="text-blue-600 dark:text-blue-400">{user.username || "User"}</span>
                    </h1>
                    <p className="text-slate-500 font-medium mb-4 flex items-center gap-2 bg-white dark:bg-slate-950 px-3 py-1 rounded-full shadow-sm border border-slate-100 dark:border-slate-800">
                        <span className="text-xs uppercase font-black text-slate-400 tracking-widest">ID</span>
                        <span className="font-mono text-slate-700 dark:text-slate-300">{user.id.split('-')[0]}</span>
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-emerald-100 dark:border-emerald-900/50 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Status: Worker
                        </span>
                    </div>
                </div>

                {/* GREEN BOX: $0.07 Ads Section (Moved from Sidebar Request) */}
                <div className="bg-emerald-50/50 dark:bg-emerald-900/5 border border-emerald-100 dark:border-emerald-900/20 rounded-3xl p-6 relative flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                                <Megaphone size={18} strokeWidth={2.5} />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-emerald-800 dark:text-emerald-400">Sponsored Links</span>
                        </div>
                        <span className="text-[10px] font-bold bg-white dark:bg-slate-950 text-emerald-600 border border-emerald-100 px-2 py-1 rounded-md shadow-sm">
                            $0.07 / Day
                        </span>
                    </div>
                    <div className="flex-1">
                        <SidebarAds ads={greenAds} displayPrice={0.07} />
                    </div>
                </div>

            </div>

            {/* Rejection Alert (Keep existing logic) */}
            {user.transactions.length > 0 && user.transactions[0].status === "REJECTED" && (
                <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3 mb-8">
                    <div className="bg-red-500 text-white p-2 rounded-xl shrink-0">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h3 className="font-black text-red-700 text-sm uppercase tracking-wide mb-1">Transaction Rejected</h3>
                        <p className="text-red-600/80 text-xs font-medium">
                            Your recent {user.transactions[0].type.toLowerCase()} request for ${user.transactions[0].amount.toFixed(2)} was rejected.
                        </p>
                    </div>
                </div>
            )}

            {/* 3. BLACK SQUARES: Split Promo Section (Referral & Video/Ad Rewards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {/* Square 1: Referral Program */}
                <Link href="/dashboard/invite" className="block transform transition-all hover:scale-[1.02]">
                    <div className="h-full bg-slate-900 text-white p-8 rounded-[2rem] relative overflow-hidden group shadow-2xl shadow-slate-900/20">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full -mr-10 -mt-10" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                                    <Users size={24} className="text-blue-400" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Referral Program</span>
                            </div>
                            <h3 className="text-3xl font-black leading-tight mb-4">
                                Earn <span className="text-blue-400">10%</span> Lifetime Commission
                            </h3>
                            <p className="text-slate-400 text-sm font-medium leading-relaxed">
                                Invite friends and earn 10% from every task they complete.
                            </p>
                        </div>
                    </div>
                </Link>

                {/* Square 2: Video & Ad Rewards */}
                <Link href="/dashboard/promote" className="block transform transition-all hover:scale-[1.02]">
                    <div className="h-full bg-slate-900 text-white p-8 rounded-[2rem] relative overflow-hidden group shadow-2xl shadow-slate-900/20">
                        <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full -ml-10 -mb-10" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md">
                                    <Megaphone size={24} className="text-purple-400" />
                                </div>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">Promo Rewards</span>
                            </div>
                            <h3 className="text-3xl font-black leading-tight mb-4">
                                Video & Ad <span className="text-purple-400">Rewards</span>
                            </h3>
                            <ul className="text-slate-400 text-sm font-medium space-y-2">
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                    10% Bonus on Video Promotions
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                                    10% Cashback on Ad Campaigns
                                </li>
                            </ul>
                        </div>
                    </div>
                </Link>
            </div>

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

                {/* Profile Summary Card (Keep as is, but maybe styling adjust if needed) */}
                <div className="premium-card bg-slate-900 text-white border-0 shadow-2xl overflow-hidden relative">
                    {/* ... existing profile content ... */}

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
            {/* Transaction History Section */}
            <div className="premium-card p-0 overflow-hidden mt-6">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                        <h2 className="font-black text-slate-900 dark:text-white text-lg tracking-tight">Financial History</h2>
                        <p className="text-slate-400 text-xs font-medium">Deposits and Withdrawals status.</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 dark:bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Type</th>
                                <th className="px-6 py-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Method</th>
                                <th className="px-6 py-4 font-black text-slate-400 text-[10px] uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 font-black text-slate-400 text-[10px] uppercase tracking-widest text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {(user.transactions || []).map((tx: any) => (
                                <tr key={tx.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                                    <td className="px-6 py-5 font-bold text-slate-700 dark:text-slate-300">
                                        {tx.type}
                                    </td>
                                    <td className="px-6 py-5 text-slate-500 text-xs">
                                        {tx.method}
                                        <div className="text-[10px] opacity-70 truncate max-w-[150px]">
                                            {tx.type === 'DEPOSIT' ? tx.senderWallet : tx.wallet}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${tx.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-700' :
                                            tx.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                                                'bg-amber-100 text-amber-700'
                                            }`}>
                                            {tx.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right font-black tabular-nums">
                                        {tx.type === 'DEPOSIT' ? '+' : '-'}${tx.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                            {user.transactions?.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                                        No financial transactions found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}


