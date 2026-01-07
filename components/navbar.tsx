"use client";

import { Bell } from "lucide-react";

export default function Navbar() {
    return (
        <div className="flex items-center p-4 bg-[#0f0f13] border-b border-white/5 w-full justify-end gap-x-4">
            <div className="flex items-center gap-x-2 bg-[#1e1e28] px-4 py-2 rounded-full border border-white/5">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-medium text-white">
                    Balance: <span className="text-emerald-400">0.00 EGP</span>
                </span>
            </div>

            <button className="relative p-2 rounded-full hover:bg-white/10 transition">
                <Bell className="h-5 w-5 text-zinc-400" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 border border-[#0f0f13]" />
            </button>

            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 border border-white/10" />
        </div>
    );
}
