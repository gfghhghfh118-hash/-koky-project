"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createYouTubeCampaign(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const userId = session.user.id;

    // 1. Get Form Data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const url = formData.get("url") as string;
    const duration = parseInt(formData.get("duration") as string);
    const views = parseInt(formData.get("views") as string); // Not strictly used for separate Task instances, but let's say we create X tasks or 1 task with limit.
    // For simplicity: We create 1 Task that stays active until Manual Pause or Budget runout.
    // BUT proper PTC usually buys X views.

    // PRICING MATRIX (Cost to Advertiser)
    // 15s -> $0.002
    // 30s -> $0.003
    // 60s -> $0.005
    let costPerView = 0.002;
    if (duration >= 30) costPerView = 0.003;
    if (duration >= 60) costPerView = 0.005;

    const totalCost = costPerView * views;

    if (views < 10) return { error: "Minimum 10 views required" };

    try {
        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user || user.adBalance < totalCost) return { error: "Insufficient Advertising Funds. Please Top Up your Ad Balance." };

        // PROFIT ALGO:
        // We take the "Real Price" (costPerView)
        // We give the worker 60% of it.
        // System keeps 40%.
        const userPayout = costPerView * 0.6;

        // TRANSACTION
        await db.$transaction(async (tx) => {
            // 1. Deduct funds
            await tx.user.update({
                where: { id: userId },
                data: { adBalance: { decrement: totalCost } }
            });

            // CHECK & APPLY FIRST CAMPAIGN BONUS (10%)
            const { checkAndApplyFirstCampaignBonus } = await import("@/actions/campaign-rewards");
            await checkAndApplyFirstCampaignBonus(tx, userId, totalCost);

            // 2. Create Task
            // Note: In a real system we'd track "remaining views".
            // Here we just create the task. To support "limit", we'd need a `viewsRemaining` field in Task. 
            // For this demo, let's assume it just creates the listing.
            await tx.task.create({
                data: {
                    title,
                    description,
                    url,
                    type: "YOUTUBE",
                    duration,
                    realPrice: costPerView,
                    userPayout: userPayout,
                    creatorId: userId, // Link to creator
                    active: true,
                    targetQuantity: views,
                    completedQuantity: 0
                }
            });
        });

        revalidatePath("/dashboard/advertise");
        // We will return success, and the client will handle redirect
        return { success: "Campaign created successfully!" };

    } catch (error) {
        console.error("Campaign Creation Error:", error);
        return { error: "Failed to create campaign" };
    }
}

export async function createSurfingCampaign(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const userId = session.user.id;

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const url = formData.get("url") as string;
    const duration = parseInt(formData.get("duration") as string);
    const views = parseInt(formData.get("views") as string);

    // SURFING PRICING (Cheaper than YouTube)
    // 15s -> $0.001
    // 30s -> $0.002
    // 60s -> $0.003
    let costPerView = 0.001;
    if (duration >= 30) costPerView = 0.002;
    if (duration >= 60) costPerView = 0.003;

    const totalCost = costPerView * views;

    if (views < 10) return { error: "Minimum 10 views required" };

    try {
        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user || user.adBalance < totalCost) return { error: "Insufficient Advertising Funds. Please Top Up." };

        // Profit Margin: Worker gets 60%
        const userPayout = costPerView * 0.6;

        await db.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: { adBalance: { decrement: totalCost } }
            });

            // CHECK & APPLY FIRST CAMPAIGN BONUS (10%)
            const { checkAndApplyFirstCampaignBonus } = await import("@/actions/campaign-rewards");
            await checkAndApplyFirstCampaignBonus(tx, userId, totalCost);


            await tx.task.create({
                data: {
                    title,
                    description,
                    url,
                    type: "SURFING", // <-- KEY DIFFERENCE
                    duration,
                    realPrice: costPerView,
                    userPayout: userPayout,
                    creatorId: userId, // Link to creator
                    active: true,
                    targetQuantity: views,
                    completedQuantity: 0
                }
            });
        });

        revalidatePath("/dashboard/advertise");
        return { success: "Surfing Campaign created successfully!" };

    } catch (error) {
        console.error("Surfing Campaign Error:", error);
        return { error: "Failed to create campaign" };
    }
}

