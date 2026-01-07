"use client";

import { approvePromotion, rejectPromotion } from "@/actions/promo";
import { useState } from "react";

type Request = {
    id: string;
    videoUrl: string;
    status: string;
    adminNote: string | null;
    createdAt: Date;
    user: {
        username: string | null;
        email: string | null;
    };
};

export default function PromoRequestList({ initialRequests }: { initialRequests: any[] }) {
    // Note: merging types properly would be better but `any` is quick for now, casting below
    const [requests] = useState<Request[]>(initialRequests);
    const [generatedCode, setGeneratedCode] = useState<{ id: string, code: string } | null>(null);

    const handleApprove = async (id: string) => {
        if (!confirm("هل أنت متأكد من قبول الطلب؟ سيتم توليد كود تلقائي.")) return;

        const res = await approvePromotion(id);
        if (res.success && res.code) {
            setGeneratedCode({ id, code: res.code });
            alert(`✅ تم توليد الكود: ${res.code}\n\nانسخ الكود وأرسله للمستخدم!`);
        } else {
            alert("❌ حدث خطأ: " + res.error);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm("رفض الطلب؟")) return;
        await rejectPromotion(id);
    };

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">المستخدم</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الفيديو</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">الحالة</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">إجراءات</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {requests.map((req) => (
                        <tr key={req.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{req.user.username || "بدون اسم"}</div>
                                <div className="text-sm text-gray-500">{req.user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <a href={req.videoUrl} target="_blank" className="text-blue-600 hover:underline text-sm truncate max-w-xs block">
                                    {req.videoUrl}
                                </a>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${req.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        req.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                                            'bg-yellow-100 text-yellow-800'}`}>
                                    {req.status === 'APPROVED' ? 'مقبول' : req.status === 'REJECTED' ? 'مرفوض' : 'قيد الانتظار'}
                                </span>
                                {req.status === 'APPROVED' && req.adminNote && (
                                    <div className="text-xs text-gray-500 mt-1 font-mono">CODE: {req.adminNote}</div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {req.status === 'PENDING' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleApprove(req.id)}
                                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded shadow-sm"
                                        >
                                            قبول وتوليد كود
                                        </button>
                                        <button
                                            onClick={() => handleReject(req.id)}
                                            className="text-red-600 hover:text-red-900 px-3 py-1"
                                        >
                                            رفض
                                        </button>
                                    </div>
                                )}
                                {generatedCode?.id === req.id && (
                                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-center animate-pulse">
                                        <div className="text-xs text-gray-500">تم توليد الكود:</div>
                                        <div className="font-bold text-lg text-blue-800 select-all">{generatedCode.code}</div>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
