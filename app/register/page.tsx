"use client";

import { register } from "@/actions/register";
import { useActionState } from "react";
import Link from "next/link";
import { UserPlus, Globe } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Social } from "@/components/auth/Social";

export default function RegisterPage() {
    const [errorMessage, dispatch, isPending] = useActionState(register, undefined);
    const { t, language, setLanguage } = useLanguage();

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ar" : "en");
    };

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-muted p-4">
            <div className="w-full max-w-sm bg-white border border-gray-200 rounded p-8 shadow-sm">

                <div className="text-center mb-6">
                    <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                        <UserPlus size={24} />
                    </div>
                    <h1 className="text-xl font-bold text-gray-700">{t("auth.registration")}</h1>
                </div>

                <form action={dispatch} className="space-y-4">
                    <div className="mb-4">
                        <Social />
                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-gray-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-gray-500">
                                    Or register with
                                </span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <input
                            name="username"
                            type="text"
                            required
                            className="w-full p-3 border border-gray-300 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm transition-colors"
                            placeholder={t("auth.username")}
                        />
                    </div>

                    <div>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full p-3 border border-gray-300 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm transition-colors"
                            placeholder={t("auth.email") || "Email"}
                        />
                    </div>

                    <div>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full p-3 border border-gray-300 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none text-sm transition-colors"
                            placeholder={t("auth.password")}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded text-sm transition-colors disabled:opacity-50"
                    >
                        {isPending ? t("auth.creating_account") : t("auth.create_account")}
                    </button>

                    {errorMessage && (
                        <div className="text-red-600 text-xs text-center bg-red-50 p-2 rounded border border-red-100">
                            {t(`auth.errors.${errorMessage.toLowerCase()}`) || t("auth.errors.invalid")}
                        </div>
                    )}

                    <p className="text-xs text-gray-400 text-center mt-2">
                        {t("auth.terms")}
                    </p>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500 border-t border-gray-100 pt-4">
                    {t("auth.have_account")}{" "}
                    <Link href="/login" className="text-green-600 hover:underline font-bold">
                        {t("auth.login_here")}
                    </Link>
                </div>

                {/* Language Toggle */}
                <div className="mt-8 border-t border-gray-100 pt-4 flex justify-center">
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-wider"
                    >
                        <Globe size={14} />
                        {language === "en" ? "العربية" : "English"}
                    </button>
                </div>
            </div>
        </div>
    );
}
