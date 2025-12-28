"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { ReferralView } from "./ReferralView";
import { redirect } from "next/navigation";

export default async function ReferralPage() {
    const session = await auth();
    if (!session?.user?.id) redirect("/login");

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        include: {
            referrals: {
                orderBy: { createdAt: 'desc' },
                take: 50 // Limit for now
            }
        }
    });

    if (!user) redirect("/login");

    // Generate dynamic referral link based on headers (or fallback)
    const { headers } = await import("next/headers");
    const host = (await headers()).get("host") || "koky.bz";
    const protocol = host.includes("localhost") ? "http" : "https";
    const referralLink = `${protocol}://${host}/register?ref=${user.username}`;

    const stats = {
        totalReferrals: user.referrals.length,
        activeReferrals: user.referrals.filter(r => r.balance > 0).length, // Naive "active" check
        totalEarnings: user.referralEarnings,
        referralLink: referralLink,
        recentReferrals: user.referrals.map(r => ({
            username: r.username,
            date: r.createdAt.toISOString().split('T')[0],
            income: 0 // We don't track income PER user yet in this simple schema, only total.
        }))
    };

    return <ReferralView stats={stats} />;
}
