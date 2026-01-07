"use client";

import { useState } from "react";
import Link from "next/link";
import { PurchaseBannerModal } from "./PurchaseBannerModal";
import { registerBannerClick } from "@/actions/banners";
import { ExternalLink } from "lucide-react";

export function SidebarAds({ ads, displayPrice }: { ads: any[], displayPrice?: number }) {
    const [showModal, setShowModal] = useState(false);
    const price = displayPrice || 0.07; // Default to $0.07

    // Ensure we always display 5 slots
    const slots = [...(ads || [])];
    while (slots.length < 5) {
        slots.push(null); // Fill with nulls for placeholders
    }
    const displaySlots = slots.slice(0, 5);

    return (
        <div className="space-y-3">
            {displaySlots.map((ad, index) => (
                <div key={ad ? ad.id : `empty-${index}`} className="block">
                    {ad ? (
                        <a
                            href={`/api/click/${ad.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors group relative overflow-hidden"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                                    {ad.text}
                                </span>
                                <ExternalLink size={14} className="text-slate-400 group-hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </a>
                    ) : (
                        <button
                            onClick={() => setShowModal(true)}
                            className="w-full p-2 rounded-lg border border-dashed border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-900/10 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20 hover:border-emerald-400 transition-all group text-center"
                        >
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">Place Link Here</span>
                                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.5 rounded-full">
                                    day / ${price.toFixed(2)}
                                </span>
                            </div>
                        </button>
                    )}
                </div>
            ))}

            <PurchaseBannerModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                type="LINK_AD"
                price={price}
            />
        </div>
    );
}
