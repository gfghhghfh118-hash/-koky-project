"use client";

import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function PromoAssetsPage() {
    const { t } = useLanguage();
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    const assets = [
        {
            id: "banner-sq-1",
            title: "Instagram/Square Post",
            type: "IMAGE",
            url: "/promo/square-1.png", // Placeholder
            color: "bg-gradient-to-br from-purple-600 to-blue-600",
            text: "Earn money online simply by watching videos! 💸 #SideHustle",
        },
        {
            id: "banner-wide-1",
            title: "Facebook/Twitter Cover",
            type: "IMAGE",
            url: "/promo/wide-1.png", // Placeholder
            color: "bg-gradient-to-r from-emerald-500 to-teal-500",
            text: "Join thousands earning daily with Koky. Sign up now! 🚀",
        },
        {
            id: "yt-comment-1",
            title: "YouTube Comment (Casual)",
            type: "TEXT",
            url: "/promo/yt-icon.png", // Visual placeholder
            color: "bg-red-600",
            text: "Honestly, this is the only site that actually paid me for watching ads. Check my profile for the link! 👇",
        },
        {
            id: "yt-comment-2",
            title: "YouTube Comment (Earnings)",
            type: "TEXT",
            url: "/promo/yt-icon.png",
            color: "bg-red-600",
            text: "I made $5 yesterday just clicking ads on Koky. It's legit. Link is in my bio! 💰",
        },
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Marketing Assets & Scripts</h1>
                <p className="text-slate-500">Download banners and copy smart scripts to promote your referral link safely.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assets.map((asset) => (
                    <div key={asset.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group/card">
                        {/* Preview Area */}
                        <div className={`h-40 w-full ${asset.color} flex items-center justify-center p-6 text-center text-white font-bold text-lg relative group`}>
                            {asset.type === "IMAGE" ? (
                                <>
                                    <span className="opacity-90 drop-shadow-md">{asset.text}</span>
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button variant="secondary" size="sm" className="gap-2">
                                            <Download size={14} /> Download Image
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-4xl">💬</span>
                                    <span className="text-sm font-medium opacity-90 uppercase tracking-widest">Copy Script</span>
                                </div>
                            )}
                        </div>

                        <div className="p-4 space-y-4">
                            <div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                    {asset.title}
                                    {asset.type === "TEXT" && <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-black uppercase">Text</span>}
                                </h3>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">
                                    {asset.type === "IMAGE" ? "Caption Copy" : "Comment Text"}
                                </label>
                                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 relative group/copy">
                                    <p className="pr-8 line-clamp-3 font-medium">{asset.text}</p>
                                    <button
                                        onClick={() => handleCopy(asset.text, asset.id)}
                                        className="absolute right-2 top-2 text-slate-400 hover:text-emerald-500 transition-colors bg-white dark:bg-slate-900 p-1.5 rounded-full shadow-sm border border-slate-100 dark:border-slate-800 opacity-0 group-hover/copy:opacity-100"
                                    >
                                        {copied === asset.id ? <Check size={14} /> : <Copy size={14} />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
