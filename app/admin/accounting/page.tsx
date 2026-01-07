import { db } from "@/lib/db";
import { DollarSign, Eye, EyeOff, Lock, TrendingUp, ArrowDownRight, History } from "lucide-react";
import { getAccountingStats, getRecentProfitLogs } from "@/actions/admin-accounting";

export default async function AdminAccountingPage() {
    const stats = await getAccountingStats();
    const logs = await getRecentProfitLogs();

    return (
        <div className="space-y-8 animate-in fade-in duration-500" dir="rtl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
                        <div className="p-2 bg-red-500/10 rounded-lg border border-red-500/20">
                            <Lock className="h-8 w-8 text-red-500" />
                        </div>
                        سجل الحسابات الرئيسي
                    </h2>
                    <p className="text-zinc-400 mt-2">تدقيق فوري لصحة المنصة والتزامات المستخدمين (سري للغاية).</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">تدقيق مباشر</span>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Liability Card */}
                <div className="group relative p-8 rounded-3xl bg-zinc-900/40 border border-white/5 overflow-hidden transition-all hover:border-white/10 hover:bg-zinc-900/60">
                    <div className="absolute top-0 left-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <ArrowDownRight className="h-24 w-24 text-white" />
                    </div>
                    <div className="relative space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">التزامات المستخدمين</span>
                            <Eye className="h-5 w-5 text-zinc-600" />
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white tracking-tight">
                                {stats.totalUserLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-lg font-normal text-zinc-500">EGP</span>
                            </div>
                            <p className="text-xs text-red-400/80 mt-2 font-medium flex items-center gap-1">
                                <ArrowDownRight className="h-3 w-3" />
                                إجمالي الديون المستحقة للمستخدمين
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profit Card */}
                <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/20 overflow-hidden transition-all hover:border-emerald-500/40 hover:from-emerald-500/15">
                    <div className="absolute top-0 left-0 p-4 opacity-20 group-hover:opacity-30 transition-opacity">
                        <TrendingUp className="h-24 w-24 text-emerald-500" />
                    </div>
                    <div className="relative space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">صافي ربح المنصة</span>
                            <DollarSign className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                            <div className="text-5xl font-black text-emerald-400 tracking-tighter">
                                +{stats.totalNetProfit.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-xl font-medium opacity-60">EGP</span>
                            </div>
                            <p className="text-xs text-emerald-500/80 mt-2 font-medium flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                الربح المحقق (مخفي عن المستخدمين)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Revenue Card */}
                <div className="group relative p-8 rounded-3xl bg-[#1a1a24] border border-white/5 overflow-hidden transition-all hover:border-white/10">
                    <div className="absolute top-0 left-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <EyeOff className="h-24 w-24 text-purple-500" />
                    </div>
                    <div className="relative space-y-4">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">إجمالي إيرادات الإعلانات</span>
                            <EyeOff className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white tracking-tight">
                                {stats.realAdRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })} <span className="text-lg font-normal text-zinc-500">EGP</span>
                            </div>
                            <p className="text-xs text-purple-400/80 mt-2 font-medium">
                                السيولة الفعلية المستلمة
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Logs Table */}
            <div className="rounded-3xl border border-white/5 bg-zinc-900/20 backdrop-blur-xl overflow-hidden shadow-2xl">
                <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-lg">
                            <History className="h-5 w-5 text-zinc-400" />
                        </div>
                        <h3 className="font-bold text-xl text-white">سجلات تدقيق الأرباح الأخيرة</h3>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] bg-black/20">
                            <tr>
                                <th className="px-8 py-4 font-bold">الوقت</th>
                                <th className="px-8 py-4 font-bold">المصدر / النشاط</th>
                                <th className="px-8 py-4 font-bold text-left">صافي الربح</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs.length > 0 ? logs.map((log) => (
                                <tr key={log.id} className="group hover:bg-white/[0.02] transition-colors">
                                    <td className="px-8 py-6 text-zinc-500 font-mono text-xs">
                                        {new Date(log.timestamp).toLocaleString('ar-EG')}
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-zinc-200 group-hover:text-white transition-colors">
                                                {log.source.replace(/_/g, ' ')}
                                            </span>
                                            <span className="text-xs text-zinc-500 mt-1">
                                                {log.description}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-left">
                                        <div className="inline-flex items-center px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                                            <span className="text-emerald-400 font-bold">
                                                +{log.amount.toFixed(2)} EGP
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={3} className="px-8 py-12 text-center text-zinc-500 italic">
                                        لا توجد سجلات أرباح بعد.
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
