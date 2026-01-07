"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, DollarSign, Settings, LogOut, MessageSquare, ShieldAlert, CreditCard, Megaphone } from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/actions/logout";

const navItems = [
    { name: "لوحة التحكم", href: "/admin", icon: LayoutDashboard },
    { name: "الطلبات المالية", href: "/admin/financials", icon: DollarSign },
    { name: "وسائل الدفع", href: "/admin/financials/methods", icon: CreditCard },
    { name: "المستخدمين", href: "/admin/users", icon: Users },
    { name: "طلبات الترويج", href: "/admin/promotions", icon: Megaphone },
    { name: "الإشراف والحظر", href: "/admin/moderation", icon: ShieldAlert },
    { name: "تذاكر الدعم", href: "/admin/tickets", icon: MessageSquare },
    { name: "إدارة الإعلانات", href: "/admin/advertisements", icon: Megaphone },
    { name: "مراقبة الأرباح", href: "/admin/accounting", icon: LayoutDashboard },
    { name: "الإعدادات", href: "/admin/settings", icon: Settings },
    { name: "إعدادات الإعلانات", href: "/admin/settings/ads", icon: DollarSign },
];

export function AdminSidebar() {
    const pathname = usePathname();

    return (
        <div className="h-screen w-64 glass border-r border-white/10 flex flex-col text-white">
            <div className="p-6 border-b border-white/10">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-500">
                    لوحة المدير
                </h1>
                <p className="text-xs text-gray-400 mt-1">التحكم الكامل</p>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
                                isActive
                                    ? "bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={async () => await logout()}
                    className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-gray-400 hover:bg-red-900/20 hover:text-red-400 transition-colors"
                >
                    <LogOut size={20} />
                    <span>تسجيل خروج</span>
                </button>
            </div>
        </div>
    );
}
