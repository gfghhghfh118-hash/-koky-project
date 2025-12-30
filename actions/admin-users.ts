"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function banUser(userId: string) {
    try {
        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user) throw new Error("User not found");

        // Toggle ban status (if previously User, make BANNED, if BANNED, make USER)
        // Note: Schema currently has 'role' string. We'll use "BANNED" as a role for now or add an 'isBanned' field if preferred.
        // Based on common patterns, I'll assume we use role="BANNED" if no specific boolean exists.
        // Let's check if there is an 'active' or 'banned' field in schema? 
        // Schema shows: role String @default("USER")

        const newRole = user.role === "BANNED" ? "USER" : "BANNED";

        await db.user.update({
            where: { id: userId },
            data: { role: newRole }
        });

        revalidatePath("/admin/users");
        return { success: true, message: user.role === "BANNED" ? "تم رفع الحظر عن المستخدم" : "تم حظر المستخدم بنجاح" };
    } catch (error) {
        console.error("Error banning user:", error);
        return { success: false, message: "حدث خطأ أثناء حظر المستخدم" };
    }
}

export async function updateUserRole(userId: string, newRole: string) {
    try {
        await db.user.update({
            where: { id: userId },
            data: { role: newRole }
        });
        revalidatePath("/admin/users");
        return { success: true, message: "تم تحديث رتبة المستخدم" };
    } catch (error) {
        return { success: false, message: "فشل تحديث الرتبة" };
    }
}
