"use client";

import Link from "next/link";
import { Percent, Users } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export function PromoSection() {
    const { t } = useLanguage();

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Promo 1: Advertising Discount */}
                <div className="relative group overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] p-8 text-white shadow-xl shadow-blue-100 transition-transform hover:-translate-y-1">
                    <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Percent size={160} />
                    </div>
                    <div className="relative z-10">
                        <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                            <Percent size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{t("landing.promo_ads_title")}</h3>
                        <p className="text-blue-100 mb-6 text-balance max-w-sm">
                            {t("landing.promo_ads_desc")}
                        </p>
                        <Link href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 font-bold rounded-xl text-sm hover:bg-blue-50 transition-colors">
                            {t("landing.start_advertising")}
                        </Link>
                    </div>
                </div>

                {/* Promo 2: Referral Bonus */}
                <div className="relative group overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 rounded-[2rem] p-8 text-white shadow-xl shadow-amber-100 transition-transform hover:-translate-y-1">
                    <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
                        <Users size={160} />
                    </div>
                    <div className="relative z-10">
                        <div className="bg-white/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 backdrop-blur-sm">
                            <Users size={24} />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{t("landing.promo_ref_title")}</h3>
                        <p className="text-amber-500/10 mb-6 bg-white/10 p-4 rounded-xl text-white font-medium">
                            {t("landing.promo_ref_desc")}
                        </p>
                        <Link href="/register" className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-bold rounded-xl text-sm hover:bg-neutral-50 transition-colors">
                            {t("landing.start_earning")}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
