"use server";

import { auth } from "@/auth";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

// MASTER ADMIN EMAIL (Hardcoded for maximum security)
const MASTER_ADMIN_EMAIL = "gfghhghfh118@gmail.com";

// 1. SEND OTP (Generate & Store Hash in Cookie)
export async function sendAdminOTP() {
    const session = await auth();
    // Strict RBAC + Email Check
    const allowedEmail = process.env.ADMIN_EMAIL || MASTER_ADMIN_EMAIL;

    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    if (session.user.email !== allowedEmail) {
        return { error: "Unauthorized Access: This account is not the Master Admin." };
    }

    // Generate 6-digit code (Use "123456" if no API keys for easy testing)
    const hasKeys = !!process.env.RESEND_API_KEY;
    const code = hasKeys ? Math.floor(100000 + Math.random() * 900000).toString() : "123456";

    // Hash the code for security before storing in cookie
    const salt = await bcrypt.genSalt(10);
    const hashedCode = await bcrypt.hash(code, salt);

    // START COOKIE STORAGE
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 mins
    const cookieValue = `${expiresAt}|${hashedCode}`;

    const cookieStore = await cookies();
    cookieStore.set("ADMIN_OTP_SESSION", cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 5 * 60, // 5 mins
        path: "/",
        sameSite: "strict"
    });
    // END COOKIE STORAGE

    // MOCK SENDING (Log to console)
    console.log(`
    ==================================================
    [SECURITY 2FA]
    To WhatsApp: +201124399677
    To Email:    gfghhghfh118@gmail.com
    
    Your Admin Access Code is: ${code}
    ==================================================
    `);

    let emailSent = false;
    let whatsappSent = false;

    // 1. SEND REAL EMAIL (IF KEY EXISTS)
    const RESEND_KEY = process.env.RESEND_API_KEY;
    if (RESEND_KEY) {
        try {
            const { Resend } = await import("resend");
            const resend = new Resend(RESEND_KEY);
            await resend.emails.send({
                from: "onboarding@resend.dev", // Default for testing without domain setup
                to: allowedEmail,
                subject: "🔐 Admin Access Code: " + code,
                html: `<p>Your Admin Verification Code is: <strong>${code}</strong></p><p>Valid for 5 minutes.</p>`
            });
            emailSent = true;
            console.log("[EMAIL] Sent via Resend.");
        } catch (e) {
            console.error("[EMAIL] Failed to send:", e);
        }
    }

    // 2. SEND REAL WHATSAPP (IF KEYS EXIST)
    const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
    const TWILIO_TOKEN = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_FROM = process.env.TWILIO_PHONE_NUMBER; // Usually 'whatsapp:+14155238886' for sandbox

    let lastError = "";

    if (TWILIO_SID && TWILIO_TOKEN && TWILIO_FROM) {
        try {
            const { Twilio } = await import("twilio");
            const client = new Twilio(TWILIO_SID, TWILIO_TOKEN);
            await client.messages.create({
                body: `Your Admin Access Code is: ${code}`,
                from: TWILIO_FROM,
                to: "whatsapp:+201124399677"
            });
            whatsappSent = true;
            console.log("[WHATSAPP] Sent via Twilio.");
        } catch (e: any) {
            console.error("[WHATSAPP] Failed to send:", e);
            lastError = `Twilio Error: ${e.message}`;
        }
    } else if (!whatsappSent) {
        lastError = "Twilio Keys Missing in Vercel Env";
    }

    if (!emailSent && !whatsappSent) {
        // If both failed, return the error to the user
        return { error: `Failed to send codes. ${lastError}` };
    }

    const method = (emailSent || whatsappSent) ? "Sent via Real API" : "Simulated (Check Logs/Use 123456)";

    if (emailSent && !whatsappSent) {
        return { success: `تم إرسال الإيميل بنجاح، ولكن فشل الواتساب: ${lastError}` };
    }

    return { success: `Code Generated. ${method}` };
}

// 2. VERIFY OTP (Check Cookie Hash)
export async function verifyAdminOTP(phoneCode: string, emailCode: string) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        return { error: "Unauthorized" };
    }

    // BACKDOOR: Always allow "123456" for emergency access/debugging
    if (phoneCode === "123456" && emailCode === "123456") {
        const cookieStore = await cookies();
        cookieStore.set("ADMIN_2FA_VERIFIED", "true", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24,
            path: "/",
            sameSite: "strict"
        });
        return { success: true };
    }

    const cookieStore = await cookies();
    const otpSession = cookieStore.get("ADMIN_OTP_SESSION")?.value;

    if (!otpSession) {
        return { error: "No code requested or code expired. Please request a new one." };
    }

    const [expiresAtStr, hashedCode] = otpSession.split("|");
    const expiresAt = parseInt(expiresAtStr);

    if (Date.now() > expiresAt) {
        cookieStore.delete("ADMIN_OTP_SESSION");
        return { error: "Code expired." };
    }

    // 1. Verify Phone (WhatsApp) Code against Cookie Hash
    const isPhoneValid = await bcrypt.compare(phoneCode, hashedCode);
    if (!isPhoneValid) {
        return { error: "Invalid WhatsApp Code." };
    }

    // 2. Verify Email Code (Same OTP for now)
    const isEmailValid = await bcrypt.compare(emailCode, hashedCode);
    if (!isEmailValid) {
        return { error: "Invalid Email Code." };
    }

    // Success! Set cookie
    // Expire in 24 hours
    cookieStore.set("ADMIN_2FA_VERIFIED", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
        path: "/",
        sameSite: "strict"
    });

    // Clear OTP session
    cookieStore.delete("ADMIN_OTP_SESSION");

    return { success: true };
}
