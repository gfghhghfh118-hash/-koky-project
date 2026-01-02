"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ReferralView } from "./ReferralView";
import { redirect } from "next/navigation";

export default async function ReferralPage() {
    // Force dynamic rendering and no caching to prevent redirect loops
    const { headers } = await import("next/headers");
    // This forces the page to be dynamic
    await headers();

    const session = await auth();
    console.log(">>>>>>>> [Referral Page DEBUG] Session Object:", JSON.stringify(session, null, 2));

    if (!session?.user?.id) {
        redirect("/api/auth/signin");
    }

    // console.log(">>>>>>>> [Referral Page DEBUG] Searching for user with ID:", session.user.id);
    const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
            referrals: {
                orderBy: { createdAt: 'desc' },
                take: 50
            }
        }
    });

    if (!user) {
        console.error(">>>>>>>> [Referral Page ERROR] User not found in DB for ID:", session.user.id);
        // Force signout to clear bad cookie
        redirect("/api/auth/signout");
    }
    // console.log(">>>>>>>> [Referral Page DEBUG] User found:", user.username);

    // Generate dynamic referral link with robust fallback
    let host = "koky.bz";
    try {
        const { headers } = await import("next/headers");
        const headerList = await headers();
        const h = headerList.get("host");
        if (h) host = h;
    } catch (e) {
        console.error("Failed to get headers for host:", e);
    }

    const protocol = host.includes("localhost") ? "http" : "https";
    const referralLink = `${protocol}://${host}/register?ref=${user.username || user.id}`;

    const stats = {
        totalReferrals: user.referrals.length,
        activeReferrals: user.referrals.filter(r => r.balance > 0).length, // Naive "active" check
        totalEarnings: user.referralEarnings,
        referralLink: referralLink,
        recentReferrals: user.referrals.map(r => ({
            username: r.username || "User",
            date: r.createdAt.toISOString().split('T')[0],
            income: 0 // We don't track income PER user yet in this simple schema, only total.
        }))
    };

    return <ReferralView stats={stats} />;
}
