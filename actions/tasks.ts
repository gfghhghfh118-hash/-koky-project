"use server";

import { db } from "@/lib/db";
import { distributeCommissions } from "@/actions/commissions";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function submitTaskProof(taskId: string, proof: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const userId = session.user.id;

    try {
        const task = await db.task.findUnique({ where: { id: taskId } });
        if (!task || !task.active) return { error: "Task not found or inactive" };

        if (task.adminStatus !== "APPROVED") return { error: "Task is under review" };

        // Check if already done
        const existingLog = await db.taskLog.findFirst({
            where: { taskId, userId }
        });
        if (existingLog) return { error: "You have already submitted this task" };

        // --- VERIFICATION LOGIC ---
        // 1. AUTO
        if (task.approvalType === "AUTO") {
            const secretAnswer = task.validationAnswer || "";
            if (proof.trim().toLowerCase() !== secretAnswer.trim().toLowerCase()) {
                return { error: "Incorrect Validation Code. Task proof rejected." };
            }

            // Correct Code -> PAY INSTANTLY
            await db.$transaction(async (tx) => {
                // 1. Pay Worker
                await tx.user.update({
                    where: { id: userId },
                    data: { balance: { increment: task.userPayout } }
                });

                // 2. Log Task
                await tx.taskLog.create({
                    data: {
                        userId,
                        taskId,
                        status: "APPROVED",
                        proof: proof,
                        earnedAmount: task.userPayout
                    }
                });

                // 3. Distribute Commissions (8% Referrer, 5% Site)
                await distributeCommissions(tx, userId, task.userPayout);

                // 4. Log Admin Profit (Spread)
                const profit = task.realPrice - task.userPayout;
                if (profit > 0) {
                    await tx.adminProfitLog.create({
                        data: {
                            source: `TASK_COMPLETION_${task.type}`,
                            amount: profit,
                            description: `Profit from Task ${task.id} (User: ${userId})`,
                        }
                    });
                }
            });


            return { success: "Correct Code! Payment received instantly." };
        }

        // 2. MANUAL
        if (task.approvalType === "MANUAL") {
            // Create PENDING log
            await db.taskLog.create({
                data: {
                    userId,
                    taskId,
                    status: "PENDING",
                    proof: proof,
                    earnedAmount: task.userPayout
                }
            });

            return { success: "Proof submitted! Waiting for advertiser approval." };
        }

        return { error: "Unknown task type" };

    } catch (error) {
        console.error("Submit Task Error:", error);
        return { error: "Submission failed" };
    }
}
