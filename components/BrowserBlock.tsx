"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Chrome } from "lucide-react";

export function BrowserBlock() {
    const [isEdge, setIsEdge] = useState(false);

    useEffect(() => {
        const ua = window.navigator.userAgent;
        if (ua.indexOf("Edg") > -1 || ua.indexOf("MSIE") > -1 || ua.indexOf("Trident") > -1) {
            setIsEdge(true);
        }
    }, []);

    if (!isEdge) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center p-6 text-center">
            <div className="max-w-md">
                <div className="bg-red-100 text-red-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle size={48} />
                </div>
                <h1 className="text-2xl font-black text-slate-800 mb-4">
                    Browser Compatibility Error
                </h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Oops! This version of Microsoft Edge is currently not supported for login due to security configuration.
                    <br />
                    <span className="font-bold text-slate-800">Please use Google Chrome for the best experience.</span>
                </p>

                <div className="bg-slate-100 p-4 rounded-2xl flex items-center gap-4 text-left border border-slate-200">
                    <div className="bg-white p-3 rounded-xl shadow-sm">
                        <Chrome size={24} className="text-blue-500" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-700">Recommended Browser</p>
                        <p className="text-xs text-slate-500">Google Chrome (Latest Version)</p>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-100">
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                        Koky.bz Security System
                    </p>
                </div>

                {/* Arabic Translation */}
                <div className="mt-8 text-right font-sans" dir="rtl">
                    <p className="text-lg font-bold text-slate-800 mb-2">عذراً! هذا المتصفح غير مدعوم حالياً</p>
                    <p className="text-slate-500 text-sm">
                        يرجى استخدام متصفح <span className="font-bold text-blue-600">Google Chrome</span> لضمان عمل كافة الوظائف وتسجيل الدخول بنجاح.
                    </p>
                </div>
            </div>
        </div>
    );
}
