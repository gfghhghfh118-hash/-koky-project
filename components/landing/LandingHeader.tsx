"use client";

import Link from "next/link";
import { DollarSign, Globe } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { GoogleTranslate } from "@/components/GoogleTranslate";

import { useEffect } from "react";

export function LandingHeader() {
    // Referral Tracking Logic
    const { t, language, setLanguage } = useLanguage();

    // Check for referral code in URL and save it
    useEffect(() => {
        if (typeof window !== "undefined") {
            const params = new URLSearchParams(window.location.search);
            const ref = params.get("ref") || params.get("invite");
            if (ref) {
                localStorage.setItem("referralCode", ref);
                // Optional: Set cookie for server-side access if needed later
                document.cookie = `referralCode=${ref}; path=/; max-age=2592000`; // 30 days
            }
        }
    }, []);

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ar" : "en");
    };

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 py-4 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-green-600 text-white p-1.5 rounded-lg">
                        <DollarSign size={20} />
                    </div>
                    <h1 className="text-2xl font-black tracking-tighter text-slate-800">
                        KOKY<span className="text-green-600">.BZ</span>
                    </h1>
                </div>

                <div className="flex items-center gap-3 md:gap-6">
                    <div className="hidden md:block">
                        <GoogleTranslate />
                    </div>

                    <div className="flex gap-2 md:gap-4 items-center">
                        <Link href="#support" className="hidden sm:block text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors mr-2">
                            {t("landing.support.title")}
                        </Link>
                        <Link href="/login" className="px-4 md:px-6 py-2 text-sm font-bold text-slate-600 hover:text-green-600 border border-slate-300 rounded-full hover:border-green-500 transition-all">
                            {t("landing.login")}
                        </Link>
                        <Link href="/register" className="px-4 md:px-6 py-2 text-sm font-bold text-white bg-green-600 rounded-full hover:bg-green-700 transition-all shadow-md hover:shadow-lg active:scale-95">
                            {t("landing.register")}
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}
