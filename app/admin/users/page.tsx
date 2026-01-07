import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { banUser, updateUserRole } from "@/actions/admin-users";

export default async function AdminUsersPage() {
    const users = await db.user.findMany({
        take: 50,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { referrals: true } } }
    });

    return (
        <div className="space-y-6" dir="rtl">
            <h1 className="text-3xl font-bold text-white">إدارة المستخدمين</h1>

            <div className="glass-card p-6 overflow-x-auto">
                <table className="w-full text-right">
                    <thead>
                        <tr className="text-gray-400 border-b border-white/10">
                            <th className="pb-3 px-4">المستخدم</th>
                            <th className="pb-3 px-4">الرتبة</th>
                            <th className="pb-3 px-4">الرصيد</th>
                            <th className="pb-3 px-4">الإحالات</th>
                            <th className="pb-3 px-4 text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="font-medium text-white">{user.username || "بدون اسم"}</div>
                                    <div className="text-xs text-gray-500">{user.email}</div>
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-2 py-1 rounded text-xs ${user.role === "ADMIN" ? "bg-red-500/20 text-red-400" : user.role === "BANNED" ? "bg-gray-500/20 text-gray-400" : "bg-purple-500/20 text-purple-400"}`}>
                                        {user.role === "ADMIN" ? "مدير" : user.role === "BANNED" ? "محظور" : "مستخدم"}
                                    </span>
                                </td>
                                <td className="py-4 px-4 font-mono text-yellow-400">
                                    ${user.balance.toFixed(2)}
                                </td>
                                <td className="py-4 px-4 text-gray-400">
                                    {user._count.referrals}
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        {/* Admin Toggle Removed as per request */}

                                        <form action={async () => {
                                            "use server";
                                            await banUser(user.id);
                                        }}>
                                            <button className={`px-3 py-1 rounded text-sm border transition-colors ${user.role === "BANNED" ? "bg-green-600/20 text-green-400 border-green-500/30" : "bg-red-600/20 text-red-400 border-red-500/30"}`}>
                                                {user.role === "BANNED" ? "فك الحظر" : "حظر"}
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
