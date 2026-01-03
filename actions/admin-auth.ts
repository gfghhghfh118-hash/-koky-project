"use server";

import { auth } from "@/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// In-memory store for OTPs (For production, use Redis or DB)
// Map<UserId, { code: string, expires: number }>
const otpStore = new Map<string, { code: string, expires: number }>();

export async function sendAdminOTP() {
    const session = await auth();
    // STRICT SECURITY: Only allow specific email
    const allowedEmail = "gfghhghfh118@gmail.com";

    if (!session?.user?.id || session.user.role !== "ADMIN" || session.user.email !== allowedEmail) {
        return { error: "Unauthorized Access: This account is not the Master Admin." };
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store with 5 min expiry
    otpStore.set(session.user.id, {
        code,
        expires: Date.now() + 5 * 60 * 1000
    });

    // MOCK WHATSAPP SENDING
    console.log(`
    ==================================================
    [MOCK WHATSAPP] To: +201124399677
    Your Admin Access Code is: ${code}
    ==================================================
    `);

    return { success: "Code sent to WhatsApp (+201124399677)" };
}

export async function verifyAdminOTP(code: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    const record = otpStore.get(session.user.id);

    if (!record) {
        return { error: "No code requested or code expired. Please request a new one." };
    }

    if (Date.now() > record.expires) {
        otpStore.delete(session.user.id);
        return { error: "Code expired." };
    }

    if (record.code !== code) {
        return { error: "Invalid code." };
    }

    // Success! Set cookie
    // Note: HttpOnly cookie is secure
    const cookieStore = await cookies();
    cookieStore.set("ADMIN_2FA_VERIFIED", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 4, // 4 hours session
        path: "/",
    });

    otpStore.delete(session.user.id);

    return { success: true };
}
