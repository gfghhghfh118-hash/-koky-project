"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Globe, Moon, Sun, Monitor, Shield, Settings as SettingsIcon, Bell, User, Lock, Briefcase, CheckCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { changePassword, updateUserPreferences } from "@/actions/user-settings";

export default function SettingsPage() {
    const { t, language, setLanguage } = useLanguage();
    const { theme, setTheme } = useTheme();
    const isAr = language === "ar";

    // Password State
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [passMsg, setPassMsg] = useState("");
    const [passLoading, setPassLoading] = useState(false);

    // Prefs State (Mock default for UI until we fetch or pass via props)
    // Ideally we fetch user data on server component and pass it here, 
    // but for now let's assume default or loading state.
    // To make it simple, we just have the toggles update.
    const [notif, setNotif] = useState(true);
    const [role, setRole] = useState("WORKER");
    const [prefMsg, setPrefMsg] = useState("");

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setPassLoading(true);
        setPassMsg("");
        const res = await changePassword(oldPass, newPass);
        if (res.error) setPassMsg(`❌ ${res.error}`);
        else {
            setPassMsg("✅ Password Changed!");
            setOldPass("");
            setNewPass("");
        }
        setPassLoading(false);
    };

    const handlePrefUpdate = async (newRole: string, newNotif: boolean) => {
        setRole(newRole);
        setNotif(newNotif);
        const res = await updateUserPreferences({ accountType: newRole, allowNotifications: newNotif });
        if (res.success) setPrefMsg("✅ Saved");
    };

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

                {/* 1. Account & Role */}
                <div className="premium-card p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600">
                            <Briefcase size={20} />
                        </div>
                        <h2 className="text-lg font-black tracking-tight">{isAr ? "نوع الحساب" : "Account Type"}</h2>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => handlePrefUpdate("WORKER", notif)} className={cn("p-4 rounded-xl border transition-all", role === "WORKER" ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-slate-200 dark:border-slate-800")}>
                            <span className="font-bold block">Worker</span>
                            <span className="text-xs text-slate-500">Earnings & Tasks</span>
                        </button>
                        <button onClick={() => handlePrefUpdate("ADVERTISER", notif)} className={cn("p-4 rounded-xl border transition-all", role === "ADVERTISER" ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20" : "border-slate-200 dark:border-slate-800")}>
                            <span className="font-bold block">Advertiser</span>
                            <span className="text-xs text-slate-500">Campaigns & Ads</span>
                        </button>
                    </div>
                    {prefMsg && <p className="text-xs font-bold text-emerald-500 text-center">{prefMsg}</p>}
                </div>

                {/* 2. Notifications */}
                <div className="premium-card p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-red-500/10 text-red-600">
                            <Bell size={20} />
                        </div>
                        <h2 className="text-lg font-black tracking-tight">{isAr ? "الإشعارات" : "Notifications"}</h2>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-sm font-bold">{isAr ? "تلقي إشعارات المهام الجديدة" : "Receive New Task Alerts"}</span>
                        <div onClick={() => handlePrefUpdate(role, !notif)} className={cn("w-12 h-6 rounded-full p-1 cursor-pointer transition-colors", notif ? "bg-emerald-500" : "bg-slate-300")}>
                            <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm transition-transform", notif && "translate-x-6")} />
                        </div>
                    </div>
                </div>

                {/* 3. Password Change */}
                <div className="premium-card p-8 space-y-6 md:col-span-2">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-slate-900/10 dark:bg-white/10 text-slate-900 dark:text-white">
                            <Lock size={20} />
                        </div>
                        <h2 className="text-lg font-black tracking-tight">{isAr ? "تغيير كلمة المرور" : "Change Password"}</h2>
                    </div>

                    <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">{isAr ? "كلمة المرور الحالية" : "Current Password"}</label>
                            <input type="password" value={oldPass} onChange={e => setOldPass(e.target.value)} required className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 outline-none focus:ring-2 ring-primary/20" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-500 mb-1 block">{isAr ? "كلمة المرور الجديدة" : "New Password"}</label>
                            <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} required minLength={6} className="w-full p-3 rounded-xl border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 outline-none focus:ring-2 ring-primary/20" />
                        </div>
                        <button disabled={passLoading} className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
                            {passLoading ? "Updating..." : (isAr ? "تحديث كلمة المرور" : "Update Password")}
                        </button>
                        {passMsg && <p className="text-sm font-bold animate-pulse">{passMsg}</p>}
                    </form>
                </div>

                {/* 4. Language & Theme (Existing) */}
                <div className="premium-card p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                            <Globe size={20} />
                        </div>
                        <h2 className="text-lg font-black tracking-tight">{t("sidebar.language")}</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setLanguage("ar")} className={cn("p-3 rounded-xl border text-sm font-bold transition-all", language === "ar" ? "bg-blue-600 text-white border-blue-600" : "hover:border-blue-400")}>العربية</button>
                        <button onClick={() => setLanguage("en")} className={cn("p-3 rounded-xl border text-sm font-bold transition-all", language === "en" ? "bg-blue-600 text-white border-blue-600" : "hover:border-blue-400")}>English</button>
                    </div>
                </div>

                <div className="premium-card p-8 space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                            <Monitor size={20} />
                        </div>
                        <h2 className="text-lg font-black tracking-tight">{isAr ? "المظهر" : "Theme"}</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setTheme("light")} className={cn("p-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2", theme === "light" ? "bg-amber-500 text-white border-amber-500" : "hover:border-amber-400")}>
                            <Sun size={16} /> Light
                        </button>
                        <button onClick={() => setTheme("dark")} className={cn("p-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-center gap-2", theme === "dark" ? "bg-slate-800 text-white border-slate-800" : "hover:border-slate-600")}>
                            <Moon size={16} /> Dark
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
