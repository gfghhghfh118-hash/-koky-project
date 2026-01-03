"use client";

import Link from "next/link";

export function LandingFooter() {
    return (
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
    );
}
