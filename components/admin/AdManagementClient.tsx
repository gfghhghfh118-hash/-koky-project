"use client";

import { useState } from "react";
import { toggleBannerStatus, banAdPlacement, updateAdText, updateAdPrice } from "@/actions/admin-ads";
import { Edit, Ban, DollarSign, Power, ExternalLink, RefreshCw, Type } from "lucide-react";

interface AdminAdsClientProps {
    banners: any[];
    textAds: any[];
}

export function AdminAdsClient({ banners, textAds }: AdminAdsClientProps) {
    // --- STATE FOR MODALS ---
    const [editingTextId, setEditingTextId] = useState<string | null>(null);
    const [editTextValue, setEditTextValue] = useState("");

    const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
    const [editingPriceType, setEditingPriceType] = useState<"BANNER" | "TEXT" | null>(null);
    const [editPriceValue, setEditPriceValue] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    // --- HANDLERS ---

    const handleToggleBanner = async (id: string, currentStatus: boolean) => {
        if (!confirm("Are you sure you want to toggle this banner's status?")) return;
        setIsLoading(true);
        await toggleBannerStatus(id, !currentStatus);
        setIsLoading(false);
    };

    const handleBanTextAd = async (id: string) => {
        if (!confirm("Are you sure you want to BAN this ad? User will not be refunded automatically.")) return;
        setIsLoading(true);
        await banAdPlacement(id);
        setIsLoading(false);
    };

    const handleSaveText = async () => {
        if (!editingTextId) return;
        setIsLoading(true);
        await updateAdText(editingTextId, editTextValue);
        setEditingTextId(null);
        setIsLoading(false);
    };

    const handleSavePrice = async () => {
        if (!editingPriceId || !editingPriceType) return;
        setIsLoading(true);
        await updateAdPrice(editingPriceId, editingPriceType, parseFloat(editPriceValue));
        setEditingPriceId(null);
        setIsLoading(false);
    };

    return (
        <div className="space-y-10">
            {/* --- TEXT ADS SECTION --- */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                    <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                        <Type size={20} className="text-emerald-500" />
                        Text Link Ads
                    </h2>
                    <span className="text-xs font-bold bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">{textAds.length} Total</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-xs uppercase font-black text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Published At</th>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Content (Text/Link)</th>
                                <th className="px-6 py-3">Cost</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {textAds.map((ad) => (
                                <tr key={ad.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                        {new Date(ad.startsAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-700 dark:text-slate-300">{ad.user.username}</div>
                                        <div className="text-[10px] text-slate-400 font-mono">{ad.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs">
                                        <div className="font-medium text-slate-800 dark:text-slate-200 truncate" title={ad.text || ""}>{ad.text || "N/A"}</div>
                                        <a href={ad.linkUrl} target="_blank" className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1 truncate">
                                            {ad.linkUrl} <ExternalLink size={10} />
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-bold text-emerald-600">
                                        ${ad.pricePaid.toFixed(3)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${ad.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' :
                                            ad.status === 'BANNED' ? 'bg-red-100 text-red-700' :
                                                'bg-slate-100 text-slate-500'
                                            }`}>
                                            {ad.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => { setEditingTextId(ad.id); setEditTextValue(ad.text || ""); }}
                                                className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100"
                                                title="Edit Text"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={() => { setEditingPriceId(ad.id); setEditingPriceType("TEXT"); setEditPriceValue(ad.pricePaid.toString()); }}
                                                className="p-1.5 rounded bg-amber-50 text-amber-600 hover:bg-amber-100"
                                                title="Change Price"
                                            >
                                                <DollarSign size={14} />
                                            </button>
                                            {ad.status !== "BANNED" && (
                                                <button
                                                    onClick={() => handleBanTextAd(ad.id)}
                                                    className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100"
                                                    title="Ban Ad"
                                                >
                                                    <Ban size={14} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- BANNERS SECTION --- */}
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
                    <h2 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                        <ExternalLink size={20} className="text-blue-500" />
                        Banner Ads
                    </h2>
                    <span className="text-xs font-bold bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded-full">{banners.length} Total</span>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-100 dark:bg-slate-800 text-xs uppercase font-black text-slate-500">
                            <tr>
                                <th className="px-6 py-3">Published At</th>
                                <th className="px-6 py-3">User</th>
                                <th className="px-6 py-3">Image / Details</th>
                                <th className="px-6 py-3">Performance (Days/Clicks)</th>
                                <th className="px-6 py-3">Cost</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {banners.map((banner) => (
                                <tr key={banner.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                        {new Date(banner.createdAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-700 dark:text-slate-300">{banner.user.username}</div>
                                        <div className="text-[10px] text-slate-400 font-mono">{banner.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="w-16 h-8 bg-slate-200 rounded overflow-hidden mb-1 border">
                                            <img src={banner.imageUrl} alt="Banner" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="text-[10px] text-slate-500">{banner.size}</div>
                                        <a href={banner.targetUrl} target="_blank" className="text-[10px] text-blue-500 hover:underline flex items-center gap-1">
                                            Link <ExternalLink size={8} />
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-xs">
                                        <div>{banner.days > 0 ? `${banner.days} Days` : "Unlimited"}</div>
                                        <div className="text-slate-400">{banner.views} Views / {banner.clicks} Clicks</div>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-bold text-emerald-600">
                                        ${banner.cost.toFixed(3)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider ${banner.active ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {banner.active ? "ACTIVE" : "DISABLED"}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => { setEditingPriceId(banner.id); setEditingPriceType("BANNER"); setEditPriceValue(banner.cost.toString()); }}
                                                className="p-1.5 rounded bg-amber-50 text-amber-600 hover:bg-amber-100"
                                                title="Change Price"
                                            >
                                                <DollarSign size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleToggleBanner(banner.id, banner.active)}
                                                className={`p-1.5 rounded ${banner.active ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                                title={banner.active ? "Disable Banner" : "Enable Banner"}
                                            >
                                                <Power size={14} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODALS --- */}

            {/* Edit Text Modal */}
            {editingTextId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in fade-in zoom-in-95">
                        <h3 className="text-lg font-black mb-4">Edit Ad Text</h3>
                        <textarea
                            value={editTextValue}
                            onChange={(e) => setEditTextValue(e.target.value)}
                            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-2 focus:ring-blue-500 mb-4 h-24"
                        />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingTextId(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                            <button onClick={handleSaveText} disabled={isLoading} className="px-4 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                                {isLoading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Price Modal */}
            {editingPriceId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-sm p-6 shadow-2xl">
                        <h3 className="text-lg font-black mb-4">Change {editingPriceType === "BANNER" ? "Banner" : "Ad"} Price</h3>
                        <div className="relative mb-4">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                            <input
                                type="number"
                                step="0.001"
                                value={editPriceValue}
                                onChange={(e) => setEditPriceValue(e.target.value)}
                                className="w-full pl-8 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 font-mono font-bold"
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingPriceId(null)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg">Cancel</button>
                            <button onClick={handleSavePrice} disabled={isLoading} className="px-4 py-2 text-sm font-bold bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50">
                                {isLoading ? "Updating..." : "Update Price"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
