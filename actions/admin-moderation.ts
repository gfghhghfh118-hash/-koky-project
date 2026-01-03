"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function toggleTaskBan(taskId: string, currentStatus: string) {
    try {
        const session = await auth();
        if (!session || session.user.role !== "ADMIN") {
            return { error: "Unauthorized" };
        }

        const newStatus = currentStatus === "BANNED" ? "APPROVED" : "BANNED";

        await db.task.update({
            where: { id: taskId },
            data: { adminStatus: newStatus }
        });

        revalidatePath("/admin/moderation");
        return { success: `Task ${newStatus === "BANNED" ? "Banned" : "Unbanned"} Successfully` };
    } catch (error) {
        console.error("Ban Error:", error);
        return { error: "Failed to update task status" };
    }
}

export async function getModerationFeed() {
    try {
        const session = await auth();
        if (!session || session.user.role !== "ADMIN") {
            return [];
        }

        // 1. AUTO-DELETE / ARCHIVE COMPLETED TASKS
        // Instead of hard delete which kills history, let's mark as archives or soft delete if prefered.
        // But user asked for "Delete Automatically" (تحذف تلقائى).
        // To be safe for data integrity, I will DELETE tasks that are fully completed.
        // Prisma doesn't support 'deleteMany' with relation checks easily in one go for fields comparison.
        // So we will fetch candidates first or use updateMany to mark.
        // Since we want to DELETE, let's find them first.
        // WAIT: 'items' vs 'target'. Model says: targetQuantity vs completedQuantity

        // Let's filter out from VIEW first. Hard delete might be dangerous if we want to keep logs.
        // "تحذف تلقائي" -> Assuming Remove from database.

        // Find IDs of completed tasks
        // Since we can't do "where completedQuantity >= targetQuantity" directly in findMany easily without raw query,
        // We will fetch active ones and filter in memory or rely on 'status' if we maintained it.
        // But we didn't maintain a strict 'COMPLETED' string status reliably everywhere presumably.
        // Let's rely on the counts.

        // Actually, let's just return ALL tasks but SORT by Active first?
        // User said: "Show all active tasks. Finished tasks delete automatically."

        // CLEANUP STEP: Delete tasks that are finished
        // Note: This might be heavy if many tasks. Should be a cron. 
        // For now, allow it to run on page load but maybe limit it.
        // Or better: Just don't show them.
        // If user INSISTS on delete:
        /*
        const finishedTasks = await db.task.findMany({
            where: {
                OR: [
                    { status: "COMPLETED" },
                    // We can't compare columns in Prisma `where` yet easily.
                ]
            },
            select: { id: true, targetQuantity: true, completedQuantity: true }
        });
        const toDelete = finishedTasks.filter(t => t.completedQuantity >= t.targetQuantity).map(t => t.id);
        if (toDelete.length > 0) {
            await db.task.deleteMany({ where: { id: { in: toDelete } } });
        }
        */

        // SIMPLER APPROACH FOR PERFORMANCE:
        // Only return Active Tasks.
        const tasks = await db.task.findMany({
            // REMOVED "status: { not: 'COMPLETED' }" because users are reporting missing tasks.
            // Maybe some tasks have status "APPROVED" or "RUNNING" or null but are still technically active.
            // We'll trust the quantity check below.
            orderBy: { createdAt: "desc" },
            include: {
                creator: {
                    select: { username: true, email: true }
                }
            },
            take: 100
        });

        // Client-side filtering for the completion (since prisma limitation)
        // And perform async delete in background (fire and forget)
        const activeTasks = tasks.filter(t => t.completedQuantity < t.targetQuantity);

        // FIRE AND FORGET CLEANUP (Dangerous but requested)
        const finishedIds = tasks.filter(t => t.completedQuantity >= t.targetQuantity).map(t => t.id);
        if (finishedIds.length > 0) {
            // Don't await to speed up UI
            db.task.deleteMany({ where: { id: { in: finishedIds } } }).catch(console.error);
        }

        return activeTasks;
    } catch (error) {
        console.error("Feed Error:", error);
        return [];
    }
}
