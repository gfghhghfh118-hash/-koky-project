"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { hash, compare } from "bcryptjs";

export async function updateUserPreferences(data: { accountType: string, allowNotifications: boolean }) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await db.user.update({
            where: { id: session.user.id },
            data: {
                accountType: data.accountType,
                allowNotifications: data.allowNotifications
            }
        });
        revalidatePath("/dashboard/settings");
        return { success: "Preferences Updated" };
    } catch (e) {
        return { error: "Failed to update preferences" };
    }
}

export async function changePassword(oldPass: string, newPass: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        const user = await db.user.findUnique({ where: { id: session.user.id } });
        if (!user || !user.password) return { error: "User not found" };

        const isValid = await compare(oldPass, user.password);
        if (!isValid) return { error: "Incorrect old password" };

        const hashed = await hash(newPass, 12);
        await db.user.update({
            where: { id: session.user.id },
            data: { password: hashed }
        });

        return { success: "Password Changed Successfully" };
    } catch (e) {
        return { error: "Failed to change password" };
    }
}
