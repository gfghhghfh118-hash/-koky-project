"use client";

import { createTask } from "@/actions/admin";
import { useFormStatus } from "react-dom";
import { useState } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-gradient-to-r from-red-600 to-orange-600 py-3 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all mt-4 disabled:opacity-50"
        >
            {pending ? "Creating..." : "Create Task"}
        </button>
    );
}

export function CreateTaskForm() {
    const [message, setMessage] = useState<{ error?: string; success?: string } | null>(null);

    async function clientAction(formData: FormData) {
        const res = await createTask(formData);
        if (res?.error) setMessage({ error: res.error });
        if (res?.success) setMessage({ success: res.success });
    }

    const [showInstruction, setShowInstruction] = useState(true);

    return (
        <form action={clientAction} className="space-y-4">
            {/* Instructional Alert for Advertisers */}
            {showInstruction && (
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl mb-6 relative animate-in fade-in slide-in-from-top-2">
                    <p className="text-amber-800 text-sm font-bold leading-relaxed pr-8">
                        ⚠️ تنبيه هام: يجب أن تضع 'الكود السري' بنفسك داخل الفيديو أو الموقع المستهدف (في الوصف أو تعليق مثبت)، حتى يجده المستخدم ويكتبه هنا ليحصل على المكافأة.
                    </p>
                    <button
                        type="button"
                        onClick={() => setShowInstruction(false)}
                        className="absolute top-2 right-2 text-amber-500 hover:text-amber-700 p-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                    </button>
                </div>
            )}
            {message?.error && <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm">{message.error}</div>}
            {message?.success && <div className="bg-green-500/10 text-green-500 p-3 rounded-lg text-sm">{message.success}</div>}

            <div>
                <label className="text-sm text-gray-400 mb-1 block">Task Title</label>
                <input type="text" name="title" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:border-red-500 outline-none transition-colors" placeholder="e.g. Watch Video 30s" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-red-400 mb-1 block font-bold">Real Price (Hidden)</label>
                    <input type="number" step="0.01" name="realPrice" className="w-full bg-red-900/10 border border-red-500/20 rounded-lg p-3 focus:border-red-500 outline-none" placeholder="1.00" required />
                </div>
                <div>
                    <label className="text-sm text-green-400 mb-1 block font-bold">User Payout (Visible)</label>
                    <input type="number" step="0.01" name="userPayout" className="w-full bg-green-900/10 border border-green-500/20 rounded-lg p-3 focus:border-green-500 outline-none" placeholder="0.20" required />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm text-gray-400 mb-1 block">Duration (sec)</label>
                    <input type="number" name="duration" defaultValue={30} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 outline-none" required />
                </div>
                <div>
                    <label className="text-sm text-gray-400 mb-1 block">Type</label>
                    <select name="type" className="w-full bg-black/20 border border-white/10 rounded-lg p-3 outline-none">
                        <option value="SURFING">Surfing / Website</option>
                        <option value="YOUTUBE">YouTube</option>
                    </select>
                </div>
            </div>

            <SubmitButton />
        </form>
    );
}
