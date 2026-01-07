"use client";

import { useFormStatus } from "react-dom";
import { updateAdSettings, getAdSettings } from "@/actions/ad-settings";
import { useEffect, useState } from "react";
import { Save, Loader2, DollarSign } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
        >
            {pending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            Save Settings
        </button>
    );
}

export default function AdSettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        getAdSettings().then(setSettings);
    }, []);

    async function handleUpdate(formData: FormData) {
        setMsg("");
        const res = await updateAdSettings(formData);
        if (res.error) setMsg("Error: " + res.error);
        if (res.success) {
            setMsg("Settings saved successfully!");
            getAdSettings().then(setSettings); // Refresh
        }
    }

    if (!settings) return <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" size={32} /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Ad Space Configuration</h1>
                    <p className="text-slate-500 text-sm font-medium">Manage pricing for banner advertisements across the platform.</p>
                </div>
            </div>

            <div className="premium-card p-8">
                {msg && (
                    <div className={`p-4 rounded-xl mb-6 text-sm font-bold ${msg.includes("Error") ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-600"}`}>
                        {msg}
                    </div>
                )}

                <form action={handleUpdate} className="space-y-8">

                    {/* Pay Per Day Section */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg"><DollarSign size={16} /></span>
                            <h3 className="font-bold text-slate-900 dark:text-white">Cost Per Day (Duration)</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Sidebar Banner (Daily)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                    <input
                                        name="pricePerDaySidebar"
                                        defaultValue={settings.pricePerDaySidebar}
                                        type="number" step="0.01" min="0"
                                        className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">Cost for 24 hours (Sidebar 200x300)</p>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">Header/Footer Banner (Daily)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                    <input
                                        name="pricePerDayHeader"
                                        defaultValue={settings.pricePerDayHeader}
                                        type="number" step="0.01" min="0"
                                        className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                                    />
                                </div>
                                <p className="text-[10px] text-slate-400 mt-1">Cost for 24 hours (Top/Bottom Strips)</p>
                            </div>
                        </div>
                    </div>

                    {/* Pay Per Impression/Click */}
                    <div className="space-y-4 pt-4">
                        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                            <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg"><DollarSign size={16} /></span>
                            <h3 className="font-bold text-slate-900 dark:text-white">Performance Pricing (CPM / CPC)</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">CPM - Cost Per 1000 Views</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                    <input
                                        name="pricePer1kViews"
                                        defaultValue={settings.pricePer1kViews}
                                        type="number" step="0.01" min="0"
                                        className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-wider mb-2">CPC - Cost Per Click</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                                    <input
                                        name="pricePerClick"
                                        defaultValue={settings.pricePerClick}
                                        type="number" step="0.001" min="0"
                                        className="w-full pl-7 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                        <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
