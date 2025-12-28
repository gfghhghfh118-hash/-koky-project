import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const domain = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const sendVerificationEmail = async (email: string, token: string) => {
    const confirmLink = `${domain}/auth/new-verification?token=${token}`;

    console.log(`>>> [MAIL] Sending verification email to ${email} with link: ${confirmLink}`);

    // If no API key, we just log it (dev mode)
    if (!process.env.RESEND_API_KEY) {
        console.log(">>> [MAIL] No RESEND_API_KEY found, skipping actual email send.");
        return;
    }

    try {
        await resend.emails.send({
            from: "onboarding@resend.dev", // Default for testing, user needs to verify domain for custom
            to: email,
            subject: "Confirm your email",
            html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>`
        });
        console.log(">>> [MAIL] Email sent successfully.");
    } catch (error) {
        console.error(">>> [MAIL] Error sending email:", error);
    }
};
