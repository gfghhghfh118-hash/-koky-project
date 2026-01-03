"use client";

import { register } from "@/actions/register";
import { useActionState } from "react";
import Link from "next/link";
import { UserPlus, Globe, CheckCircle, Smartphone, DollarSign, Users } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Social } from "@/components/auth/Social";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { setReferralCookie } from "@/actions/referrals";

function RegisterForm() {
    const [errorMessage, dispatch, isPending] = useActionState(register, undefined);
    const { t, language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ar" : "en");
    };

    // Referral Handling
    const searchParams = useSearchParams();
    const ref = searchParams.get("ref");
    const [referrer, setReferrer] = useState<string | null>(null);

    useEffect(() => {
        if (ref) {
            setReferralCookie(ref);
            setReferrer(ref);
        }
    }, [ref]);

    // Captcha State
    const [captcha, setCaptcha] = useState({ num1: 0, num2: 0, answer: 0 });

    useEffect(() => {
        // Generate random numbers for captcha only on client
        const n1 = Math.floor(Math.random() * 10);
        const n2 = Math.floor(Math.random() * 10);
        setCaptcha({ num1: n1, num2: n2, answer: n1 + n2 });
    }, []);

    return (
        <div className="min-h-screen w-full flex bg-slate-50 dark:bg-slate-900 font-sans">
            {/* LEFT SIDE: Promotional Content (Hidden on mobile) */}
            <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
                {/* Background Effects */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/30 blur-[120px] rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/20 blur-[120px] rounded-full -ml-32 -mb-32" />

                {/* Logo Area */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center font-black text-2xl shadow-lg shadow-blue-500/25">K</div>
                    <span className="font-black text-xl tracking-tight">Koky.bz</span>
                </div>

                {/* Main Value Prop */}
                <div className="relative z-10 space-y-8 max-w-lg">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm text-xs font-bold text-emerald-300">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Join 15,000+ Active Earners
                    </div>

                    <h1 className="text-5xl font-black tracking-tight leading-tight">
                        Start Earning Money <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                            From Day One.
                        </span>
                    </h1>

                    <p className="text-lg text-slate-300 font-medium leading-relaxed">
                        Complete simple tasks, watch videos, and invite friends to build a steady income stream. Fast payouts, secure platform.
                    </p>

                    {/* Features List */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400">
                                <DollarSign size={24} />
                            </div>
                            <div>
                                <div className="font-bold text-white">Instant Rewards</div>
                                <div className="text-xs text-slate-400">Get paid immediately after task approval</div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                                <Users size={24} />
                            </div>
                            <div>
                                <div className="font-bold text-white">High Referral Commission</div>
                                <div className="text-xs text-slate-400">Earn up to 10% from every friend you invite</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Copy */}
                <div className="relative z-10 text-xs text-slate-500 font-medium">
                    © 2024 Koky.bz Platform. All rights reserved.
                </div>
            </div>

            {/* RIGHT SIDE: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
                <div className="w-full max-w-md space-y-8">

                    {/* Header for Mobile (or Desktop Form Header) */}
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Create Account</h2>
                        <p className="text-slate-500 text-sm">Enter your details to access your dashboard.</p>
                    </div>

                    {/* Referral Badge */}
                    {referrer && (
                        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 border border-emerald-200 p-4 rounded-xl flex items-center gap-3">
                            <div className="bg-white p-2 rounded-full shadow-sm text-emerald-600">
                                <UserPlus size={18} />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Invited By</div>
                                <div className="font-black text-emerald-900 text-lg">{referrer}</div>
                            </div>
                        </div>
                    )}

                    <form action={(formData) => {
                        const mathAnswer = formData.get("captcha") as string;
                        if (parseInt(mathAnswer) !== captcha.answer) {
                            alert("Incorrect Captcha Answer");
                            return;
                        }
                        dispatch(formData);
                    }} className="space-y-5">

                        <div className="space-y-4">
                            <Social />

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-slate-200 dark:border-slate-700" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-slate-50 dark:bg-slate-900 px-2 text-slate-500 font-medium">
                                        Or continue with email
                                    </span>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Username</label>
                                <input
                                    name="username"
                                    type="text"
                                    required
                                    className="w-full p-3.5 rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium"
                                    placeholder="Choose a unique username"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Email Address</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full p-3.5 rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium"
                                    placeholder="name@example.com"
                                />
                            </div>

                            <div className="grid gap-2">
                                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full p-3.5 rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium"
                                    placeholder="••••••••"
                                />
                            </div>

                            {/* Math Captcha */}
                            <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-wide">Security Question</label>
                                <div className="flex items-center gap-3">
                                    <div className="bg-white dark:bg-slate-800 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-lg font-bold text-slate-700 dark:text-slate-300 select-none shadow-sm">
                                        {captcha.num1} + {captcha.num2} = ?
                                    </div>
                                    <input
                                        name="captcha"
                                        type="number"
                                        required
                                        className="flex-1 p-3 rounded-lg border border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none text-sm font-bold text-center"
                                        placeholder="Answer"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 font-bold py-4 rounded-xl text-sm transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
                        >
                            {isPending ? t("auth.creating_account") : "Create Free Account & Start Earning"}
                        </button>

                        {errorMessage && (
                            <div className="text-red-600 text-xs font-bold text-center bg-red-50 p-3 rounded-xl border border-red-100 animate-pulse">
                                {t(`auth.errors.${errorMessage.toLowerCase()}`) || errorMessage}
                            </div>
                        )}

                        <p className="text-xs text-slate-400 text-center leading-relaxed px-4">
                            By creating an account, you agree to our <Link href="/terms" className="underline hover:text-slate-600">Terms of Service</Link> and <Link href="/privacy" className="underline hover:text-slate-600">Privacy Policy</Link>.
                        </p>
                    </form>

                    <div className="text-center pt-4">
                        <span className="text-sm text-slate-500 font-medium">Already have an account? </span>
                        <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold text-sm">
                            Sign in here
                        </Link>
                    </div>

                    <div className="flex justify-center pt-8">
                        <button onClick={toggleLanguage} className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
                            <Globe size={14} />
                            {language === "en" ? "العربية" : "English"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

// Wrap with Suspense
export default function RegisterContent() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin" /></div>}>
            <RegisterForm />
        </Suspense>
    );
}
