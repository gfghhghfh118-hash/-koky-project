"use client";

import { useEffect, useState } from "react";
import { getPaymentMethods, seedPaymentMethods, togglePaymentMethod, deletePaymentMethod, updatePaymentMethod, createPaymentMethod } from "@/actions/admin-finance";
import { Loader2, Plus, Trash2, Save, RefreshCw } from "lucide-react";

export default function PaymentMethodsPage() {
    const [methods, setMethods] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [seedLoading, setSeedLoading] = useState(false);

    useEffect(() => { loadMethods(); }, []);

    const loadMethods = async () => {
        setLoading(true);
        const data = await getPaymentMethods();
        setMethods(data);
        setLoading(false);
    };

    const handleSeeding = async () => {
        setSeedLoading(true);
        await seedPaymentMethods();
        await loadMethods();
        setSeedLoading(false);
    };

    const handleToggle = async (id: string, current: boolean) => {
        // Optimistic
        setMethods(m => m.map(i => i.id === id ? { ...i, isActive: !current } : i));
        await togglePaymentMethod(id, current);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        await deletePaymentMethod(id);
        loadMethods();
    };

    const handleUpdate = async (id: string, formData: FormData) => {
        const data = Object.fromEntries(formData);
        const res = await updatePaymentMethod(id, data);
        if (res.success) alert("Updated");
        else alert("Failed");
    };

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        await createPaymentMethod(formData);
        e.currentTarget.reset();
        loadMethods();
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Payment Methods</h1>
                <button
                    onClick={handleSeeding}
                    disabled={seedLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm hover:bg-slate-700 disabled:opacity-50"
                >
                    {seedLoading ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                    Reset / Seed Defaults
                </button>
            </div>

            {loading ? <Loader2 className="animate-spin mx-auto" /> : (
                <div className="grid gap-6">
                    {methods.map(m => (
                        <div key={m.id} className={`p-4 rounded-xl border ${m.isActive ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200 opacity-75'}`}>
                            <div className="flex justify-between mb-4">
                                <div>
                                    <h3 className="font-bold flex items-center gap-2">
                                        {m.name}
                                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">{m.type}</span>
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" checked={m.isActive} onChange={() => handleToggle(m.id, m.isActive)} className="sr-only peer" />
                                            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                                            <span className="ml-2 text-xs font-medium text-slate-900">{m.isActive ? 'Active' : 'Disabled'}</span>
                                        </label>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 size={16} /></button>
                            </div>

                            <form action={formData => handleUpdate(m.id, formData)} className="grid grid-cols-2 md:grid-cols-5 gap-4 items-end">
                                <div>
                                    <label className="text-xs font-bold text-slate-500">Fee (%)</label>
                                    <input name="feePercent" defaultValue={m.feePercent} className="w-full text-sm border rounded p-1" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500">Min</label>
                                    <input name="minAmount" defaultValue={m.minAmount} className="w-full text-sm border rounded p-1" />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500">Max</label>
                                    <input name="maxAmount" defaultValue={m.maxAmount} className="w-full text-sm border rounded p-1" />
                                </div>
                                <div className="col-span-2 md:col-span-1">
                                    <label className="text-xs font-bold text-slate-500">Wallet/Instruction</label>
                                    <input name="instruction" defaultValue={m.instruction || ""} placeholder="Wallet Addr" className="w-full text-sm border rounded p-1" />
                                </div>
                                <button className="flex items-center justify-center gap-1 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                                    <Save size={14} /> Save
                                </button>
                            </form>
                        </div>
                    ))}
                </div>
            )}

            <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-300">
                <h3 className="font-bold mb-4 flex items-center gap-2"><Plus size={18} /> Add New Method</h3>
                <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-6 gap-4">
                    <input name="name" placeholder="Name (e.g. PayPal)" required className="p-2 rounded border" />
                    <select name="type" className="p-2 rounded border">
                        <option value="WITHDRAWAL">Withdrawal</option>
                        <option value="DEPOSIT">Deposit</option>
                    </select>
                    <input name="feePercent" placeholder="Fee %" type="number" step="0.1" className="p-2 rounded border" />
                    <input name="minAmount" placeholder="Min" type="number" className="p-2 rounded border" />
                    <input name="maxAmount" placeholder="Max" type="number" className="p-2 rounded border" />
                    <button className="bg-slate-900 text-white rounded font-bold hover:bg-slate-800 transition">Add</button>
                </form>
            </div>
        </div>
    );
}
