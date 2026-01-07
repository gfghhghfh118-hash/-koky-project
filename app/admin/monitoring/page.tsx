import { db } from "@/lib/db";
import { auth } from "@/auth";
import { penalizeUser } from "@/actions/social-tasks";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function MonitoringPage() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") redirect("/dashboard");

    const monitoredLogs = await db.taskLog.findMany({
        where: {
            monitorUntil: { gt: new Date() },
            status: "COMPLETED",
            isPenalized: false,
            socialTaskId: { not: null }
        },
        include: {
            user: true,
            socialTask: true
        },
        orderBy: { monitorUntil: "asc" }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">Social Monitoring</h1>

            <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
                        <tr>
                            <th className="p-4 font-black text-slate-500 uppercase tracking-wider">User</th>
                            <th className="p-4 font-black text-slate-500 uppercase tracking-wider">Task</th>
                            <th className="p-4 font-black text-slate-500 uppercase tracking-wider">Type</th>
                            <th className="p-4 font-black text-slate-500 uppercase tracking-wider">Monitor Until</th>
                            <th className="p-4 font-black text-slate-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                        {monitoredLogs.map((log) => (
                            <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <td className="p-4 font-bold text-slate-900 dark:text-white">
                                    {log.user.email} <br />
                                    <span className="text-xs text-slate-400 font-medium">ID: {log.user.id.slice(0, 8)}...</span>
                                </td>
                                <td className="p-4 font-medium text-slate-600 dark:text-slate-400 max-w-xs truncate">
                                    {log.socialTask?.title}
                                    <br />
                                    <a href={log.socialTask?.url} target="_blank" className="text-xs text-blue-500 hover:underline">View Link</a>
                                </td>
                                <td className="p-4">
                                    <span className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500">
                                        {log.socialTask?.type}
                                    </span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2 text-emerald-500 font-bold">
                                        <Clock size={14} />
                                        {/* @ts-ignore */}
                                        {log.monitorUntil?.toLocaleString()}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <form action={async () => {
                                        "use server";
                                        await penalizeUser(log.id, "Admin Manual Penalty: User undid action");
                                    }}>
                                        <button className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-colors">
                                            <AlertCircle size={14} />
                                            Penalize
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                        {monitoredLogs.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-400 font-medium">
                                    No monitored tasks found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
