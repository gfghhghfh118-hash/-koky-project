"use client";

import { useState } from "react";
import { purchaseAd } from "@/actions/ads";
import Image from "next/image";
import { Plus } from "lucide-react";

interface AdPlacement {
    id: string;
    slotIndex: number;
    imageUrl?: string;
    linkUrl: string;
}

interface DashboardAdGridProps {
    ads: AdPlacement[];
    bannerPrice: number;
}

export function DashboardAdGrid({ ads, bannerPrice }: DashboardAdGridProps) {
    const [loadingSlot, setLoadingSlot] = useState<number | null>(null);

    const handlePurchase = async (slotIndex: number) => {
        const imageUrl = prompt("Enter Banner Image URL (Approx 250x250):");
        if (!imageUrl) return;
        const linkUrl = prompt("Enter Target Website URL:");
        if (!linkUrl) return;

        if (!confirm(`Confirm purchase for $${bannerPrice}?`)) return;

        setLoadingSlot(slotIndex);
        const res = await purchaseAd("BANNER_TOP", slotIndex, linkUrl, imageUrl);
        setLoadingSlot(null);

        if (res.error) alert(res.error);
        else {
            alert(res.success);
            window.location.reload();
        }
    };

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {Array.from({ length: 8 }).map((_, index) => {
                const ad = ads.find(a => a.slotIndex === index);
                return (
                    <div
                        key={index}
                        className={`aspect-square rounded-xl overflow-hidden shadow-sm border-2 ${ad ? 'border-transparent' : 'border-dashed border-red-300 bg-red-50 hover:bg-red-100 cursor-pointer'} transition-all relative group`}
                        onClick={() => !ad && handlePurchase(index)}
                    >
                        {ad ? (
                            <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block w-full h-full relative">
                                {ad.imageUrl ? (
                                    <Image
                                        src={ad.imageUrl}
                                        alt="Ad"
                                        fill
                                        className="object-cover"
                                        unoptimized // Allow external URLs
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs">No Image</div>
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </a>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-red-400">
                                {loadingSlot === index ? (
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                                ) : (
                                    <>
                                        <Plus className="mb-2" size={32} />
                                        <span className="font-bold text-sm">Valid 24 Hours</span>
                                        <span className="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full mt-1">${bannerPrice.toFixed(2)}</span>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
