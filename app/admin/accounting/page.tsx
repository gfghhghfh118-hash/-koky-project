import { db } from "@/lib/db";
import { DollarSign, Eye, EyeOff, Lock } from "lucide-react";

export default async function AdminAccountingPage() {
    // Calculate total user balance (Liability)
    const users = await db.user.findMany();
    const totalUserLiabilities = users.reduce((acc, user) => acc + user.balance, 0);

    // In a real app we would query the AdminProfitLog sum, 
    // but for now we simulate the 'Spread' calculation.
    const hiddenProfit = 1250.50; // Mocked for demonstration
    const realAdRevenue = totalUserLiabilities + hiddenProfit;

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
                    <Lock className="h-6 w-6 text-red-500" />
                    Master Financial Ledger
                </h2>
                <p className="text-zinc-400">Private view of real platform revenue vs. user payouts.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* What Users SEE */}
                <div className="p-6 rounded-xl bg-zinc-900/50 border border-white/5 space-y-2 opacity-75">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-400">Total User Payouts (Liability)</span>
                        <Eye className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {totalUserLiabilities.toFixed(2)} EGP
                    </div>
                    <div className="text-xs text-red-400">
                        Money owed to users
                    </div>
                </div>

                {/* The SPREAD (Your Profit) */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-emerald-900/20 to-emerald-900/10 border border-emerald-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-emerald-400">Net Platform Profit</span>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </div>
                    <div className="text-4xl font-bold text-emerald-400">
                        +{hiddenProfit.toFixed(2)} EGP
                    </div>
                    <div className="text-xs text-emerald-500/60">
                        Hidden from users (Spread)
                    </div>
                </div>

                {/* Real Revenue */}
                <div className="p-6 rounded-xl bg-[#1e1e28] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-zinc-400">Total Ad Revenue</span>
                        <EyeOff className="h-4 w-4 text-purple-500" />
                    </div>
                    <div className="text-3xl font-bold text-white">
                        {realAdRevenue.toFixed(2)} EGP
                    </div>
                    <div className="text-xs text-purple-400">
                        Actual money received
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-white/5 bg-[#1e1e28] overflow-hidden">
                <div className="p-4 border-b border-white/5 bg-white/5">
                    <h3 className="font-medium text-white">Recent Profit Logs</h3>
                </div>
                <div className="p-0">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-zinc-400 uppercase bg-black/20">
                            <tr>
                                <th className="px-6 py-3">Source</th>
                                <th className="px-6 py-3">Real Price</th>
                                <th className="px-6 py-3">User Payout</th>
                                <th className="px-6 py-3 text-emerald-500">Your Cut</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            <tr className="bg-transparent hover:bg-white/5">
                                <td className="px-6 py-4 font-medium text-white">YouTube Task #192</td>
                                <td className="px-6 py-4">1.00 EGP</td>
                                <td className="px-6 py-4">0.20 EGP</td>
                                <td className="px-6 py-4 text-emerald-400 font-bold">+0.80 EGP</td>
                            </tr>
                            <tr className="bg-transparent hover:bg-white/5">
                                <td className="px-6 py-4 font-medium text-white">Surf Task #882</td>
                                <td className="px-6 py-4">0.50 EGP</td>
                                <td className="px-6 py-4">0.05 EGP</td>
                                <td className="px-6 py-4 text-emerald-400 font-bold">+0.45 EGP</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
