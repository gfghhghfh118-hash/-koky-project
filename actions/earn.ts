"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { distributeCommissions } from "./commissions";

export async function completeTask(taskId: string) {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
        return { error: "Not authenticated" };
    }

    const userId = session.user.id; // User ID is a string in the schema

    try {
        // 1. Fetch Task to get pricing
        const task = await db.task.findUnique({
            where: { id: taskId },
        });

        if (!task) return { error: "Task not found" };

        // 2. Check if already completed (optional but recommended)
        const existingLog = await db.taskLog.findFirst({
            where: {
                taskId: taskId,
                userId: userId
            }
        });

        if (existingLog) return { error: "Task already completed" };

        // 3. Transaction: Update User Balance & Log Admin Profit
        await db.$transaction(async (tx) => {
            // A. Give User their Payout
            await tx.user.update({
                where: { id: userId },
                data: {
                    balance: { increment: task.userPayout },
                },
            });

            // B. Log the completion
            await tx.taskLog.create({
                data: {
                    userId,
                    taskId,
                    earnedAmount: task.userPayout,
                },
            });

            // C. THE SECRET SAUCE: Log Admin Profit
            // Profit = Real Price (what advertiser paid) - User Payout (what user got)
            const profit = task.realPrice - task.userPayout;

            if (profit > 0) {
                await tx.adminProfitLog.create({
                    data: {
                        source: "TASK_COMPLETION",
                        amount: profit,
                        description: `Profit from Task ${task.title}`,
                    },
                });
            }

            // D. Distribute Referral Commissions (8% Referrer, 5% Site)
            await distributeCommissions(tx, userId, task.userPayout);
        });

        revalidatePath("/dashboard");
        return { success: true, earned: task.userPayout };

    } catch (error) {
        console.error("Task completion failed:", error);
        return { error: "Failed to complete task" };
    }
}
