"use client";

import { useState } from "react";
import { purchaseAd } from "@/actions/ads";
import { PlusCircle, ExternalLink } from "lucide-react";

interface AdPlacement {
    id: string;
    slotIndex: number;
    text?: string;
    linkUrl: string;
}

interface SidebarAdWidgetProps {
    ads: AdPlacement[];
    textPrice: number;
}

export function SidebarAdWidget({ ads, textPrice }: SidebarAdWidgetProps) {
    const [loadingSlot, setLoadingSlot] = useState<number | null>(null);

    const handlePurchase = async (slotIndex: number) => {
        const text = prompt("Enter Ad Text (Max 30 chars):");
        if (!text) return;
        if (text.length > 30) {
            alert("Text too long! Max 30 characters.");
            return;
        }
        const linkUrl = prompt("Enter Target Website URL:");
        if (!linkUrl) return;

        if (!confirm(`Confirm purchase for $${textPrice}?`)) return;

        setLoadingSlot(slotIndex);
        const res = await purchaseAd("TEXT_SIDEBAR", slotIndex, linkUrl, text);
        setLoadingSlot(null);

        if (res.error) alert(res.error);
        else {
            alert(res.success);
            window.location.reload();
        }
    };

    return (
        <div className="mb-6 border-2 border-emerald-500/20 rounded-xl bg-emerald-50/30 overflow-hidden">
            <div className="bg-emerald-100/50 px-4 py-2 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex justify-between items-center">
                <span>Featured Links</span>
                <span className="bg-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded text-[9px]">${textPrice}</span>
            </div>
            <div className="divide-y divide-emerald-100">
                {Array.from({ length: 5 }).map((_, index) => {
                    const ad = ads.find(a => a.slotIndex === index);
                    return (
                        <div key={index} className="flex items-center px-4 py-3 hover:bg-emerald-50 transition-colors h-[45px]">
                            {ad ? (
                                <a
                                    href={ad.linkUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center w-full group"
                                >
                                    <span className="text-xs font-medium text-slate-700 truncate flex-1 group-hover:text-emerald-700 transition-colors">
                                        {ad.text}
                                    </span>
                                    <ExternalLink size={12} className="text-slate-400 ml-2 group-hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all" />
                                </a>
                            ) : (
                                <button
                                    onClick={() => handlePurchase(index)}
                                    className="flex items-center w-full text-left group"
                                    disabled={loadingSlot === index}
                                >
                                    {loadingSlot === index ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500 mr-2"></div>
                                    ) : (
                                        <PlusCircle size={14} className="text-emerald-400 mr-2 group-hover:text-emerald-600 transition-colors" />
                                    )}
                                    <span className="text-[11px] text-slate-400 group-hover:text-emerald-600 font-medium transition-colors truncate">
                                        Place your ad here
                                    </span>
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
