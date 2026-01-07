"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ReviewClient } from "./ReviewClient";

export default async function TaskApprovalsPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const advertiserId = session.user.id;

    // Fetch all PENDING logs for tasks OR social tasks created by this user
    const pendingLogs = await db.taskLog.findMany({
        where: {
            status: "PENDING",
            OR: [
                { task: { creatorId: advertiserId } },
                { socialTask: { creatorId: advertiserId } }
            ]
        },
        include: {
            user: { select: { username: true } },
            task: { select: { title: true, userPayout: true } },
            socialTask: { select: { title: true, payout: true } }
        },
        orderBy: { timestamp: 'desc' }
    });

    const formattedLogs = pendingLogs.map(log => ({
        id: log.id,
        workerName: log.user.username || "Unknown User",
        taskTitle: log.task?.title || log.socialTask?.title || "Unknown Task",
        reward: log.task?.userPayout || log.socialTask?.payout || 0,
        proof: log.proof || "",
        date: log.timestamp.toISOString().split('T')[0]
    }));

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <ReviewClient initialLogs={formattedLogs} />
        </div>
    );
}
