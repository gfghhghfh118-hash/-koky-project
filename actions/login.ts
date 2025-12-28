"use server";

import { signIn } from "@/auth";
import { db } from "@/lib/db";

export async function authenticate(prevState: string | undefined, formData: FormData) {
    const username = formData.get("username") as string;

    try {
        const user = await db.user.findUnique({
            where: { username },
            select: { role: true }
        });

        const redirectTo = user?.role === "ADMIN" ? "/admin" : "/dashboard";

        await signIn("credentials", {
            ...Object.fromEntries(formData),
            redirectTo,
        });
    } catch (error) {
        if ((error as Error).message.includes("CredentialsSignin")) {
            return "CredentialError";
        }
        throw error;
    }
}
