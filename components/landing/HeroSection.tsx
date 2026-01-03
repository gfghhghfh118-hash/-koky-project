"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function HeroSection() {
    const { t } = useLanguage();

    return (
        <div className="relative pt-20 pb-16 md:pt-32 md:pb-24 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-5">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500 via-transparent to-transparent"></div>
            </div>

            <div className="max-w-4xl mx-auto px-4 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest mb-6 border border-green-200">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live & Growing
                </div>

                <h2 className="text-5xl md:text-7xl font-black mb-6 leading-[1.1] tracking-tight bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                    {t("landing.hero_title")}
                </h2>
                <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto font-medium">
                    {t("landing.hero_subtitle")}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Link href="/register" className="px-10 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl text-lg transition-all hover:scale-105 shadow-xl shadow-green-200 flex items-center justify-center gap-2 group">
                        {t("landing.start_earning")}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link href="/login" className="px-10 py-4 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-2xl text-lg border border-slate-200 transition-all hover:border-slate-300 flex items-center justify-center gap-2">
                        {t("landing.start_advertising")}
                    </Link>
                </div>
            </div>
        </div>
    );
}
