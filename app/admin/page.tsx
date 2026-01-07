import { getAdminStats } from "../../actions/admin";
import { CreateTaskForm } from "../../components/CreateTaskForm";
import { db } from "../../lib/db"; // Direct DB access for server component is fine

export default async function AdminDashboard() {
    const stats = await getAdminStats();
    const tasks = await db.task.findMany({ orderBy: { createdAt: "desc" } });

    return (
        <div className="space-y-8" dir="rtl">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">لوحة تحكم المدير</h1>
                    <p className="text-gray-400">إدارة المهام ومراقبة الأرباح</p>
                </div>
                <div className="glass px-6 py-3 rounded-xl border-green-500/20 text-green-400">
                    <span className="text-xs text-gray-500 block">إجمالي الأرباح</span>
                    <span className="text-2xl font-bold font-mono">
                        ${(stats.totalProfit || 0).toFixed(2)}
                    </span>
                </div>
            </div>

            {/* Quick Navigation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/admin/transactions" className="glass-card p-6 rounded-xl hover:bg-white/5 transition flex flex-col items-center text-center cursor-pointer border border-green-500/30">
                    <span className="text-3xl mb-2">💰</span>
                    <h3 className="font-bold text-lg text-white">المعاملات</h3>
                    <p className="text-xs text-gray-400">الموافقة على الإيداع والسحب</p>
                </a>
                <a href="/admin/users" className="glass-card p-6 rounded-xl hover:bg-white/5 transition flex flex-col items-center text-center cursor-pointer border border-blue-500/30">
                    <span className="text-3xl mb-2">👥</span>
                    <h3 className="font-bold text-lg text-white">المستخدمين</h3>
                    <p className="text-xs text-gray-400">إدارة الرصيد والحظر</p>
                </a>
                <a href="/admin/moderation" className="glass-card p-6 rounded-xl hover:bg-white/5 transition flex flex-col items-center text-center cursor-pointer border border-red-500/30">
                    <span className="text-3xl mb-2">🛡️</span>
                    <h3 className="font-bold text-lg text-white">الإشراف</h3>
                    <p className="text-xs text-gray-400">مراجعة والموافقة على المحتوى</p>
                </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Create Task Form */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-semibold mb-6">إنشاء مهمة جديدة</h2>
                    <CreateTaskForm />
                </div>

                {/* Task List */}
                <div className="glass-card p-6">
                    <h2 className="text-xl font-semibold mb-6">المهام الأخيرة</h2>
                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                        {tasks.map(task => (
                            <div key={task.id} className="p-4 rounded-lg bg-black/20 border border-white/5 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold">{task.title}</h3>
                                    <p className="text-xs text-gray-500">{task.type} • {task.duration}s</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-400">المستخدم: <span className="text-green-400">${task.userPayout}</span></div>
                                    <div className="text-xs text-gray-600">المدير: <span className="text-red-400">${(task.realPrice - task.userPayout).toFixed(2)}</span></div>
                                </div>
                            </div>
                        ))}
                        {tasks.length === 0 && <p className="text-gray-500 text-center py-10">لم يتم إنشاء مهام بعد.</p>}
                    </div>
                </div>
            </div>
        </div >
    );
}
