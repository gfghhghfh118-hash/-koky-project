import { revalidatePath } from "next/cache";

async function clearCache() {
    "use server";
    revalidatePath("/", "layout");
}

export default function AdminSettingsPage() {
    return (
        <div className="space-y-8" dir="rtl">
            <h1 className="text-3xl font-bold text-white">إعدادات النظام</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 border border-white/10">
                    <h2 className="text-xl font-semibold text-white mb-4">معلومات النظام</h2>
                    <div className="space-y-2 text-gray-400 text-sm">
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span>الإصدار</span>
                            <span className="text-white">1.0.0 Beta</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span>الحالة</span>
                            <span className="text-emerald-400">نشط ✅</span>
                        </div>
                        <div className="flex justify-between border-b border-white/5 pb-2">
                            <span>بيئة العمل</span>
                            <span className="text-blue-400">Production</span>
                        </div>
                    </div>
                </div>

                <div className="glass-card p-6 border border-red-500/20">
                    <h2 className="text-xl font-semibold text-white mb-4">الصيانة</h2>
                    <p className="text-sm text-gray-400 mb-4">
                        استخدم هذه الأدوات بحذر. مسح التخزين المؤقت قد يؤثر على سرعة الموقع مؤقتاً.
                    </p>
                    <form action={clearCache}>
                        <button className="w-full py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl transition-colors font-bold shadow-lg shadow-red-900/20">
                            🔃 مسح التخزين المؤقت (Cache)
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
