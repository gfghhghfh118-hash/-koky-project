
"use client";

import { useState } from "react";
import { purchaseBanner } from "@/actions/banners";
import { useLanguage } from "@/components/providers/LanguageProvider"; // Assume we'll add keys later

export function PurchaseBannerModal({ type, onClose }: { type: string, onClose: () => void }) {
    const [mode, setMode] = useState<"DAYS" | "VIEWS">("DAYS");
    const [msg, setMsg] = useState("");

    // Pricing (Client side display, MUST match server)
    const pricePerDay = type === "SIDEBAR" ? 0.15 : 0.25;
    const pricePer1k = 0.20;
    const pricePerClick = 0.005;

    const [days, setDays] = useState(1);
    const [views, setViews] = useState(1000);

    const cost = mode === "DAYS"
        ? days * pricePerDay
        : (views / 1000) * pricePer1k;

    async function handleBuy(form: FormData) {
        const res = await purchaseBanner(form);
        if (res.error) setMsg(res.error);
        if (res.success) {
            alert("Success!");
            onClose();
            window.location.reload();
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

                <h2 className="text-xl font-bold text-white mb-4">📢 Rent Ad Space ({type})</h2>

                {msg && <p className="bg-red-500/20 text-red-500 p-2 rounded mb-4 text-sm">{msg}</p>}

                <form action={handleBuy} className="space-y-4">
                    <input type="hidden" name="type" value={type} />

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold">Banner Image URL (468x60 recommended)</label>
                        <input name="imageUrl" required type="url" placeholder="https://..." className="w-full bg-black/30 border border-slate-700 rounded p-2 text-white" />
                    </div>

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold">Target Link</label>
                        <input name="targetUrl" required type="url" placeholder="https://..." className="w-full bg-black/30 border border-slate-700 rounded p-2 text-white" />
                    </div>

                    <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
                        <button type="button" onClick={() => setMode("DAYS")} className={`flex-1 py-1 rounded-md text-sm font-bold ${mode === "DAYS" ? "bg-emerald-500 text-white" : "text-slate-400"}`}>Pay Per Day</button>
                        <button type="button" onClick={() => setMode("VIEWS")} className={`flex-1 py-1 rounded-md text-sm font-bold ${mode === "VIEWS" ? "bg-emerald-500 text-white" : "text-slate-400"}`}>Pay Per View</button>
                    </div>

                    {mode === "DAYS" ? (
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold">Duration (Days) - ${pricePerDay}/day</label>
                            <input name="days" type="number" min="1" value={days} onChange={e => setDays(parseInt(e.target.value))} className="w-full bg-black/30 border border-slate-700 rounded p-2 text-white" />
                        </div>
                    ) : (
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold">Views - ${pricePer1k}/1k views</label>
                            <input name="views" type="number" step="1000" min="1000" value={views} onChange={e => setViews(parseInt(e.target.value))} className="w-full bg-black/30 border border-slate-700 rounded p-2 text-white" />
                        </div>
                    )}

                    <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl flex justify-between items-center">
                        <span className="text-emerald-400 font-bold text-sm">Total Cost:</span>
                        <span className="text-2xl font-black text-white">${cost.toFixed(2)}</span>
                    </div>

                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 rounded-xl">
                        Purchase & Publish
                    </button>

                </form>
            </div>
        </div>
    )
}
