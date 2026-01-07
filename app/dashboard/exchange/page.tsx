import { auth } from "@/auth";
import { db } from "@/lib/db";
import AdBalanceExchange from "@/components/AdBalanceExchange";
import { ArrowRightLeft } from "lucide-react";

export default async function ExchangePage() {
    const session = await auth();
    if (!session?.user?.id) return <div>Auth required</div>;

    const user = await db.user.findUnique({ where: { id: session.user.id } });
    const mainBalance = user?.balance || 0;
    const adBalance = user?.adBalance || 0;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-full">
                        <ArrowRightLeft size={24} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Exchange Funds</h1>
                        <p className="text-sm text-gray-500">Transfer earnings to your advertising balance</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                        <div className="text-xs text-green-600 font-bold uppercase mb-1">From: Main Balance</div>
                        <div className="text-2xl font-bold text-gray-800">${mainBalance.toFixed(4)}</div>
                        <div className="text-xs text-gray-400 mt-1">Available to withdraw or exchange</div>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <div className="text-xs text-blue-600 font-bold uppercase mb-1">To: Ad Balance</div>
                        <div className="text-2xl font-bold text-gray-800">${adBalance.toFixed(4)}</div>
                        <div className="text-xs text-gray-400 mt-1">For campaigns only</div>
                    </div>
                </div>

                <AdBalanceExchange userBalance={mainBalance} />
            </div>
        </div>
    );
}
