"use client";

import { sendAdminOTP, verifyAdminOTP } from "@/actions/admin-auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, Send } from "lucide-react";

export default function AdminVerifyPage() {
    // 2 Separate Codes (Phone + Email)
    const [phoneCode, setPhoneCode] = useState("");
    const [emailCode, setEmailCode] = useState("");

    const [status, setStatus] = useState<"idle" | "sending" | "sent" | "verifying" | "error">("idle");
    const [message, setMessage] = useState("");
    const router = useRouter();

    // Auto-send on load
    useEffect(() => {
        handleSendCode();
    }, []);

    const handleSendCode = async () => {
        setStatus("sending");
        const res = await sendAdminOTP();
        if (res.success) {
            setStatus("sent");
            // Show server message (which may include Twilio errors)
            setMessage(res.success as string);
        } else {
            setStatus("error");
            setMessage(res.error || "Failed to send code");
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("verifying");
        // Verify Phone + Email only
        const res = await verifyAdminOTP(phoneCode, emailCode);
        if (res.success) {
            router.push("/admin");
            router.refresh();
        } else {
            setStatus("error");
            setMessage(res.error as string);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-8">

                {/* Header */}
                <div className="text-center">
                    <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                        <ShieldCheck size={40} />
                    </div>
                    <h1 className="text-3xl font-bold mb-2 tracking-tight">Security Check (Updated)</h1>
                    <p className="text-slate-400">Complete 2-step verification (Email & WhatsApp)</p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">

                    {/* 1. Phone Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <span className="bg-blue-500/20 text-blue-400 p-1 rounded">📱</span> WhatsApp Verification
                        </label>
                        <p className="text-xs text-slate-500">Enter code sent to 112439****</p>
                        <input
                            type="text"
                            value={phoneCode}
                            onChange={(e) => setPhoneCode(e.target.value)}
                            placeholder="000000"
                            className="w-full bg-slate-950/50 border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest outline-none transition-all"
                            maxLength={6}
                        />
                    </div>

                    {/* 2. Email Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <span className="bg-red-500/20 text-red-400 p-1 rounded">📧</span> Email Verification
                        </label>
                        <p className="text-xs text-slate-500">Enter code sent to gfg****@gmail.com</p>
                        <input
                            type="text"
                            value={emailCode}
                            onChange={(e) => setEmailCode(e.target.value)}
                            placeholder="000000"
                            className="w-full bg-slate-950/50 border border-slate-700 focus:border-red-500 focus:ring-1 focus:ring-red-500 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-widest outline-none transition-all"
                            maxLength={6}
                        />
                    </div>

                    {/* Message */}
                    {message && (
                        <div className={`text-center text-sm font-bold p-3 rounded-xl border ${status === "error" ? "bg-red-500/10 border-red-500/20 text-red-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"}`}>
                            {message}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={status === "verifying" || phoneCode.length < 6 || emailCode.length < 6}
                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2 mt-4"
                    >
                        {status === "verifying" ? <Loader2 className="animate-spin" /> : "Verify Identity"}
                    </button>

                    <button
                        type="button"
                        onClick={handleSendCode}
                        className="w-full text-slate-500 text-sm hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                        <Send size={14} /> Resend Codes
                    </button>
                </form>
            </div>
        </div>
    );
}
