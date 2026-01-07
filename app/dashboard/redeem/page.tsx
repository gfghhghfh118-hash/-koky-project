"use client";

import { useState } from "react";
import { redeemPromoCode } from "@/actions/promo";

export default function RedeemPage() {
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleRedeem = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        const res = await redeemPromoCode(code.trim());

        if (res.error) {
            setMessage("❌ " + res.error);
        } else {
            setMessage("✅ " + res.success);
            setCode("");
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-6 text-center">تفعيل كود المكافأة</h1>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100" dir="rtl">
                <p className="mb-4 text-gray-600 text-sm text-center">
                    أدخل الكود الخاص بك للحصول على زيادة في الأرباح.
                </p>

                <form onSubmit={handleRedeem} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            required
                            placeholder="أدخل الكود هنا (مثلاً: VIDEO-123)"
                            className="w-full p-3 border rounded text-center text-lg uppercase tracking-wider focus:ring-2 focus:ring-blue-500 outline-none"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50 transition font-bold"
                    >
                        {loading ? "جاري التفعيل..." : "تفعيل الكود"}
                    </button>
                </form>

                {message && (
                    <div className={`mt-6 p-4 rounded text-center font-medium ${message.includes("❌") ? "bg-red-50 text-red-600" : "bg-green-50 text-green-600"}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}
