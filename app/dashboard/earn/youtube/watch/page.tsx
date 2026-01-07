import { db } from "@/lib/db";
import { YouTubeClient } from "./YouTubeClient";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function YouTubeWatchPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await auth();
    if (!session) redirect("/");

    const params = await searchParams;
    const taskId = params.taskId as string;

    if (!taskId) {
        return <div className="p-10 text-center">Task ID required</div>;
    }

    let task: any = await db.task.findUnique({
        where: { id: taskId },
    });

    if (!task) {
        const socialTask = await db.socialTask.findUnique({ where: { id: taskId } });
        if (socialTask && socialTask.active) {
            task = {
                ...socialTask,
                userPayout: socialTask.payout, // Normalize for client
                duration: 15 // Default duration for social tasks
            };
        }
    }

    if (!task || (task.type !== "YOUTUBE" && !task.type.startsWith("YOUTUBE_"))) {
        return <div className="p-10 text-center">Video not found or inactive</div>;
    }

    return <YouTubeClient task={task} />;
}
