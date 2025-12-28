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

    const task = await db.task.findUnique({
        where: { id: taskId },
    });

    if (!task || task.type !== "YOUTUBE") {
        return <div className="p-10 text-center">Video not found</div>;
    }

    return <YouTubeClient task={task} />;
}
