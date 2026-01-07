import { getPendingTransactions, approveTransaction, rejectTransaction } from "@/actions/admin-finance";
import { auth } from "@/auth";

export default async function AdminTransactionsPage() {
    const session = await auth();
    // In a real app, strict role check here: if (session?.user?.role !== "ADMIN") redirect("/");

    const transactions = await getPendingTransactions();

    return (
        <div className="space-y-6" dir="rtl">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">المعاملات المعلقة</h1>
            </div>

            <div className="glass-card p-6 overflow-x-auto">
                <table className="w-full text-right">
                    <thead>
                        <tr className="text-gray-400 border-b border-white/10">
                            <th className="pb-3 px-4">المستخدم</th>
                            <th className="pb-3 px-4">المبلغ</th>
                            <th className="pb-3 px-4">النوع</th>
                            <th className="pb-3 px-4">المحفظة / المرسل</th>
                            <th className="pb-3 px-4">التاريخ</th>
                            <th className="pb-3 px-4 text-center">الإجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                                <td className="py-4 px-4">
                                    <div className="font-medium text-white">{tx.user.username || tx.user.email}</div>
                                    <div className="text-xs text-gray-500">{tx.user.email}</div>
                                </td>
                                <td className="py-4 px-4 font-mono text-green-400 font-bold">
                                    ${tx.amount.toFixed(2)}
                                </td>
                                <td className="py-4 px-4">
                                    <span className={`px-2 py-1 rounded text-xs ${tx.type === 'DEPOSIT' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                        {tx.type === 'DEPOSIT' ? 'إيداع' : 'سحب'}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-300">
                                    {tx.type === 'DEPOSIT' ? (
                                        <div title={tx.senderWallet || "N/A"}>
                                            <span className="text-xs text-gray-500 block mb-1">من:</span>
                                            <span className="font-mono bg-white/5 px-2 py-1 rounded select-all">{tx.senderWallet}</span>
                                        </div>
                                    ) : (
                                        <div title={tx.wallet || "N/A"}>
                                            <span className="text-xs text-gray-500 block mb-1">إلى:</span>
                                            <span className="font-mono bg-white/5 px-2 py-1 rounded select-all">{tx.wallet}</span>
                                        </div>
                                    )}
                                </td>
                                <td className="py-4 px-4 text-sm text-gray-400">
                                    {new Date(tx.timestamp).toLocaleString('ar-EG')}
                                </td>
                                <td className="py-4 px-4 text-center">
                                    <div className="flex justify-center gap-2">
                                        <form action={async () => {
                                            "use server";
                                            await approveTransaction(tx.id, session?.user?.id || "admin");
                                        }}>
                                            <button className="bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded text-sm transition-colors shadow-lg shadow-green-900/20">
                                                تأكيد
                                            </button>
                                        </form>

                                        <form action={async () => {
                                            "use server";
                                            await rejectTransaction(tx.id, session?.user?.id || "admin");
                                        }}>
                                            <button className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1 rounded text-sm border border-red-500/30 transition-colors">
                                                إلغاء
                                            </button>
                                        </form>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {transactions.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        لا توجد معاملات معلقة.
                    </div>
                )}
            </div>
        </div>
    );
}