export async function createGeneralTaskCampaign(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const userId = session.user.id;

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const url = formData.get("url") as string;
    const reward = parseFloat(formData.get("reward") as string);
    const executions = parseInt(formData.get("executions") as string);

    // Verification Fields
    const approvalType = formData.get("approvalType") as string; // "MANUAL" or "AUTO"
    const validationAnswer = formData.get("validationAnswer") as string;

    // --- AUTO ADMIN CHECKS ---
    // 1. Basic Profanity Filter (DISABLED for now)
    // const badWords = ["scam", "fraud", "illegal", "free money"];
    // const content = (title + " " + description).toLowerCase();
    // if (badWords.some(word => content.includes(word))) {
    //     return { error: "Security Check Failed: Content contains prohibited words." };
    // }

    // 2. URL Validation
    if (url && !url.startsWith("http")) {
        return { error: "Invalid URL. Must start with http:// or https://" };
    }

    // 3. Auto-Approval Validation
    if (approvalType === "AUTO" && !validationAnswer) {
        return { error: "For Auto Approval, you must provide a Secret Answer." };
    }
    // -------------------------

    if (executions < 10) return { error: "Minimum 10 executions required" };
    if (reward < 0.01) return { error: "Minimum reward is $0.01" };

    const totalCost = reward * executions;

    try {
        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user || user.adBalance < totalCost) return { error: "Insufficient Advertising Funds. Please Top Up." };

        const userPayout = reward * 0.8;

        await db.$transaction(async (tx) => {
            await tx.user.update({
                where: { id: userId },
                data: { adBalance: { decrement: totalCost } }
            });

            // CHECK & APPLY FIRST CAMPAIGN BONUS (10%)
            const { checkAndApplyFirstCampaignBonus } = await import("@/actions/campaign-rewards");
            await checkAndApplyFirstCampaignBonus(tx, userId, totalCost);


            await tx.task.create({
                data: {
                    title,
                    description,
                    url,
                    type: "TASK",
                    duration: 0,
                    realPrice: reward,
                    userPayout: userPayout,
                    creatorId: userId,
                    active: true,

                    // New Fields
                    approvalType,
                    validationAnswer: approvalType === "AUTO" ? validationAnswer : null,
                    adminStatus: "APPROVED", // Auto-Admin Passed
                    targetQuantity: executions,
                    completedQuantity: 0
                }
            });
        });

        revalidatePath("/dashboard/advertise");
        return { success: "Task Campaign created successfully!" };

    } catch (error) {
        console.error("Task Campaign Error:", error);
        return { error: "Failed to create campaign" };
    }
}

export async function deleteCampaign(taskId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const userId = session.user.id;

    try {
        const task = await db.task.findUnique({
            where: { id: taskId, creatorId: userId },
            include: { _count: { select: { logs: true } } }
        });

        if (!task) return { error: "Task not found" };

        const hasActivity = task._count.logs > 0;

        // Calculate Refund: (Target - Completed) * Real Price
        // Ensure we don't refund more than initial if something went wrong, and not negative.
        const remainingQuantity = Math.max(0, task.targetQuantity - task.completedQuantity);
        const refundAmount = remainingQuantity * task.realPrice;

        await db.$transaction(async (tx) => {
            // 1. Handle Task Deletion Strategy
            if (hasActivity) {
                // SOFT DELETE: Keep record for history, but deactivate
                await tx.task.update({
                    where: { id: taskId },
                    data: {
                        active: false,
                        adminStatus: "DELETED",
                        // Reset remaining to 0 so it doesn't count as pending work
                        targetQuantity: task.completedQuantity
                    }
                });
            } else {
                // HARD DELETE: No history, safe to remove completely
                await tx.task.delete({
                    where: { id: taskId }
                });
            }

            // 2. Process Refund if applicable
            if (refundAmount > 0) {
                // Increment Ad Balance
                await tx.user.update({
                    where: { id: userId },
                    data: { adBalance: { increment: refundAmount } }
                });

                // Log the Refund Transaction
                await tx.transaction.create({
                    data: {
                        userId,
                        type: "REFUND",
                        // Store amount nicely formatted
                        amount: parseFloat(refundAmount.toFixed(5)),
                        status: "COMPLETED",
                        method: "AD_BALANCE",
                        wallet: "System Refund",
                        txId: `REF-${taskId.slice(0, 8)}`,
                        description: `Refund for campaign: ${task.title}`
                    }
                });
            }
        });

        revalidatePath("/dashboard/advertise");
        return {
            success: hasActivity
                ? "Campaign stopped and remaining funds refunded."
                : "Campaign deleted and funds refunded."
        };

    } catch (error) {
        console.error("Delete Error:", error);
        return { error: "Failed to delete campaign. Please contact support." };
    }
}
