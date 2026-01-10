import { db } from "@/lib/db";
import { SurfingClient } from "./SurfingClient";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getTranslation } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function SurfingPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }> // Next.js 15+ searchParams is async/awaitable or needs resolving, but usually prop is direct in 14. 
    // Wait, Next 15 changed it. Assuming wait for user confirmation or I just check standard Next 14/15.
    // The user didn't specify version but `package.json` had `"next": "^16.1.1"`.
    // Next 15+ (actually 15 RC or stable) made searchParams a Promise.
    // I'll await it.
}) {
    const t = await getTranslation();
    const session = await auth();
    if (!session) redirect("/");

    const params = await searchParams;
    const taskId = params.taskId as string;

    if (!taskId) {
        console.log(">>> [SurfingPage] No taskId provided. Checking for active SURFING tasks...");
        // Auto-select the highest paying active task
        const nextTask = await db.task.findFirst({
            where: {
                active: true,
                type: "SURFING", // Only auto-surf SURFING tasks
                logs: {
                    none: {
                        userId: session.user?.id
                    }
                }
            },
            orderBy: { userPayout: "desc" }
        });

        console.log(">>> [SurfingPage] Found Next Task:", nextTask);

        if (nextTask) {
            console.log(">>> [SurfingPage] Redirecting to:", `/dashboard/earn/surfing?taskId=${nextTask.id}`);
            redirect(`/dashboard/earn/surfing?taskId=${nextTask.id}`);
        } else {
            console.log(">>> [SurfingPage] No active SURFING tasks found.");
            // Instead of redirecting to list (which might confuse user), show a "No Tasks" message
            return (
                <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <h1 className="text-2xl font-bold">No Surfing Tasks Available</h1>
                    <p className="text-slate-500">There are currently no active websites to surf. Please check back later.</p>
                    <a href="/dashboard/earn" className="text-blue-500 hover:underline">Return to Earn Page</a>
                </div>
            );
        }
    }

    const task = await db.task.findUnique({
        where: { id: taskId },
    });

    if (!task) {
        return <div className="p-10 text-center text-slate-500 font-black uppercase tracking-widest">{t('premium.empty_queue')}</div>;
    }

    return <SurfingClient task={JSON.parse(JSON.stringify(task))} />;
}
