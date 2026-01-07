"use client";

import { useEffect, useState } from "react";
import { getModerationFeed, toggleTaskBan } from "@/actions/admin-moderation";
import { ShieldAlert, CheckCircle, Ban, Loader2 } from "lucide-react";

export default function ModerationPage() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        const data = await getModerationFeed();
        setTasks(data);
        setLoading(false);
    };

    const handleBan = async (taskId: string, currentStatus: string) => {
        // Optimistic UI update
        const newStatus = currentStatus === "BANNED" ? "APPROVED" : "BANNED";
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, adminStatus: newStatus } : t));

        const res = await toggleTaskBan(taskId, currentStatus);

        if (res.error) {
            // Revert on error
            alert(res.error);
            loadTasks();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Content Moderation</h1>
                    <p className="text-slate-500">Monitor and ban illegal or policy-violating tasks.</p>
                </div>
                <button onClick={loadTasks} className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                    Refresh Feed
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="animate-spin text-slate-400" size={32} />
                </div>
            ) : (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
                            <tr>
                                <th className="px-6 py-4">Task Info</th>
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {tasks.map((task) => (
                                <tr key={task.id} className="hover:bg-slate-50 transition">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{task.title || "No Title"}</div>
                                        <div className="text-xs text-slate-500 font-mono truncate max-w-[200px]">{task.url}</div>
                                        <div className="mt-1 inline-block text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                                            {task.type}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium">{task.creator?.username || task.creator?.name || task.creator?.email || "Unknown"}</div>
                                        <div className="text-xs text-slate-400">{task.creator?.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {task.adminStatus === "BANNED" ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                <Ban size={12} /> Banned
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                                                <CheckCircle size={12} /> Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleBan(task.id, task.adminStatus)}
                                                className={`text-xs font-bold px-3 py-1.5 rounded-lg transition flex items-center gap-1 ${task.adminStatus === "BANNED"
                                                    ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100"
                                                    : "bg-amber-50 text-amber-600 hover:bg-amber-100 border border-amber-100"
                                                    }`}
                                            >
                                                {task.adminStatus === "BANNED" ? (
                                                    <><CheckCircle size={12} /> Unban</>
                                                ) : (
                                                    <><Ban size={12} /> Ban</>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {tasks.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                        No active tasks found to moderate.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
