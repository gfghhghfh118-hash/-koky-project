"use client";

import { requestDeposit } from "@/actions/finance";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Wallet, Smartphone, Landmark, Copy, CheckCircle, Send } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
        >
            {pending ? "Submitting..." : (
                <>
                    <Send size={18} />
                    Submit for Review
                </>
            )}
        </button>
    );
}

export default function DepositPage() {
    const [copied, setCopied] = useState("");
    const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null);

    const wallets = [
        { name: "Vodafone Cash", number: "01124399677", icon: Smartphone, color: "text-red-600", bg: "bg-red-50", border: "border-red-200", value: "VODAFONE_CASH" },
        { name: "Etisalat Cash", number: "01124399677", icon: Smartphone, color: "text-green-600", bg: "bg-green-50", border: "border-green-200", value: "ETISALAT" },
        { name: "InstaPay", number: "01124399677", icon: Landmark, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200", value: "INSTAPAY" },
        { name: "Binance Smart Chain (BEP20)", number: "0x14dbd970158f96bad00d3caf53162f7758c41d2a", icon: Wallet, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200", value: "BINANCE_SMART_CHAIN" },
    ];

    const copyToClipboard = (text: string, name: string) => {
        navigator.clipboard.writeText(text);
        setCopied(name);
        setTimeout(() => setCopied(""), 2000);
    };

    async function clientAction(formData: FormData) {
        setMessage(null);
        const res = await requestDeposit(formData);
        if (res?.error) setMessage({ error: res.error });
        if (res?.success) setMessage({ success: res.success });
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 font-black text-gray-700 uppercase tracking-widest text-sm">
                    Add Funds (Deposit)
                </div>
                <div className="p-8">

                    <div className="mb-8 p-5 bg-blue-50/50 text-blue-800 rounded-2xl border border-blue-100 flex gap-4 items-start">
                        <div className="bg-blue-500 text-white p-2 rounded-xl shrink-0">
                            <Wallet size={20} />
                        </div>
                        <div className="text-sm">
                            <p className="font-bold mb-1">How to Deposit:</p>
                            <ol className="list-decimal list-inside space-y-1 text-blue-700 font-medium">
                                <li>Send the amount to one of the wallets below.</li>
                                <li>Copy the <strong>Transaction ID</strong> or <strong>Sender Number</strong>.</li>
                                <li>Fill out the form below and submit it for review.</li>
                            </ol>
                            <p className="mt-3 text-[11px] font-bold">Minimum Deposit: $1.00 (approx. 50 EGP)</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-10">
                        {wallets.map((wallet) => (
                            <div key={wallet.name} className={`flex items-center justify-between p-4 border rounded-2xl ${wallet.bg} ${wallet.border} transition-all hover:shadow-md`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl bg-white ${wallet.color} shadow-sm`}>
                                        <wallet.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className={`font-black text-xs uppercase tracking-wider ${wallet.color}`}>{wallet.name}</h3>
                                        <p className="font-mono text-gray-900 font-bold mt-1">{wallet.number}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => copyToClipboard(wallet.number, wallet.name)}
                                    className="p-3 bg-white/50 hover:bg-white rounded-xl transition-all text-gray-400 hover:text-gray-900 border border-transparent hover:border-gray-200 shadow-sm"
                                    title="Copy Number"
                                >
                                    {copied === wallet.name ? <CheckCircle size={20} className="text-green-500" /> : <Copy size={20} />}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="pt-8 border-t border-gray-100">
                        <h3 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                            <Send size={18} className="text-emerald-500" />
                            Confirm Your Payment
                        </h3>

                        <form action={clientAction} className="space-y-6">
                            {message?.error && <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm border border-red-100 font-bold">{message.error}</div>}
                            {message?.success && <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl text-sm border border-emerald-100 font-bold">{message.success}</div>}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Payment Method</label>
                                    <select name="method" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold" required>
                                        <option value="VODAFONE_CASH">Vodafone Cash</option>
                                        <option value="ETISALAT">Etisalat Cash</option>
                                        <option value="INSTAPAY">InstaPay</option>
                                        <option value="BINANCE_SMART_CHAIN">Binance Smart Chain (BEP20)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Amount ($ USD)</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        step="0.01"
                                        min="1"
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                                        placeholder="1.00"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Transaction ID / Sender Number</label>
                                <input
                                    type="text"
                                    name="transactionId"
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all font-bold"
                                    placeholder="Enter TXID or your phone number"
                                    required
                                />
                                <p className="text-[10px] text-gray-400 mt-2 font-medium italic">Our manager will verify this information manually.</p>
                            </div>

                            <SubmitButton />
                        </form>
                    </div>

                </div>
            </div>
        </div>
    );
}
