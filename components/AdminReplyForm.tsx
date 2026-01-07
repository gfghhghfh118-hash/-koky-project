"use client";

import { useState, useTransition } from "react";
import { replyTicket } from "@/actions/support";
import { toast } from "sonner";
import { Send, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminReplyForm({ ticketId, existingReply }: { ticketId: string, existingReply?: string | null }) {
    const [reply, setReply] = useState(existingReply || "");
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Submit clicked, reply:", reply); // Debug log

        if (!reply.trim()) {
            console.log("Empty reply, aborting.");
            return;
        }

        try {
            startTransition(async () => {
                console.log("Starting server action...");
                const res = await replyTicket(ticketId, reply);
                console.log("Server action finished:", res);

                if (res.success) {
                    toast.success(res.success);
                    router.refresh();
                } else {
                    toast.error(res.error);
                }
            });
        } catch (err) {
            console.error("Client Submit Error:", err);
            toast.error("Submission failed client-side");
        }
    };

    if (existingReply) {
        return (
            <div className="mt-6 bg-green-500/10 border border-green-500/20 p-5 rounded-2xl">
                <div className="flex items-center gap-2 text-[10px] font-black text-green-500 uppercase tracking-widest mb-3">
                    <CheckCircle2 size={14} /> Official Response Sent
                </div>
                <p className="text-green-100/80 text-sm italic">"{existingReply}"</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">
                Send a Reply
            </div>
            <div className="relative">
                <textarea
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type your response here..."
                    rows={2}
                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-blue-500 outline-none transition-all resize-none"
                    disabled={isPending}
                />
                <button
                    type="submit"
                    disabled={isPending || !reply.trim()}
                    className="absolute bottom-3 right-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-2 rounded-lg transition-all active:scale-90"
                >
                    <Send size={16} />
                </button>
            </div>
        </form>
    );
}
