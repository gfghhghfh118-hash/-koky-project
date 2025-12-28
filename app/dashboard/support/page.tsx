"use client";

import { createTicket, getUserTickets, getSessionInfo } from "@/actions/support";
import { useState, useEffect } from "react";
import { MessageSquare, Mail, Phone, Send, Clock, CheckCircle2, User, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export default function SupportPage() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [debugError, setDebugError] = useState<string | null>(null);
    const [sessionEmail, setSessionEmail] = useState<string | null>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            const data = await getUserTickets();
            const session = await getSessionInfo() as any;
            setSessionEmail(session?.user?.email || "Guest/No Session");
            setTickets(data);
            setLoading(false);
        };
        fetchTickets();
    }, []);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* New Ticket Form */}
            <div className="bg-white border border-gray-200 rounded-[2.5rem] shadow-sm overflow-hidden h-fit">
                <div className="bg-slate-50 border-b border-gray-200 px-8 py-6 font-black text-slate-700 flex items-center gap-3 uppercase text-xs tracking-widest">
                    <MessageSquare size={18} className="text-blue-600" />
                    <span>Create New Ticket</span>
                </div>
                <div className="p-8">
                    {debugError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-[10px] font-mono whitespace-pre-wrap break-all">
                            DEBUG ERROR: {debugError}
                        </div>
                    )}
                    <form action={async (formData) => {
                        console.log("Client-side: Form Submit Clicked");
                        setDebugError(null);
                        try {
                            const dataObj = Object.fromEntries(formData.entries());
                            console.log("Client-side: Form Data:", dataObj);

                            const res = await createTicket(formData);
                            console.log("Client-side: Action Response:", res);

                            if (res.success) {
                                toast.success(res.success);
                                (document.getElementById("support-form") as HTMLFormElement)?.reset();
                                // Refresh list
                                const updated = await getUserTickets();
                                setTickets(updated);
                            } else {
                                setDebugError(res.error || "Unknown action error");
                                toast.error(res.error);
                            }
                        } catch (err: any) {
                            console.error("Client-side Action Error:", err);
                            setDebugError(err.message || String(err));
                            toast.error("Connection error. See details above.");
                        }
                    }} id="support-form" className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                required
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                placeholder="e.g. Help with withdrawal"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">WhatsApp</label>
                                <input
                                    type="text"
                                    name="whatsapp"
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-300"
                                    placeholder="+20..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Message</label>
                            <textarea
                                name="message"
                                required
                                rows={4}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-blue-500 focus:bg-white outline-none transition-all resize-none placeholder:text-slate-300"
                                placeholder="Describe your issue in detail..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Send size={18} />
                            Send Ticket
                        </button>
                    </form>
                </div>
            </div>

            {/* Ticket History */}
            <div className="space-y-6">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 ml-2">
                    <Clock size={22} className="text-blue-600" />
                    Support History
                </h2>

                <div className="space-y-4 max-h-[700px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                    {loading ? (
                        <div className="p-8 text-center text-slate-400 font-bold uppercase text-xs tracking-widest animate-pulse">
                            Loading tickets...
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center">
                            <MessageSquare size={48} className="mx-auto text-slate-200 mb-4" />
                            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No support tickets found</p>
                        </div>
                    ) : (
                        tickets.map((ticket) => (
                            <div key={ticket.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm transition-all hover:shadow-md">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase text-slate-500 tracking-widest border border-slate-200">
                                            {ticket.status}
                                        </div>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">
                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-2">{ticket.subject}</h3>

                                    <div className="flex gap-4 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0">
                                            <User size={16} className="text-slate-400" />
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 flex-1">
                                            <p className="text-xs text-slate-600 leading-relaxed">{ticket.message}</p>
                                        </div>
                                    </div>

                                    {ticket.adminReply && (
                                        <div className="flex gap-4 flex-row-reverse">
                                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 border border-green-200">
                                                <ShieldCheck size={16} className="text-green-600" />
                                            </div>
                                            <div className="bg-green-50 p-4 rounded-2xl rounded-tr-none border border-green-100 flex-1 text-right">
                                                <p className="text-[10px] font-black text-green-600 uppercase mb-1">Support Team Reply</p>
                                                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                                    {ticket.adminReply}
                                                </p>
                                                {ticket.repliedAt && (
                                                    <p className="mt-2 text-[8px] text-green-600/50 font-bold uppercase">
                                                        {new Date(ticket.repliedAt).toLocaleString()}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {!ticket.adminReply && (
                                        <div className="flex justify-center mt-2">
                                            <div className="px-4 py-1.5 bg-blue-50 rounded-full border border-blue-100 flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                                <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Waiting for Reply</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Session Debug Area (Temporary) */}
            <div className="lg:col-span-2 mt-12 p-6 bg-slate-900 rounded-3xl text-[10px] font-mono text-slate-500 border border-slate-800">
                <p className="mb-2 text-slate-400 font-bold uppercase tracking-widest">System Debug Info</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p>Status: {loading ? "Loading..." : "Ready"}</p>
                        <p>Tickets Found: {tickets.length}</p>
                    </div>
                    <div>
                        <p>Logged in as: <span className="text-white font-bold">{sessionEmail}</span></p>
                        <p>Last Sync: {new Date().toLocaleTimeString()}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
