"use client";

import Link from "next/link";
import { MousePointerClick, ShieldCheck, DollarSign, Globe, ArrowRight, Percent, Users, MessageSquare, Send, Mail } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { createTicket } from "@/actions/support";
import { toast } from "sonner";
import { useState } from "react";

export default function Home() {
    const { t, language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ar" : "en");
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 border-t-4 border-green-600">

            {/* Header / Nav */}
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
                        <button
                            onClick={toggleLanguage}
                            className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-wider"
                        >
                            <Globe size={14} />
                            {language === "en" ? "العربية" : "English"}
                        </button>

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

            {/* Hero Section */}
            <main className="flex-1">
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

                {/* Promotional Section */}
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

                {/* Features Section */}
                <div className="max-w-6xl mx-auto px-4 py-20 border-t border-slate-100">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tighter uppercase italic">Why Choose Us</h2>
                        <div className="w-12 h-1 bg-green-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Feature 1: Simple Tasks */}
                        <div className="text-center group">
                            <div className="bg-blue-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                                <MousePointerClick size={36} />
                            </div>
                            <h3 className="text-xl font-extrabold mb-3 text-slate-800">Simple Tasks</h3>
                            <p className="text-slate-500 text-sm leading-relaxed px-4">
                                Earn money by completing simple micro-tasks like signing up for websites, liking posts, or testing apps.
                            </p>
                        </div>

                        {/* Feature 2: Watch Videos */}
                        <div className="text-center group">
                            <div className="bg-red-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-red-600 group-hover:scale-110 transition-transform">
                                <ArrowRight size={36} /> {/* Using ArrowRight temporarily as Play icon might not be imported, checking imports next */}
                            </div>
                            <h3 className="text-xl font-extrabold mb-3 text-slate-800">Watch Videos</h3>
                            <p className="text-slate-500 text-sm leading-relaxed px-4">
                                Get paid to watch YouTube videos. Just sit back, watch engaging content, and grow your balance.
                            </p>
                        </div>

                        {/* Feature 3: Surf Ads */}
                        <div className="text-center group">
                            <div className="bg-green-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-green-600 group-hover:scale-110 transition-transform">
                                <Globe size={36} />
                            </div>
                            <h3 className="text-xl font-extrabold mb-3 text-slate-800">Surf Websites</h3>
                            <p className="text-slate-500 text-sm leading-relaxed px-4">
                                Browse our advertiser's websites and get paid instantly for every visit. It's the easiest way to earn.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Support Section */}
                <div id="support" className="max-w-4xl mx-auto px-4 py-20 border-t border-slate-100">
                    <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row">
                        <div className="bg-slate-900 md:w-1/3 p-10 text-white flex flex-col justify-between">
                            <div>
                                <div className="bg-green-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-green-500/30">
                                    <MessageSquare size={24} className="text-green-400" />
                                </div>
                                <h3 className="text-2xl font-black mb-4">{t("landing.support.title")}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    {t("landing.support.subtitle")}
                                </p>
                            </div>

                            <div className="mt-12 space-y-4">
                                <div className="flex items-center gap-3 text-slate-300">
                                    <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                        <Mail size={14} />
                                    </div>
                                    <span className="text-xs font-bold tracking-wider">SUPPORT@KOKY.BZ</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-10">
                            <form action={async (formData) => {
                                console.log("Landing: Form Submit Clicked");
                                try {
                                    const dataObj = Object.fromEntries(formData.entries());
                                    console.log("Landing: Form Data:", dataObj);

                                    const res = await createTicket(formData);
                                    console.log("Landing: Action Response:", res);

                                    if (res.success) {
                                        toast.success(t("landing.support.success"));
                                        (document.getElementById("support-form") as HTMLFormElement)?.reset();
                                    } else {
                                        toast.error(t("landing.support.error"));
                                    }
                                } catch (err) {
                                    console.error("Landing Action Error:", err);
                                    toast.error("Connection error.");
                                }
                            }} id="support-form" className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">{t("landing.support.email")}</label>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                                            placeholder="your@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">{t("landing.support.whatsapp")}</label>
                                        <input
                                            name="whatsapp"
                                            type="text"
                                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                                            placeholder="+201..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">{t("landing.support.subject")}</label>
                                    <input
                                        name="subject"
                                        type="text"
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                                        placeholder={t("landing.support.subject")}
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">{t("landing.support.message")}</label>
                                    <textarea
                                        name="message"
                                        rows={4}
                                        required
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all resize-none"
                                        placeholder="..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                >
                                    <Send size={18} />
                                    {t("landing.support.submit")}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-slate-200 py-12 text-center">
                <div className="max-w-6xl mx-auto px-4">
                    <p className="text-sm font-bold text-slate-400 mb-4 tracking-widest uppercase">
                        &copy; 2024 Koky.bz Replica. Built for Excellence.
                    </p>
                    <div className="flex justify-center gap-6 text-slate-400">
                        <Link href="/privacy-policy" className="hover:text-slate-600 transition-colors">Terms</Link>
                        <Link href="/privacy-policy" className="hover:text-slate-600 transition-colors">Privacy</Link>
                        <Link href="/privacy-policy" className="hover:text-slate-600 transition-colors">Rules</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
