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

        // 3. Check for Active Promo Bonus
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { bonusRate: true, bonusExpiresAt: true }
        });

        let finalPayout = task.userPayout;
        let bonusAmount = 0;

        if (user && user.bonusRate > 0 && user.bonusExpiresAt && user.bonusExpiresAt > new Date()) {
            bonusAmount = task.userPayout * user.bonusRate;
            finalPayout += bonusAmount;
        }

        // 4. Transaction: Update User Balance & Log Admin Profit
        await db.$transaction(async (tx) => {
            // A. Give User their Payout (Base + Bonus)
            await tx.user.update({
                where: { id: userId },
                data: {
                    balance: { increment: finalPayout },
                },
            });

            // B. Log the completion
            await tx.taskLog.create({
                data: {
                    userId,
                    taskId,
                    earnedAmount: finalPayout,
                },
            });

            // C. THE SECRET SAUCE: Log Admin Profit
            // Profit = Real Price (what advertiser paid) - Base User Payout (we absorb the bonus cost? or admin pays it?)
            // Usually bonus is a cost to the platform.
            // Profit = Real Price - Base Payout. (Bonus comes from platform profits technically)
            // But if we want accurate profit logging: Profit = Real Price - Final Payout.
            const profit = task.realPrice - finalPayout;

            if (profit > 0) {
                await tx.adminProfitLog.create({
                    data: {
                        source: "TASK_COMPLETION",
                        amount: profit,
                        description: `Profit from Task ${task.title} (Bonus: ${bonusAmount})`,
                    },
                });
            }

            // D. Distribute Referral Commissions (8% Referrer, 5% Site)
            await distributeCommissions(tx, userId, task.userPayout);

            // E. Update Task Progress & Check Completion
            const newCompleted = task.completedQuantity + 1;
            const isFinished = task.targetQuantity > 0 && newCompleted >= task.targetQuantity;

            await tx.task.update({
                where: { id: taskId },
                data: {
                    completedQuantity: { increment: 1 },
                    active: isFinished ? false : undefined // Deactivate if finished
                }
            });
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/earn");
        revalidatePath("/dashboard/earn/surfing");
        return { success: true, earned: task.userPayout };

    } catch (error) {
        console.error("Task completion failed:", error);
        return { error: "Failed to complete task" };
    }
}
