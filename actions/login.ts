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
        if (error instanceof Error && error.message.includes("CredentialsSignin")) {
            return "CredentialError";
        }
        // NextAuth v5 throws an error on redirect, so we need to re-throw it if it's not a credential error
        // But preventing the crash on credential mismatch is key.
        // Let's print it to see what we are dealing with in dev.
        // console.error("Login Error:", error); 

        // In v5, "CredentialsSignin" might be the name or code.
        const err = error as { type?: string; code?: string };
        if (err.type === "CredentialsSignin" || err.code === "credentials") {
            return "CredentialError";
        }

        throw error;
    }
}
