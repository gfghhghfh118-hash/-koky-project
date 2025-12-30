"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

const ADMIN_SECRET = process.env.ADMIN_SETUP_SECRET || "KOKY_ADMIN_2025";

export async function promoteToAdmin(secret: string) {
    const session = await auth();
    if (!session?.user?.email) {
        return { success: false, error: "Not logged in" };
    }

    if (secret !== ADMIN_SECRET) {
        return { success: false, error: "Invalid secret key" };
    }

    try {
        await db.user.update({
            where: { email: session.user.email },
            data: { role: "ADMIN" }
        });

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Admin promotion error:", error);
        return { success: false, error: "Database error" };
    }
}
