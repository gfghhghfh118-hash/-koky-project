"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Globe, Moon, Sun, Monitor, Shield, Settings as SettingsIcon, Bell, User } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
    const { t, language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();

    const isAr = language === "ar";

    return (
        <div className="max-w-4xl mx-auto py-10 px-4 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700" dir={isAr ? "rtl" : "ltr"}>
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center gap-2">
                    <span className="bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] px-2.5 py-1 rounded-full border border-primary/20">Control Center</span>
                </div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-4">
                    <SettingsIcon className="text-primary" size={32} />
                    {t("sidebar.settings")}
                </h1>
                <p className="text-slate-500 text-sm font-medium">
                    {isAr ? "تخصيص تجربتك وتعديل تفضيلات الحساب." : "Customize your experience and manage account preferences."}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Language Selection */}
                <div className="premium-card p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                            <Globe size={20} />
                        </div>
                        <h2 className="text-lg font-black tracking-tight">{t("sidebar.language")}</h2>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => setLanguage("ar")}
                            className={cn(
                                "w-full p-4 rounded-2xl border transition-all flex items-center justify-between group",
                                language === "ar"
                                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-500/50"
                            )}
                        >
                            <span className="font-bold">العربية (Arabic)</span>
                            {language === "ar" && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                        </button>

                        <button
                            onClick={() => setLanguage("en")}
                            className={cn(
                                "w-full p-4 rounded-2xl border transition-all flex items-center justify-between group",
                                language === "en"
                                    ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                                    : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-blue-500/50"
                            )}
                        >
                            <span className="font-bold">English (الإنجليزية)</span>
                            {language === "en" && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                        </button>
                    </div>
                </div>

                {/* Theme Selection */}
                <div className="premium-card p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                            <Monitor size={20} />
                        </div>
                        <h2 className="text-lg font-black tracking-tight">{isAr ? "المظهر (Theme)" : "Appearance"}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => setTheme("light")}
                            className={cn(
                                "p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 group",
                                theme === "light"
                                    ? "bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/20"
                                    : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-amber-500/50"
                            )}
                        >
                            <Sun size={24} className={cn(theme === "light" ? "text-white" : "text-amber-500")} />
                            <span className="text-sm font-black">{t("sidebar.light_mode")}</span>
                        </button>

                        <button
                            onClick={() => setTheme("dark")}
                            className={cn(
                                "p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 group",
                                theme === "dark"
                                    ? "bg-slate-800 border-slate-800 text-white shadow-lg"
                                    : "bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-400"
                            )}
                        >
                            <Moon size={24} className={cn(theme === "dark" ? "text-blue-400" : "text-slate-400")} />
                            <span className="text-sm font-black">{t("sidebar.dark_mode")}</span>
                        </button>
                    </div>
                </div>

                {/* Account Section (Placeholder for consistency) */}
                <div className="premium-card p-8 space-y-6 opacity-60">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-slate-500/10 text-slate-600">
                            <User size={20} />
                        </div>
                        <h2 className="text-lg font-black tracking-tight">{isAr ? "الأمان" : "Security"}</h2>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {isAr ? "سيتم قريباً إضافة إمكانية تغيير كلمة المرور وتفعيل المصادقة الثنائية." : "Password change and 2FA settings will be available soon."}
                    </p>
                </div>

                <div className="premium-card p-8 space-y-6 opacity-60">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-red-500/10 text-red-600">
                            <Bell size={20} />
                        </div>
                        <h2 className="text-lg font-black tracking-tight">{isAr ? "الإشعارات" : "Notifications"}</h2>
                    </div>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                        {isAr ? "تحكم في إشعارات البريد الإلكتروني والرسائل المنبثقة." : "Manage your email and push notification preferences."}
                    </p>
                </div>
            </div>
        </div>
    );
}
