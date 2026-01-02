"use client";

import { requestWithdrawal } from "@/actions/finance";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Wallet, Smartphone, Landmark, Clock } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded shadow-sm disabled:opacity-50 transition-colors"
        >
            {pending ? "Processing..." : "Request Withdrawal"}
        </button>
    );
}

export default function WithdrawPage() {
    const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null);
    const [isEGP, setIsEGP] = useState(false);
    const [amount, setAmount] = useState("");

    async function clientAction(formData: FormData) {
        if (isEGP) formData.set("isEGP", "true");
        const res = await requestWithdrawal(formData);
        if (res?.error) setMessage({ error: res.error });
        if (res?.success) setMessage({ success: res.success });
    }

    const handleMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const method = e.target.value;
        if (["VODAFONE_CASH", "ETISALAT", "INSTAPAY"].includes(method)) {
            setIsEGP(true);
        } else {
            setIsEGP(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 font-bold text-gray-700">
                    Withdraw Funds
                </div>
                <div className="p-6">

                    {/* Safety Alert */}
                    <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                        <div className="bg-blue-500 text-white p-1.5 rounded-lg shrink-0">
                            <Clock size={16} />
                        </div>
                        <div className="text-xs">
                            <p className="font-bold text-blue-900 mb-0.5">Withdrawal Processing</p>
                            <p className="text-blue-700/80 font-medium italic">Safety first: All withdrawals are manually audited and processed within 24 hours.</p>
                        </div>
                    </div>

                    <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 text-sm border border-yellow-200 rounded">
                        Minimum withdrawal amount is <strong>{isEGP ? "10 EGP (approx $0.20)" : "$0.20 USD"}</strong>. Requests are processed within 24 hours.
                    </div>

                    <form action={clientAction} className="space-y-4">
                        <input type="hidden" name="isEGP" value={isEGP ? "true" : "false"} />
                        {message?.error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">{message.error}</div>}
                        {message?.success && <div className="bg-green-50 text-green-600 p-3 rounded text-sm border border-green-200">{message.success}</div>}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Payment Method</label>
                            <div className="grid grid-cols-3 gap-2">
                                <label className="cursor-pointer">
                                    <input type="radio" name="method" value="VODAFONE_CASH" className="peer sr-only" required onChange={handleMethodChange} />
                                    <div className="p-3 border rounded text-center hover:bg-gray-50 peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 transition-all">
                                        <Smartphone className="mx-auto mb-1" size={20} />
                                        <span className="text-xs font-bold">Vodafone</span>
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="method" value="ETISALAT" className="peer sr-only" onChange={handleMethodChange} />
                                    <div className="p-3 border rounded text-center hover:bg-gray-50 peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 transition-all">
                                        <Smartphone className="mx-auto mb-1" size={20} />
                                        <span className="text-xs font-bold">Etisalat</span>
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="method" value="INSTAPAY" className="peer sr-only" onChange={handleMethodChange} />
                                    <div className="p-3 border rounded text-center hover:bg-gray-50 peer-checked:border-purple-500 peer-checked:bg-purple-50 peer-checked:text-purple-700 transition-all">
                                        <Landmark className="mx-auto mb-1" size={20} />
                                        <span className="text-xs font-bold">InstaPay</span>
                                    </div>
                                </label>
                            </div>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <label className="cursor-pointer">
                                    <input type="radio" name="method" value="FAUCETPAY_USDT" className="peer sr-only" onChange={handleMethodChange} />
                                    <div className="p-3 border rounded text-center hover:bg-gray-50 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 transition-all flex items-center justify-center gap-2">
                                        <Wallet className="" size={20} />
                                        <span className="text-xs font-bold">FaucetPay (TRC20)</span>
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="method" value="USDT_BEP20" className="peer sr-only" onChange={handleMethodChange} />
                                    <div className="p-3 border rounded text-center hover:bg-gray-50 peer-checked:border-yellow-500 peer-checked:bg-yellow-50 peer-checked:text-yellow-700 transition-all flex items-center justify-center gap-2">
                                        <Wallet className="" size={20} />
                                        <span className="text-xs font-bold">USDT (BEP20)</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Wallet Number / Address</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                    <Wallet size={16} />
                                </div>
                                <input
                                    type="text"
                                    name="wallet"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none transition-colors"
                                    placeholder="010xxxx or username@instapay"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                                Amount ({isEGP ? "EGP" : "$ USD"})
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.01"
                                    name="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                                    placeholder={isEGP ? "500" : "0.00"}
                                    required
                                />
                                {amount && isEGP && (
                                    <div className="absolute right-3 top-2 text-xs text-gray-400 font-medium">
                                        ≈ ${(parseFloat(amount) / 50).toFixed(2)} USD
                                    </div>
                                )}
                            </div>
                        </div>

                        <SubmitButton />
                    </form>
                </div>
            </div>
        </div>
    );
}
