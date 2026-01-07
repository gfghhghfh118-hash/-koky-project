"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlayCircle, DollarSign, Settings, LogOut, Briefcase, Youtube, MousePointerClick, MessageSquare, ArrowRightLeft, Globe, Users, Menu, ChevronLeft, ChevronRight, X, History, Megaphone, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./ThemeToggle";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { logout } from "@/actions/logout";

interface UserSidebarProps {
    balance: number;
    adBalance: number;
    role?: string;
    sidebarBanner?: React.ReactNode;
}

export function UserSidebar({ balance, adBalance, role, sidebarBanner }: UserSidebarProps) {
    const pathname = usePathname();
    const { t, language, setLanguage } = useLanguage();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    const linkBaseClass = cn(
        "flex items-center gap-3 px-5 py-2.5 transition-all duration-200 border-l-4 border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900 group whitespace-nowrap",
        isCollapsed && "justify-center px-2"
    );

    const activeLinkClass = "bg-primary/5 border-primary text-primary font-semibold shadow-[inset_1px_0_0_0_rgba(37,99,235,0.1)]";

    const earnItems = [
        { name: t("sidebar.surfing"), href: "/dashboard/earn/surfing", icon: MousePointerClick },
        { name: t("sidebar.youtube"), href: "/dashboard/earn/youtube", icon: Youtube },
        { name: t("sidebar.tasks"), href: "/dashboard/earn/tasks", icon: Briefcase },
    ];

    const financeItems = [
        { name: t("sidebar.deposit"), href: "/dashboard/deposit", icon: DollarSign },
        { name: t("sidebar.withdraw"), href: "/dashboard/withdraw", icon: LogOut },
        { name: t("sidebar.exchange"), href: "/dashboard/exchange", icon: ArrowRightLeft },
        { name: t("sidebar.transactions"), href: "/dashboard/transactions", icon: History },
        { name: language === "ar" ? "تفعيل كود" : "Redeem Code", href: "/dashboard/redeem", icon: Gift },
    ];

    const promoItems = [
        { name: language === "ar" ? "مكافآت الفيديو" : "Video Rewards", href: "/dashboard/promote", icon: Megaphone },
    ];

    const toggleLanguage = () => {
        setLanguage(language === "en" ? "ar" : "en");
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <div className="md:hidden fixed top-4 left-4 z-50">
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-200"
                >
                    {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Overlay for Mobile */}
            {isMobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <div className={cn(
                "fixed inset-y-0 left-0 z-50 md:relative bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col text-sm shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300",
                isCollapsed ? "w-20" : "w-64",
                // Mobile behavior:
                "md:translate-x-0", // Always show on desktop (transform reset)
                !isMobileOpen && "-translate-x-full md:translate-x-0" // Hide on mobile unless open
            )}>

                {/* Logo Area */}
                <div className={cn("p-6 mb-2 flex items-center justify-between", isCollapsed && "justify-center p-4")}>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <h1 className="text-2xl font-black tracking-tighter flex items-center gap-2">
                                <span className="bg-gradient-to-br from-blue-600 to-indigo-700 bg-clip-text text-transparent italic">KOKY</span>
                                <span className="text-slate-400 font-light">.BZ</span>
                            </h1>
                            <span className="text-[9px] text-emerald-500 font-bold tracking-widest uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded w-fit">v2.1 Mobile Ready</span>
                        </div>
                    )}
                    {/* Desktop Toggle */}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 transition-colors"
                        title={isCollapsed ? "Expand" : "Collapse"}
                    >
                        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-2 space-y-8 custom-scrollbar">
                    {/* Sidebar Banner (Hidden if Collapsed) */}
                    {!isCollapsed && (
                        <div className="px-2 animate-in fade-in duration-500">
                            {sidebarBanner}
                        </div>
                    )}

                    {/* Main Section */}
                    <div>
                        {role === "ADMIN" && (
                            <>
                                <Link
                                    href="/admin"
                                    title={t("sidebar.admin_dashboard")}
                                    className={cn(linkBaseClass, pathname === "/admin" && activeLinkClass, "rounded-lg border-l-0 mx-2 mb-1 bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30")}
                                >
                                    <LayoutDashboard size={18} className="text-red-500 min-w-[18px]" />
                                    {!isCollapsed && <span className="tracking-tight font-bold">{t("sidebar.admin_dashboard")}</span>}
                                </Link>
                                <Link
                                    href="/admin/users"
                                    title={t("sidebar.users_management")}
                                    className={cn(linkBaseClass, pathname.startsWith("/admin/users") && activeLinkClass, "rounded-lg border-l-0 mx-2 mb-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30")}
                                >
                                    <Users size={18} className="text-red-500 min-w-[18px]" />
                                    {!isCollapsed && <span className="tracking-tight font-bold">{t("sidebar.users_management")}</span>}
                                </Link>
                                <Link
                                    href="/admin/advertisements"
                                    title="Ad Management"
                                    className={cn(linkBaseClass, pathname.startsWith("/admin/advertisements") && activeLinkClass, "rounded-lg border-l-0 mx-2 mb-2 bg-red-500/10 text-red-600 hover:bg-red-500/20 hover:text-red-700 dark:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-500/30")}
                                >
                                    <Megaphone size={18} className="text-red-500 min-w-[18px]" />
                                    {!isCollapsed && <span className="tracking-tight font-bold">Ad Management</span>}
                                </Link>
                            </>
                        )}
                        <Link
                            href="/dashboard"
                            title={t("sidebar.office")}
                            className={cn(linkBaseClass, pathname === "/dashboard" && activeLinkClass, "rounded-lg border-l-0 mx-2")}
                        >
                            <LayoutDashboard size={18} className={cn("transition-transform group-hover:scale-110 min-w-[18px]", pathname === "/dashboard" ? "text-primary" : "text-slate-400")} />
                            {!isCollapsed && <span className="tracking-tight">{t("sidebar.office")}</span>}
                        </Link>
                    </div>

                    {/* Earn Section */}
                    <div>
                        {!isCollapsed && <div className="mb-2 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t("sidebar.earn_money")}</div>}
                        <nav className="space-y-1">
                            {earnItems.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        title={item.name}
                                        className={cn(linkBaseClass, isActive && activeLinkClass, "rounded-lg border-l-0 mx-2")}
                                    >
                                        <item.icon size={18} className={cn("transition-transform group-hover:scale-110 min-w-[18px]", isActive ? "text-primary" : "text-slate-400")} />
                                        {!isCollapsed && <span className="tracking-tight">{item.name}</span>}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Promo Section */}
                    <div>
                        {!isCollapsed && <div className="mb-2 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{language === "ar" ? "العروض والمكافآت" : "PROMOTIONS"}</div>}
                        <nav className="space-y-1">
                            {promoItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        title={item.name}
                                        className={cn(linkBaseClass, isActive && activeLinkClass, "rounded-lg border-l-0 mx-2")}
                                    >
                                        <item.icon size={18} className={cn("transition-transform group-hover:scale-110 min-w-[18px]", isActive ? "text-primary" : "text-slate-400")} />
                                        {!isCollapsed && <span className="tracking-tight">{item.name}</span>}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Finance Section */}
                    <div>
                        {!isCollapsed && <div className="mb-2 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t("sidebar.finance")}</div>}
                        <nav className="space-y-1">
                            {financeItems.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        title={item.name}
                                        className={cn(linkBaseClass, isActive && activeLinkClass, "rounded-lg border-l-0 mx-2")}
                                    >
                                        <item.icon size={18} className={cn("transition-transform group-hover:scale-110 min-w-[18px]", isActive ? "text-primary" : "text-slate-400")} />
                                        {!isCollapsed && <span className="tracking-tight">{item.name}</span>}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Advertiser Section */}
                    <div>
                        {!isCollapsed && <div className="mb-2 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t("sidebar.advertiser")}</div>}
                        <nav className="space-y-1">
                            <Link href="/dashboard/advertise" title={t("sidebar.my_campaigns")} className={cn(linkBaseClass, pathname === "/dashboard/advertise" && activeLinkClass, "rounded-lg border-l-0 mx-2")}>
                                <LayoutDashboard size={18} className={cn("transition-transform group-hover:scale-110 min-w-[18px]", pathname === "/dashboard/advertise" ? "text-primary" : "text-slate-400")} />
                                {!isCollapsed && <span className="tracking-tight">{t("sidebar.my_campaigns")}</span>}
                            </Link>
                            <Link href="/dashboard/advertise/surfing/new" title={t("sidebar.place_ads_surfing")} className={cn(linkBaseClass, pathname === "/dashboard/advertise/surfing/new" && activeLinkClass, "rounded-lg border-l-0 mx-2")}>
                                <MousePointerClick size={18} className={cn("transition-transform group-hover:scale-110 min-w-[18px]", pathname === "/dashboard/advertise/surfing/new" ? "text-primary" : "text-slate-400")} />
                                {!isCollapsed && <span className="tracking-tight">{t("sidebar.place_ads_surfing")}</span>}
                            </Link>
                            <Link href="/dashboard/advertise/youtube/new" title={t("sidebar.place_ads_youtube")} className={cn(linkBaseClass, pathname === "/dashboard/advertise/youtube/new" && activeLinkClass, "rounded-lg border-l-0 mx-2")}>
                                <Youtube size={18} className={cn("transition-transform group-hover:scale-110 min-w-[18px]", pathname === "/dashboard/advertise/youtube/new" ? "text-primary" : "text-slate-400")} />
                                {!isCollapsed && <span className="tracking-tight">{t("sidebar.place_ads_youtube")}</span>}
                            </Link>
                            <Link href="/dashboard/advertise/tasks/new" title={t("sidebar.place_ads_tasks")} className={cn(linkBaseClass, pathname === "/dashboard/advertise/tasks/new" && activeLinkClass, "rounded-lg border-l-0 mx-2")}>
                                <Briefcase size={18} className={cn("transition-transform group-hover:scale-110 min-w-[18px]", pathname === "/dashboard/advertise/tasks/new" ? "text-primary" : "text-slate-400")} />
                                {!isCollapsed && <span className="tracking-tight">{t("sidebar.place_ads_tasks")}</span>}
                            </Link>
                        </nav>
                    </div>

                    {/* Settings & Profile */}
                    <div>
                        {!isCollapsed && <div className="mb-2 px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t("sidebar.profile")}</div>}
                        <nav className="space-y-1">
                            <Link href="/dashboard/invite" title={t("referrals.title")} className={cn(linkBaseClass, pathname === "/dashboard/invite" && activeLinkClass, "rounded-lg border-l-0 mx-2")}>
                                <Users size={18} className={cn("transition-transform group-hover:scale-110 min-w-[18px]", pathname === "/dashboard/invite" ? "text-primary" : "text-slate-400")} />
                                {!isCollapsed && <span className="tracking-tight">{t("referrals.title")}</span>}
                            </Link>
                            <Link href="/dashboard/settings" title={t("sidebar.settings")} className={cn(linkBaseClass, pathname === "/dashboard/settings" && activeLinkClass, "rounded-lg border-l-0 mx-2")}>
                                <Settings size={18} className={cn("transition-transform group-hover:scale-110 min-w-[18px]", pathname === "/dashboard/settings" ? "text-primary" : "text-slate-400")} />
                                {!isCollapsed && <span className="tracking-tight">{t("sidebar.settings")}</span>}
                            </Link>
                            <Link href="/dashboard/support" title={t("sidebar.support")} className={cn(linkBaseClass, pathname === "/dashboard/support" && activeLinkClass, "rounded-lg border-l-0 mx-2")}>
                                <MessageSquare size={18} className={cn("transition-transform group-hover:scale-110 min-w-[18px]", pathname === "/dashboard/support" ? "text-primary" : "text-slate-400")} />
                                {!isCollapsed && <span className="tracking-tight">{t("sidebar.support")}</span>}
                            </Link>
                        </nav>
                    </div>
                </div>

                {/* Footer Area */}
                <div className={cn("p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800", isCollapsed && "p-2")}>
                    {!isCollapsed && (
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{t("dashboard.balance")}</div>
                                <div className="text-sm font-bold text-emerald-600 flex items-center gap-1">
                                    <DollarSign size={10} strokeWidth={3} />
                                    {balance.toFixed(3)}
                                </div>
                            </div>
                            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-sm">
                                <div className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{t("dashboard.ad_balance")}</div>
                                <div className="text-sm font-bold text-blue-600 flex items-center gap-1">
                                    <DollarSign size={10} strokeWidth={3} />
                                    {adBalance.toFixed(3)}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={cn("flex items-center justify-between px-1", isCollapsed && "flex-col gap-4")}>
                        <div className={cn("flex items-center gap-1", isCollapsed && "flex-col")}>
                            <button
                                onClick={toggleLanguage}
                                className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
                                title={t("sidebar.change_language")}
                            >
                                <Globe size={18} />
                                {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-widest">{language}</span>}
                            </button>
                            <ThemeToggle />
                        </div>

                        <button
                            className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                            onClick={async () => await logout()}
                            title={t("auth.signout")}
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
