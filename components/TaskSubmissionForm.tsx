"use client";

import { useState } from "react";
import { submitTaskProof } from "@/actions/tasks";
import { ChevronRight, ExternalLink, Zap, Info, Send, X } from "lucide-react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { cn } from "@/lib/utils";

export default function TaskSubmissionForm({ task }: { task: any }) {
    const { t } = useLanguage();
    const [expanded, setExpanded] = useState(false);
    const [proof, setProof] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

    // If successful, we might ideally refresh the page state, but simple message is easiest for now.
    // In nextjs server actions, revalidatePath handles it usually.

    async function handleSubmit() {
        if (!proof) return;
        setLoading(true);
        const res = await submitTaskProof(task.id, proof);
        setLoading(false);

        if (res.error) {
            setMessage({ type: 'error', text: res.error });
        } else if (res.success) {
            setMessage({ type: 'success', text: res.success });
            // Ideally trigger refresh or hide form.
            // For now, let the user reload (or action revalidatePath will reload)
        }
    }

    if (!expanded) {
        return (
            <button
                onClick={() => setExpanded(true)}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-3 border border-white/5 shadow-xl group uppercase text-xs tracking-[0.2em]"
            >
                {t('dashboard.start_earning')}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
        );
    }

    return (
        <div className="bg-white dark:bg-slate-950 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in-95 duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 rounded-full" />

            {message ? (
                <div className={cn(
                    "p-6 rounded-2xl text-center space-y-4",
                    message.type === 'error' ? 'bg-rose-500/10 text-rose-600 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                )}>
                    <div className="font-black text-sm uppercase tracking-widest">{message.text}</div>
                    {message.type === 'success' && (
                        <button onClick={() => window.location.reload()} className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-600 underline underline-offset-4">
                            {t('premium.back')}
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-6 relative z-10">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white mb-2">
                        <Info size={16} className="text-primary" />
                        <h4 className="font-black text-xs uppercase tracking-widest">{t('advertise_tasks.description')}</h4>
                    </div>

                    <p className="text-sm text-slate-500 font-medium leading-relaxed italic border-l-2 border-slate-100 dark:border-slate-800 pl-4 py-1">
                        {task.description}
                    </p>

                    {task.url && (
                        <a
                            href={task.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-primary hover:bg-primary hover:text-white transition-all text-xs font-black uppercase tracking-widest border border-slate-100 dark:border-slate-800"
                        >
                            {t('advertise_tasks.target_link')} <ExternalLink size={14} />
                        </a>
                    )}


                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                            <Zap size={12} className="text-amber-500" />
                            {task.approvalType === "AUTO" ? t('advertise_tasks.secret_answer') : t('tasks_review.proof')}
                        </label>

                        {task.approvalType === "AUTO" && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 p-3 rounded-xl mb-2 flex gap-3 items-start">
                                <Info className="text-blue-500 shrink-0 mt-0.5" size={16} />
                                <p className="text-xs text-blue-700 dark:text-blue-300 font-bold leading-relaxed">
                                    {t('advertise_tasks.auto_instruction_worker')}
                                </p>
                            </div>
                        )}

                        <textarea
                            value={proof}
                            onChange={(e) => setProof(e.target.value)}
                            className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl focus:border-primary focus:ring-4 focus:ring-primary/5 outline-none text-sm transition-all font-medium placeholder:text-slate-400"
                            rows={3}
                            placeholder={task.approvalType === "AUTO" ? t('advertise_tasks.secret_answer_placeholder') : t('advertise_tasks.description_placeholder')}
                        />
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setExpanded(false)}
                            className="p-4 bg-slate-50 dark:bg-slate-900 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-2xl transition-all border border-slate-100 dark:border-slate-800"
                            title={t('common.cancel')}
                        >
                            <X size={20} />
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !proof}
                            className="flex-1 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 dark:disabled:bg-slate-900 text-white disabled:text-slate-400 font-black text-xs uppercase tracking-[0.2em] rounded-2xl transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 active:scale-95"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {t('premium.verifying')}
                                </>
                            ) : (
                                <>
                                    {t('premium.claim')}
                                    <Send size={16} />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
