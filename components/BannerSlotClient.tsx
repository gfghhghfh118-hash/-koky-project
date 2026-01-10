
"use client";

import { useState } from "react";
import Image from "next/image";
import { PurchaseBannerModal } from "./PurchaseBannerModal";
import { registerBannerClick } from "@/actions/banners";

export function BannerSlotClient({ type, initialBanner, displayPrice, settings }: { type: string, initialBanner: any, displayPrice?: number, settings?: any }) {
    const [showModal, setShowModal] = useState(false);

    // Determine price based on type if not provided
    const finalPrice = displayPrice || 0.15;

    const handleBannerClick = async () => {
        if (initialBanner?.id) {
            await registerBannerClick(initialBanner.id);
        }
    };

    const [imageError, setImageError] = useState(false);

    if (initialBanner) {
        // Extract domain for fallback view
        const getDomain = (url: string) => {
            try {
                return new URL(url).hostname.replace('www.', '');
            } catch {
                return 'Website';
            }
        };

        // Check for special "card://" Text Ad logic
        let isCardFormat = false;
        let cardTitle = "";
        let cardDesc = "";

        if (initialBanner?.imageUrl?.startsWith("card://")) {
            isCardFormat = true;
            try {
                const params = new URLSearchParams(initialBanner.imageUrl.replace("card://?", ""));
                cardTitle = params.get("title") || "Advertisement";
                cardDesc = params.get("desc") || initialBanner.targetUrl;
            } catch (e) {
                cardTitle = "Sponsored Link";
                cardDesc = initialBanner.targetUrl;
            }
        }

        // Reuse the Card UI logic
        if (imageError || isCardFormat) {
            // FALLBACK / TEXT CARD UI
            return (
                <div className="w-full flex justify-center py-4">
                    <a
                        href={initialBanner.targetUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={handleBannerClick}
                        className="w-full max-w-[728px] h-[90px] bg-slate-900 border border-slate-700/50 hover:border-emerald-500/50 rounded-xl flex items-center justify-between px-6 gap-4 group transition-all relative overflow-hidden"
                    >
                        {/* Background Accent */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center gap-4 relative z-10">
                            <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                                <span className="text-2xl">
                                    {isCardFormat ? "📢" : "🌐"}
                                </span>
                            </div>
                            <div className="flex flex-col text-left">
                                <span className="text-white font-bold text-lg leading-tight group-hover:text-emerald-400 transition-colors">
                                    {isCardFormat ? cardTitle : getDomain(initialBanner.targetUrl)}
                                </span>
                                <span className="text-slate-400 text-xs text-left truncate max-w-[200px] md:max-w-[300px]">
                                    {isCardFormat ? cardDesc : initialBanner.targetUrl}
                                </span>
                            </div>
                        </div>

                        <div className="hidden sm:flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-lg text-emerald-400 text-xs font-bold uppercase tracking-wider group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            Visit Site ➜
                        </div>
                    </a>
                </div>
            );
        }

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
                        className="max-w-full h-auto object-contain max-h-[120px]"
                        style={{ minWidth: type === "SIDEBAR" ? "100%" : "auto" }}
                        onError={() => setImageError(true)}
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
                        + Advertise Here ({finalPrice ? `$${finalPrice}/day` : "Rent Now"})
                    </span>
                    <span className="text-slate-600 text-xs">Click to rent this banner space instantly</span>
                </button>
            </div>

            {showModal && <PurchaseBannerModal type={type} price={finalPrice} onClose={() => setShowModal(false)} settings={settings} />}
        </>
    );
}
