import { db } from "@/lib/db";
import { SurfingClient } from "./SurfingClient";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getTranslation } from "@/lib/i18n/server";

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
        redirect("/dashboard/earn");
    }

    const task = await db.task.findUnique({
        where: { id: taskId },
    });

    if (!task) {
        return <div className="p-10 text-center text-slate-500 font-black uppercase tracking-widest">{t('premium.empty_queue')}</div>;
    }

    return <SurfingClient task={task} />;
}
