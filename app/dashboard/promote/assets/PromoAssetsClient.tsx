"use client";

import { Button } from "@/components/ui/button";
import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";

type Asset = {
    id: string;
    title: string;
    type: "IMAGE" | "TEXT";
    url: string;
    color: string;
    text: string;
};

export function PromoAssetsClient({ assets }: { assets: Asset[] }) {
    const { t } = useLanguage();
    const [copied, setCopied] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assets.map((asset) => (
                <div key={asset.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group/card">
                    {/* Preview Area */}
                    <div className={`h-40 w-full ${asset.color} flex items-center justify-center p-6 text-center text-white font-bold text-lg relative group`}>
                        {asset.type === "IMAGE" ? (
                            <>
                                <span className="opacity-90 drop-shadow-md line-clamp-3 text-sm">{asset.text}</span>
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
                            <h3 className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 text-sm">
                                {asset.title}
                                {asset.type === "TEXT" && <span className="px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-500 font-black uppercase">Text</span>}
                            </h3>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">
                                {asset.type === "IMAGE" ? "Caption Copy" : "Comment Text"}
                            </label>
                            <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 text-sm text-slate-600 dark:text-slate-400 relative group/copy">
                                <p className="pr-8 whitespace-pre-wrap font-mono text-xs leading-relaxed">{asset.text}</p>
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
    );
}
