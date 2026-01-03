"use client";

import { sendAdminOTP, verifyAdminOTP } from "@/actions/admin-auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Loader2, Send } from "lucide-react";

export default function AdminVerifyPage() {
    const [code, setCode] = useState("");
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
            setMessage("Code sent to +201124399677 (Check Server Console)");
        } else {
            setStatus("error");
            setMessage(res.error || "Failed to send code");
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("verifying");
        const res = await verifyAdminOTP(code);
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
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2">Admin Verification</h1>
                    <p className="text-slate-400 text-sm">
                        Please enter the 6-digit code sent to your registered WhatsApp number ending in **677
                    </p>
                </div>

                <form onSubmit={handleVerify} className="space-y-6">
                    <div>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="000000"
                            className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] outline-none transition-all placeholder:tracking-normal placeholder:opacity-20"
                            maxLength={6}
                        />
                    </div>

                    {message && (
                        <div className={`text-center text-xs font-bold p-2 rounded-lg ${status === "error" ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={status === "verifying" || code.length < 6}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        {status === "verifying" ? <Loader2 className="animate-spin" /> : "Verify Access"}
                    </button>

                    <button
                        type="button"
                        onClick={handleSendCode}
                        className="w-full text-slate-500 text-xs hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                        <Send size={12} /> Resend Code
                    </button>
                </form>
            </div>
        </div>
    );
}
