"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Clock, Search, ExternalLink } from "lucide-react";
import { useState, useTransition } from "react";
import { approveTaskSubmission, rejectTaskSubmission } from "@/actions/task-review";
import { toast } from "sonner"; // Assuming toast exists or we can just use simple state

interface Log {
    id: string;
    workerName: string;
    taskTitle: string;
    reward: number;
    proof: string;
    date: string;
}

export function ReviewClient({ initialLogs }: { initialLogs: Log[] }) {
    const { t } = useLanguage();
    const [logs, setLogs] = useState(initialLogs);
    const [isPending, startTransition] = useTransition();

    async function handleApprove(id: string) {
        if (!confirm(t("common.confirm"))) return;

        startTransition(async () => {
            const res = await approveTaskSubmission(id);
            if (res.success) {
                setLogs(prev => prev.filter(l => l.id !== id));
                // toast.success(t("tasks_review.approved_success"));
                alert(t("tasks_review.approved_success"));
            } else {
                alert(res.error || "Error");
            }
        });
    }

    async function handleReject(id: string) {
        if (!confirm(t("common.confirm"))) return;

        startTransition(async () => {
            const res = await rejectTaskSubmission(id);
            if (res.success) {
                setLogs(prev => prev.filter(l => l.id !== id));
                alert(t("tasks_review.rejected_success"));
            } else {
                alert(res.error || "Error");
            }
        });
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("tasks_review.title")}</h1>
                    <p className="text-muted-foreground">{t("tasks_review.subtitle")}</p>
                </div>
                <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 px-4 py-2 rounded-full flex items-center gap-2 font-bold shadow-sm border border-yellow-200 dark:border-yellow-800">
                    <Clock size={18} />
                    <span>{logs.length} {t("common.pending")}</span>
                </div>
            </div>

            {logs.length === 0 ? (
                <Card className="border-dashed py-12">
                    <CardContent className="flex flex-col items-center justify-center text-center space-y-3">
                        <Search className="h-12 w-12 text-muted-foreground opacity-20" />
                        <p className="text-xl font-medium text-muted-foreground">{t("tasks_review.no_pending")}</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {logs.map((log) => (
                        <Card key={log.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <div className="grid md:grid-cols-[2fr_1fr] gap-4">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{log.date}</span>
                                        <span className="text-xs bg-muted px-2 py-0.5 rounded font-mono">ID: {log.id.slice(0, 8)}</span>
                                    </div>
                                    <h3 className="text-lg font-bold mb-4">{log.taskTitle}</h3>

                                    <div className="bg-muted/50 p-4 rounded border border-border">
                                        <div className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1 uppercase">
                                            {t("tasks_review.proof")}
                                        </div>
                                        <div className="text-sm bg-white dark:bg-zinc-950 p-3 rounded border border-input shadow-inner font-mono text-foreground whitespace-pre-wrap">
                                            {log.proof}
                                        </div>
                                    </div>
                                </CardContent>

                                <div className="bg-muted/30 p-6 border-l border-border flex flex-col justify-between items-center text-center space-y-4">
                                    <div>
                                        <div className="text-xs font-bold text-muted-foreground mb-1 uppercase">{t("tasks_review.worker")}</div>
                                        <div className="font-bold text-foreground text-lg">{log.workerName}</div>
                                    </div>

                                    <div>
                                        <div className="text-xs font-bold text-muted-foreground mb-1 uppercase">{t("tasks_history.amount")}</div>
                                        <div className="text-2xl font-black text-green-600">${log.reward.toFixed(4)}</div>
                                    </div>

                                    <div className="flex gap-2 w-full">
                                        <Button
                                            variant="destructive"
                                            className="flex-1"
                                            onClick={() => handleReject(log.id)}
                                            disabled={isPending}
                                        >
                                            <XCircle size={16} className="mr-2" />
                                            {t("tasks_review.reject")}
                                        </Button>
                                        <Button
                                            className="flex-1 bg-green-600 hover:bg-green-700"
                                            onClick={() => handleApprove(log.id)}
                                            disabled={isPending}
                                        >
                                            <CheckCircle size={16} className="mr-2" />
                                            {t("tasks_review.approve")}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
