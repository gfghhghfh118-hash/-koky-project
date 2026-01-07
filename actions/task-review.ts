"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { distributeCommissions } from "./commissions";

export async function approveTaskSubmission(logId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const advertiserId = session.user.id;

    try {
        const result = await db.$transaction(async (tx) => {
            // 1. Get Log and verify Advertiser owns the Task
            const log = await tx.taskLog.findUnique({
                where: { id: logId },
                include: { task: true }
            });

            if (!log) throw new Error("Log not found");
            if (log.status !== "PENDING") throw new Error("Already processed");
            if (!log.task || log.task.creatorId !== advertiserId) throw new Error("Unauthorized");

            // 2. Pay Worker
            await tx.user.update({
                where: { id: log.userId },
                data: { balance: { increment: log.earnedAmount } }
            });

            // 3. Update Log Status
            await tx.taskLog.update({
                where: { id: logId },
                data: { status: "APPROVED" }
            });

            // 4. Distribute Commissions (Referrer + Site)
            await distributeCommissions(tx, log.userId, log.earnedAmount);

            return { success: true };
        });

        revalidatePath("/dashboard/advertise");
        return { success: "Submission approved and paid." };
    } catch (error: any) {
        console.error("Approve Task Error:", error);
        return { error: error.message || "Failed to approve" };
    }
}

export async function rejectTaskSubmission(logId: string, reason?: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const advertiserId = session.user.id;

    try {
        const log = await db.taskLog.findUnique({
            where: { id: logId },
            include: { task: true }
        });

        if (!log) return { error: "Log not found" };
        if (log.status !== "PENDING") return { error: "Already processed" };
        if (!log.task || log.task.creatorId !== advertiserId) return { error: "Unauthorized" };

        await db.taskLog.update({
            where: { id: logId },
            data: {
                status: "REJECTED",
                // proof: log.proof + (reason ? `\nReason: ${reason}` : "") 
            }
        });

        revalidatePath("/dashboard/advertise");
        return { success: "Submission rejected." };
    } catch (error) {
        console.error("Reject Task Error:", error);
        return { error: "Failed to reject" };
    }
}
