
"use client";

import { useState } from "react";
import Image from "next/image";
import { PurchaseBannerModal } from "./PurchaseBannerModal";
import { registerBannerClick } from "@/actions/banners";

export function BannerSlotClient({ type, initialBanner }: { type: string, initialBanner: any }) {
    const [showModal, setShowModal] = useState(false);

    const handleBannerClick = async () => {
        if (initialBanner?.id) {
            await registerBannerClick(initialBanner.id);
        }
    };

    if (initialBanner) {
        return (
            <div className="w-full flex justify-center py-4">
                <a
                    href={initialBanner.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={handleBannerClick}
                    className="relative group block overflow-hidden rounded-lg shadow-lg border border-white/10 hover:border-emerald-500/50 transition-all"
                >
                    {/* Using simple img tag to avoid Next.js Image strict domain config issues for external user ads */}
                    <img
                        src={initialBanner.imageUrl}
                        alt="Ad"
                        className="max-w-full h-auto object-cover max-h-[120px]"
                        style={{ minWidth: type === "SIDEBAR" ? "100%" : "300px" }}
                        onError={(e) => {
                            e.currentTarget.style.display = 'none'; // Hide if broken
                            // optionally show a fallback or the 'Advertise Here' button instead?
                        }}
                    />
                    <div className="absolute top-0 right-0 bg-white/10 text-[9px] px-1 text-white/50">Ad</div>
                </a>
            </div>
        );
    }

    return (
        <>
            <div className="w-full flex justify-center py-4">
                <button
                    onClick={() => setShowModal(true)}
                    className="w-full max-w-[728px] h-[90px] border-2 border-dashed border-slate-700 hover:border-emerald-500 bg-slate-900/50 hover:bg-slate-900 rounded-xl flex flex-col items-center justify-center gap-1 group transition-all"
                >
                    <span className="text-slate-500 group-hover:text-emerald-400 font-bold text-lg uppercase tracking-widest transition-colors">
                        + Advertise Here ({type === "SIDEBAR" ? "$0.15/day" : "$0.25/day"})
                    </span>
                    <span className="text-slate-600 text-xs">Click to rent this banner space instantly</span>
                </button>
            </div>

            {showModal && <PurchaseBannerModal type={type} onClose={() => setShowModal(false)} />}
        </>
    );
}
