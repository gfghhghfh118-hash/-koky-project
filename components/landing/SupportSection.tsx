"use client";

import { MessageSquare, Mail, Send } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { createTicket } from "@/actions/support";
import { toast } from "sonner";

export function SupportSection() {
    const { t } = useLanguage();

    return (
        <div id="support" className="max-w-4xl mx-auto px-4 py-20 border-t border-slate-100">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col md:flex-row">
                <div className="bg-slate-900 md:w-1/3 p-10 text-white flex flex-col justify-between">
                    <div>
                        <div className="bg-green-500/20 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-green-500/30">
                            <MessageSquare size={24} className="text-green-400" />
                        </div>
                        <h3 className="text-2xl font-black mb-4">{t("landing.support.title")}</h3>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            {t("landing.support.subtitle")}
                        </p>
                    </div>

                    <div className="mt-12 space-y-4">
                        <div className="flex items-center gap-3 text-slate-300">
                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                                <Mail size={14} />
                            </div>
                            <span className="text-xs font-bold tracking-wider">SUPPORT@KOKY.BZ</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-10">
                    <form action={async (formData) => {
                        console.log("Landing: Form Submit Clicked");
                        try {
                            const res = await createTicket(formData);
                            console.log("Landing: Action Response:", res);

                            if (res.success) {
                                toast.success(t("landing.support.success"));
                                (document.getElementById("support-form") as HTMLFormElement)?.reset();
                            } else {
                                toast.error(t("landing.support.error"));
                            }
                        } catch (err) {
                            console.error("Landing Action Error:", err);
                            toast.error("Connection error.");
                        }
                    }} id="support-form" className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">{t("landing.support.email")}</label>
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">{t("landing.support.whatsapp")}</label>
                                <input
                                    name="whatsapp"
                                    type="text"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                                    placeholder="+201..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">{t("landing.support.subject")}</label>
                            <input
                                name="subject"
                                type="text"
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all"
                                placeholder={t("landing.support.subject")}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5 ml-1">{t("landing.support.message")}</label>
                            <textarea
                                name="message"
                                rows={4}
                                required
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all resize-none"
                                placeholder="..."
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-green-200 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                            <Send size={18} />
                            {t("landing.support.submit")}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
