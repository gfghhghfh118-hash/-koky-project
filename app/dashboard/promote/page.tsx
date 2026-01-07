"use client";

import { useState } from "react";
import { submitPromotion } from "@/actions/promo";

export default function PromotePage() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const res = await submitPromotion(url);

        if (res.error) {
            setMessage("❌ " + res.error);
        } else {
            setMessage("✅ " + res.success);
            setUrl("");
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4 text-right">🎁 احصل على مكافأة الترويج</h1>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-right" dir="rtl">
                <p className="mb-4 text-gray-600">
                    هل قمت بإنشاء فيديو تشرح فيه موقعنا على يوتيوب أو تيك توك؟
                    <br />
                    أرسل لنا رابط الفيديو، وسنقوم بمراجعته. إذا تم قبول الفيديو، ستحصل على
                    <span className="font-bold text-green-600 mx-1">كود خاص</span>
                    يمنحك <span className="font-bold text-yellow-600">زيادة 10% في الأرباح</span>
                    لمدة 3 أشهر كاملة!
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">رابط الفيديو</label>
                        <input
                            type="url"
                            required
                            placeholder="https://youtube.com/watch?v=..."
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500 outline-none"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 transition"
                    >
                        {loading ? "جاري الإرسال..." : "أرسل الفيديو للمراجعة"}
                    </button>
                </form>

                {message && (
                    <div className={`mt-4 p-3 rounded text-center ${message.includes("❌") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                        {message}
                    </div>
                )}
            </div>

            <div className="mt-8 text-right bg-blue-50 p-4 rounded text-sm text-blue-800" dir="rtl">
                <h3 className="font-bold mb-2">الشروط:</h3>
                <ul className="list-disc list-inside space-y-1">
                    <li>يجب أن يكون الفيديو عاماً ومتاحاً للجميع.</li>
                    <li>يجب أن يحتوي الفيديو على شرح واضح للموقع.</li>
                    <li>سيتم مراجعة الطلب خلال 24-48 ساعة.</li>
                    <li>سيظهر لك الكود في قسم الإشعارات أو سيتم التواصل معك عند القبول.</li>
                </ul>
            </div>
        </div>
    );
}
