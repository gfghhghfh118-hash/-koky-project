"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// FIXED PRICING CONFIGURATION (Avizo style)
const SOCIAL_PRICING = {
    YOUTUBE_LIKE: { price: 0.002, payout: 0.001 },
    YOUTUBE_SUBSCRIBE: { price: 0.004, payout: 0.002 },
    YOUTUBE_COMMENT: { price: 0.005, payout: 0.003 },
    FACEBOOK_FOLLOW: { price: 0.004, payout: 0.002 },
};

export async function createSocialTask(data: { title: string; type: string; url: string; quantity: number }) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) throw new Error("Unauthorized");

    const pricing = SOCIAL_PRICING[data.type as keyof typeof SOCIAL_PRICING];
    if (!pricing) throw new Error("Invalid Task Type");

    const totalCost = pricing.price * data.quantity;

    // Transaction
    const user = await db.user.findUnique({ where: { id: session.user.id } });
    if (!user || user.adBalance < totalCost) throw new Error("Insufficient Advertising Balance");

    await db.$transaction(async (tx) => {
        // Deduct
        await tx.user.update({
            where: { id: user.id },
            data: { adBalance: { decrement: totalCost } }
        });

        // Create Task
        await tx.socialTask.create({
            data: {
                title: data.title,
                type: data.type,
                url: data.url,
                price: pricing.price,
                payout: pricing.payout,
                creatorId: user.id,
                active: true
            }
        });
    });

    revalidatePath("/dashboard/advertise");
    return { success: true };
}

export async function completeSocialTask(taskId: string) {
    const session = await auth();
    if (!session || !session.user || !session.user.id) throw new Error("Unauthorized");

    const task = await db.socialTask.findUnique({ where: { id: taskId } });
    if (!task || !task.active) throw new Error("Task invalid");

    // Check if performed already
    const existing = await db.taskLog.findFirst({
        where: { userId: session.user.id, socialTaskId: taskId }
    });
    if (existing) throw new Error("Already completed");

    // Monitor for 24 hours
    const monitorUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await db.$transaction(async (tx) => {
        // Credit User
        await tx.user.update({
            where: { id: session.user.id },
            data: { balance: { increment: task.payout } }
        });

        // Log
        await tx.taskLog.create({
            data: {
                userId: session.user.id,
                socialTaskId: taskId,
                earnedAmount: task.payout,
                status: "COMPLETED",
                monitorUntil: monitorUntil
            }
        });

        // Transaction Log for history
        await tx.transaction.create({
            data: {
                userId: session.user.id,
                amount: task.payout,
                type: "EARNING",
                description: `Completed Social Task: ${task.type}`,
                status: "COMPLETED"
            }
        });
    });

    revalidatePath("/dashboard/earn");
    return { success: true };
}

export async function penalizeUser(logId: string, reason: string) {
    // ADMIN ONLY ACTION (Or automated system)
    const session = await auth();
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

    const log = await db.taskLog.findUnique({
        where: { id: logId },
        include: { socialTask: true, user: true }
    });

    if (!log || !log.socialTask || log.isPenalized) throw new Error("Invalid Log");

    const penaltyAmount = 0.10;

    await db.$transaction(async (tx) => {
        // 1. Deduct from Worker
        await tx.user.update({
            where: { id: log.userId },
            data: { balance: { decrement: penaltyAmount } }
        });

        // 2. Refund Advertiser (Full Price of the interaction)
        // Correct logic: Refund the advertiser what they paid for this specific action
        await tx.user.update({
            where: { id: log.socialTask!.creatorId },
            data: { adBalance: { increment: log.socialTask!.price } }
        });

        // 3. Mark Log as Penalized
        await tx.taskLog.update({
            where: { id: logId },
            data: {
                isPenalized: true,
                status: "PENALIZED"
            }
        });

        // 4. Record Penalty Transaction
        await tx.transaction.create({
            data: {
                userId: log.userId,
                amount: -penaltyAmount,
                type: "PENALTY",
                description: `Penalty: Undoing Social Task (${log.socialTask?.type}). Reason: ${reason}`,
                status: "COMPLETED"
            }
        });
    });

    return { success: true };
}
