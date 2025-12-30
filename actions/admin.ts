"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createTask(formData: FormData) {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const realPrice = parseFloat(formData.get("realPrice") as string);
    const userPayout = parseFloat(formData.get("userPayout") as string);
    const duration = parseInt(formData.get("duration") as string);
    const type = formData.get("type") as string || "SURFING";

    if (!title || !realPrice || !userPayout) {
        return { error: "Missing required fields" };
    }

    try {
        await db.task.create({
            data: {
                title,
                description,
                realPrice,   // HIDDEN FROM USER
                userPayout,  // VISIBLE TO USER
                duration,
                type,
            },
        });

        revalidatePath("/admin");
        return { success: "Task created successfully" };
    } catch (error) {
        console.error("Task creation failed:", error);
        return { error: "Failed to create task" };
    }
}

export async function getAdminStats() {
    const session = await auth();
    if (!session || !session.user || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    // Calculate total profit from AdminProfitLog
    const profitLogs = await db.adminProfitLog.findMany();
    const totalProfit = profitLogs.reduce((acc, log) => acc + log.amount, 0);

    return { totalProfit };
}
