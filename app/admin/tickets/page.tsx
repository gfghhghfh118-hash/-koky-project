import { db } from "@/lib/db";
import { MessageSquare, Mail, Calendar, User, Phone } from "lucide-react";
import { AdminReplyForm } from "@/components/AdminReplyForm";

export default async function AdminTicketsPage() {
    // Basic query to avoid any sync issues
    const tickets = await db.supportTicket.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true }
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-white flex items-center gap-3">
                    Support <span className="text-blue-500">Inbox</span>
                </h1>
                <p className="text-gray-400 text-sm font-medium">View user inquiries submitted through the system.</p>
            </div>

            <div className="grid grid-cols-1 gap-6 pb-20">
                {tickets.map((ticket) => (
                    <div key={ticket.id} className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8 hover:border-blue-500/20 transition-all">
                        <div className="flex flex-col md:flex-row justify-between gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-500/10 text-blue-500 border border-blue-500/20">
                                        {ticket.status}
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest">
                                        <Calendar size={12} />
                                        {new Date(ticket.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2">{ticket.subject}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap mb-6">
                                    {ticket.message}
                                </p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                        <Mail size={16} className="text-blue-500" />
                                        <div className="overflow-hidden">
                                            <p className="text-[10px] font-black text-gray-500 uppercase">Email</p>
                                            <p className="text-xs font-bold text-gray-300 truncate">{ticket.email}</p>
                                        </div>
                                    </div>
                                    {ticket.whatsapp && (
                                        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                                            <Phone size={16} className="text-green-500" />
                                            <div>
                                                <p className="text-[10px] font-black text-gray-500 uppercase">WhatsApp</p>
                                                <p className="text-xs font-bold text-gray-300">{ticket.whatsapp}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <AdminReplyForm
                                    ticketId={ticket.id}
                                    existingReply={ticket.adminReply}
                                />
                            </div>
                        </div>
                    </div>
                ))}

                {tickets.length === 0 && (
                    <div className="py-32 text-center opacity-20">
                        <MessageSquare size={64} className="mx-auto mb-4" />
                        <p className="text-xl font-black uppercase tracking-widest">No Messages</p>
                    </div>
                )}
            </div>
        </div>
    );
}
