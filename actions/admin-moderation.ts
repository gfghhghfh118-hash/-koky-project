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

        const tasks = await db.task.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            },
            take: 50
        });

        return tasks;
    } catch (error) {
        console.error("Feed Error:", error);
        return [];
    }
}
