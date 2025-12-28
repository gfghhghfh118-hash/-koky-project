import { getAdminStats } from "../../actions/admin";
import { CreateTaskForm } from "../../components/CreateTaskForm";
import { db } from "../../lib/db"; // Direct DB access for server component is fine

export default async function AdminDashboard() {
    const stats = await getAdminStats();
    const tasks = await db.task.findMany({ orderBy: { createdAt: "desc" } });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <p className="text-gray-400">Manage tasks and monitor profits</p>
                </div>
                <div className="glass px-6 py-3 rounded-xl border-green-500/20 text-green-400">
                    <span className="text-xs text-gray-500 block">Total Secret Profit</span>
                    <span className="text-2xl font-bold font-mono">
                        ${(stats.totalProfit || 0).toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Task Form */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-semibold mb-6">Create New Task</h2>
                    <CreateTaskForm />
                </div>

                {/* Task List */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-semibold mb-6">Recent Tasks</h2>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                        {tasks.map(task => (
                            <div key={task.id} className="p-4 rounded-lg bg-black/20 border border-white/5 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">{task.title}</h3>
                                    <p className="text-xs text-gray-500">{task.type} • {task.duration}s</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-400">User: <span className="text-green-400">${task.userPayout}</span></div>
                                    <div className="text-xs text-gray-600">Admin: <span className="text-red-400">${(task.realPrice - task.userPayout).toFixed(2)}</span></div>
                                </div>
                            </div>
                        ))}
                        {tasks.length === 0 && <p className="text-gray-500 text-center py-10">No tasks created yet.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
