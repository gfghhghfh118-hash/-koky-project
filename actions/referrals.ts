"use server";

import { cookies } from "next/headers";

export async function setReferralCookie(ref: string) {
    if (!ref) return;

    const cookieStore = await cookies();
    cookieStore.set("ref", ref, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
    });

    // Check if the referrer exists (optional verification, mostly for UI feedback if we wanted to return it)
    // For now just setting the cookie is enough for the register action to pick it up.
}
