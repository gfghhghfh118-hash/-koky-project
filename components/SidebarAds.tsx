"use client";

import Link from "next/link";
import { registerBannerClick } from "@/actions/banners";

export function SidebarAds({ ads }: { ads: any[] }) {
    if (!ads || ads.length === 0) {
        return (
            <div className="space-y-3">
                <Link href="/dashboard/advertise/banners/new" className="block p-4 border border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group text-center">
                    <div className="text-sm font-bold text-slate-500 group-hover:text-green-600 mb-1">Place Link Here</div>
                    <div className="text-xs text-green-600 font-bold">$0.07 / day</div>
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {ads.map((ad, idx) => (
                <a
                    key={idx}
                    href={ad.targetUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => registerBannerClick(ad.id)}
                    className="block p-2 bg-gradient-to-r from-white to-slate-50 border-l-4 border-green-500 rounded-r-lg shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 group"
                >
                    <div className="flex flex-col">
                        <div className="text-xs font-bold text-blue-700 group-hover:text-amber-600 transition-colors line-clamp-1">
                            {ad.title || "Promoted Link"}
                        </div>
                        <div className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                            {ad.description || "Click to see this amazing offer!"}
                        </div>
                        {/* Optional domain display */}
                        <div className="text-[9px] text-slate-300 mt-1 truncate">
                            {new URL(ad.targetUrl).hostname.replace('www.', '')}
                        </div>
                    </div>
                </a>
            ))}

            <Link href="/dashboard/advertise/banners/new" className="block p-2 border border-dashed border-green-300/50 rounded-lg bg-green-50/50 hover:bg-green-50 transition-colors group text-center mt-4">
                <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest">+ Add Link ($0.07)</div>
            </Link>
        </div>
    );
}
