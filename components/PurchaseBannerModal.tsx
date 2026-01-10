
"use client";

import { useState } from "react";
import { purchaseBanner } from "@/actions/banners";

export function PurchaseBannerModal({ type, onClose, isOpen, price, settings }: { type: string, onClose: () => void, isOpen?: boolean, price?: number, settings?: any }) {
    const [mode, setMode] = useState<"DAYS" | "VIEWS" | "CLICKS">("DAYS");
    const [msg, setMsg] = useState("");

    // Use passed settings or defaults
    const prices = {
        daySidebar: settings?.pricePerDaySidebar ?? 0.15,
        dayHeader: settings?.pricePerDayHeader ?? 0.15,
        dayLinkAd: 0.07,
        per1kViews: settings?.pricePer1kViews ?? 0.20,
        perClick: settings?.pricePerClick ?? 0.005
    };

    const [days, setDays] = useState(1);
    const [views, setViews] = useState(1000);
    const [clicks, setClicks] = useState(100);

    // Use passed price if available, otherwise fallback to settings
    const dailyPrice = price !== undefined
        ? price
        : (type === "SIDEBAR" ? prices.daySidebar : type === "LINK_AD" ? prices.dayLinkAd : prices.dayHeader);

    const cost = mode === "DAYS"
        ? days * dailyPrice
        : mode === "VIEWS"
            ? (views / 1000) * prices.per1kViews
            : clicks * prices.perClick;

    // Handle visibility
    if (typeof isOpen !== "undefined" && !isOpen) return null;

    const [format, setFormat] = useState<"IMAGE" | "TEXT">("IMAGE"); // New state for ad format

    async function handleBuy(form: FormData) {
        // If Text Format is selected for a BANNER ad (NOT LINK_AD), construct a special URL
        if (type !== "LINK_AD" && format === "TEXT") {
            const title = form.get("cardTitle") as string;
            const desc = form.get("cardDesc") as string;
            // Overwrite 'imageUrl' with special card:// scheme
            form.set("imageUrl", `card://?title=${encodeURIComponent(title)}&desc=${encodeURIComponent(desc)}`);
        }

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
            <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-md relative overflow-y-auto max-h-[90vh]">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

                <h2 className="text-xl font-bold text-white mb-4">
                    {type === "LINK_AD" ? "📢 Buy Text Link Ad" : `📢 Rent Ad Space (${type})`}
                </h2>

                {msg && <p className="bg-red-500/20 text-red-500 p-2 rounded mb-4 text-sm">{msg}</p>}

                <form action={handleBuy} className="space-y-4">
                    <input type="hidden" name="type" value={type} />

                    {/* Format Toggle for Banners (allowing them to look like Text Ads) */}
                    {type !== "LINK_AD" && (
                        <div className="flex gap-2 bg-slate-800 p-1 rounded-lg mb-4">
                            <button type="button" onClick={() => setFormat("IMAGE")} className={`flex-1 py-1 rounded-md text-sm font-bold ${format === "IMAGE" ? "bg-blue-600 text-white" : "text-slate-400"}`}>Has Image</button>
                            <button type="button" onClick={() => setFormat("TEXT")} className={`flex-1 py-1 rounded-md text-sm font-bold ${format === "TEXT" ? "bg-blue-600 text-white" : "text-slate-400"}`}>Text Only</button>
                        </div>
                    )}

                    {type === "LINK_AD" ? (
                        <>
                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold">Link Title (Max 25 chars)</label>
                                <input name="title" required maxLength={25} placeholder="Best Site Ever" className="w-full bg-black/30 border border-slate-700 rounded p-2 text-white" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-400 uppercase font-bold">Short Description (Max 50 chars)</label>
                                <input name="description" required maxLength={50} placeholder="Click here to warn money..." className="w-full bg-black/30 border border-slate-700 rounded p-2 text-white" />
                            </div>
                        </>
                    ) : (
                        <>
                            {format === "IMAGE" ? (
                                <div>
                                    <label className="text-xs text-slate-400 uppercase font-bold">Banner Image URL (468x60 recommended)</label>
                                    <input name="imageUrl" required type="url" placeholder="https://..." className="w-full bg-black/30 border border-slate-700 rounded p-2 text-white" />
                                </div>
                            ) : (
                                <>
                                    {/* Text Inputs for 'Text Card' format on Banner Slot */}
                                    <div>
                                        <label className="text-xs text-slate-400 uppercase font-bold">Ad Title (Max 30 chars)</label>
                                        <input name="cardTitle" required maxLength={30} placeholder="My Website" className="w-full bg-black/30 border border-slate-700 rounded p-2 text-white" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-slate-400 uppercase font-bold">Description (Max 60 chars)</label>
                                        <input name="cardDesc" required maxLength={60} placeholder="Best services for you..." className="w-full bg-black/30 border border-slate-700 rounded p-2 text-white" />
                                        {/* Hidden dummy imageUrl to pass HTML5 validation if required, but we set it in handleBuy */}
                                        <input type="hidden" name="imageUrl" value="card://placeholder" />
                                    </div>
                                </>
                            )}
                        </>
                    )}

                    {type === "TOP_HEADER" && format === "IMAGE" && (
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold">Banner Size</label>
                            <select name="size" className="w-full bg-black/30 border border-slate-700 rounded p-2 text-white font-bold">
                                <option value="728x90">Large Leaderboard (728x90)</option>
                                <option value="150x150">Small Square (150x150)</option>
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="text-xs text-slate-400 uppercase font-bold">Target Link</label>
                        <input name="targetUrl" required type="url" placeholder="https://..." className="w-full bg-black/30 border border-slate-700 rounded p-2 text-white" />
                    </div>

                    <div className="flex gap-2 bg-slate-800 p-1 rounded-lg">
                        <button type="button" onClick={() => setMode("DAYS")} className={`flex-1 py-1 rounded-md text-sm font-bold ${mode === "DAYS" ? "bg-emerald-500 text-white" : "text-slate-400"}`}>Days</button>
                        <button type="button" onClick={() => setMode("VIEWS")} className={`flex-1 py-1 rounded-md text-sm font-bold ${mode === "VIEWS" ? "bg-emerald-500 text-white" : "text-slate-400"}`}>Views</button>
                        <button type="button" onClick={() => setMode("CLICKS")} className={`flex-1 py-1 rounded-md text-sm font-bold ${mode === "CLICKS" ? "bg-emerald-500 text-white" : "text-slate-400"}`}>Clicks</button>
                    </div>

                    {mode === "DAYS" && (
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold">Duration (Days) - ${dailyPrice}/day</label>
                            <input name="days" type="number" min="1" value={days} onChange={e => setDays(parseInt(e.target.value))} className="w-full bg-black/30 border border-slate-700 rounded p-2 text-white" />
                        </div>
                    )}

                    {mode === "VIEWS" && (
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold">Views - ${prices.per1kViews}/1k views</label>
                            <input name="views" type="number" step="1000" min="1000" value={views} onChange={e => setViews(parseInt(e.target.value))} className="w-full bg-black/30 border border-slate-700 rounded p-2 text-white" />
                        </div>
                    )}

                    {mode === "CLICKS" && (
                        <div>
                            <label className="text-xs text-slate-400 uppercase font-bold">Clicks - ${prices.perClick}/click</label>
                            <input name="clicks" type="number" min="10" value={clicks} onChange={e => setClicks(parseInt(e.target.value))} className="w-full bg-black/30 border border-slate-700 rounded p-2 text-white" />
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
    );
}
