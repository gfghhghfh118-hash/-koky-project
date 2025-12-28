"use client";

import { requestWithdrawal } from "@/actions/finance";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { Wallet, Smartphone, Landmark } from "lucide-react";

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

    async function clientAction(formData: FormData) {
        const res = await requestWithdrawal(formData);
        if (res?.error) setMessage({ error: res.error });
        if (res?.success) setMessage({ success: res.success });
    }

    return (
        <div className="max-w-xl mx-auto space-y-6">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
                <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 font-bold text-gray-700">
                    Withdraw Funds
                </div>
                <div className="p-6">

                    <div className="mb-6 p-4 bg-yellow-50 text-yellow-800 text-sm border border-yellow-200 rounded">
                        Minimum withdrawal amount is <strong>$0.20 (10 EGP)</strong>. Requests are processed within 24 hours.
                    </div>

                    <form action={clientAction} className="space-y-4">
                        {message?.error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm border border-red-200">{message.error}</div>}
                        {message?.success && <div className="bg-green-50 text-green-600 p-3 rounded text-sm border border-green-200">{message.success}</div>}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Payment Method</label>
                            <div className="grid grid-cols-3 gap-2">
                                <label className="cursor-pointer">
                                    <input type="radio" name="method" value="VODAFONE_CASH" className="peer sr-only" required />
                                    <div className="p-3 border rounded text-center hover:bg-gray-50 peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 transition-all">
                                        <Smartphone className="mx-auto mb-1" size={20} />
                                        <span className="text-xs font-bold">Vodafone</span>
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="method" value="ETISALAT" className="peer sr-only" />
                                    <div className="p-3 border rounded text-center hover:bg-gray-50 peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 transition-all">
                                        <Smartphone className="mx-auto mb-1" size={20} />
                                        <span className="text-xs font-bold">Etisalat</span>
                                    </div>
                                </label>
                                <label className="cursor-pointer">
                                    <input type="radio" name="method" value="INSTAPAY" className="peer sr-only" />
                                    <div className="p-3 border rounded text-center hover:bg-gray-50 peer-checked:border-purple-500 peer-checked:bg-purple-50 peer-checked:text-purple-700 transition-all">
                                        <Landmark className="mx-auto mb-1" size={20} />
                                        <span className="text-xs font-bold">InstaPay</span>
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
                            <label className="block text-sm font-bold text-gray-700 mb-1">Amount ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                name="amount"
                                className="w-full p-2 border border-gray-300 rounded focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
                                placeholder="0.00"
                                required
                            />
                        </div>

                        <SubmitButton />
                    </form>
                </div>
            </div>
        </div>
    );
}
