"use server";

import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function register(prevState: string | undefined, formData: FormData) {
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!username || !password || !email) {
        return "Fields required";
    }

    // Check if user exists
    const existingUser = await db.user.findFirst({
        where: {
            OR: [
                { username },
                { email }
            ]
        },
    });

    if (existingUser) {
        return "Username or Email already exists";
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check for referral cookie
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const refUsername = cookieStore.get("ref")?.value;

    let referrerId = null;

    if (refUsername) {
        const referrer = await db.user.findFirst({
            where: {
                OR: [
                    { username: refUsername },
                    { id: refUsername }
                ]
            },
            select: { id: true }
        });
        if (referrer) {
            referrerId = referrer.id;
        }
    }

    // Create user
    await db.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            balance: 0.0,
            referredById: referrerId
        },
    });

    // Send verification token
    const { generateVerificationToken } = await import("@/lib/tokens");
    const { sendVerificationEmail } = await import("@/lib/mail");

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.identifier, verificationToken.token);

    return "Confirm email sent!";
}
