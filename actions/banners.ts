"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function purchaseBanner(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const userId = session.user.id;
    const bannerType = formData.get("type") as string; // TOP_HEADER, SIDEBAR
    const imageUrl = formData.get("imageUrl") as string;
    const targetUrl = formData.get("targetUrl") as string;
    const durationDays = parseInt(formData.get("days") as string || "0");
    const targetViews = parseInt(formData.get("views") as string || "0");
    const targetClicks = parseInt(formData.get("clicks") as string || "0");

    // Size is determined by type for simplicity now, or passed
    let size = "468x60";
    if (bannerType === "SIDEBAR") size = "200x300";
    if (bannerType === "FOOTER") size = "728x90";

    // PRICE LIST
    // Header/Footer: $5/day
    // Sidebar: $2/day
    // CPM (Views): $1 per 1000
    // CPC (Clicks): $0.05 per click
    let cost = 0;

    if (durationDays > 0) {
        const pricePerDay = bannerType === "SIDEBAR" ? 0.15 : 0.25;
        cost = durationDays * pricePerDay;
    } else if (targetClicks > 0) {
        const pricePerClick = 0.005; // $0.005 per click (Cheap!)
        cost = targetClicks * pricePerClick;
    } else {
        // Impression based
        const pricePer1k = 0.20; // $0.20 per 1000 views
        cost = (targetViews / 1000) * pricePer1k;
    }

    if (cost < 0.01) return { error: "Minimum purchase is $0.01" };

    try {
        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user || user.adBalance < cost) {
            return { error: "Insufficient Advertising Balance." };
        }

        await db.$transaction(async (tx) => {
            // 1. Deduct Balance
            await tx.user.update({
                where: { id: userId },
                data: { adBalance: { decrement: cost } }
            });

            // 2. Create Banner
            await tx.banner.create({
                data: {
                    userId,
                    type: bannerType,
                    imageUrl,
                    targetUrl,
                    cost,
                    days: durationDays,
                    targetViews: targetViews,
                    targetClicks: targetClicks,
                    size,
                    // If days based, calculate expiry
                    expiresAt: durationDays > 0 ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000) : null
                }
            });

            // 3. Log Admin Profit
            await tx.adminProfitLog.create({
                data: {
                    source: "BANNER_AD_PURCHASE",
                    amount: cost,
                    description: `Banner Ad (${bannerType}) [${durationDays > 0 ? 'Days' : targetClicks > 0 ? 'CPC' : 'CPM'}]`
                }
            });
        });

        revalidatePath("/");
        return { success: "Banner purchased successfully!" };

    } catch (e) {
        console.error(e);
        return { error: "Transaction failed" };
    }
}

export async function registerBannerClick(bannerId: string) {
    try {
        await db.banner.update({
            where: { id: bannerId },
            data: { clicks: { increment: 1 } }
        });

        // Check limits? (We handle filtering in getter mostly, but could deactivate here)
    } catch (e) {
        // ignore
    }
}

// Helper to get random unique items from array
function getRandomUnique(arr: any[], count: number) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

export async function getBannerBatch(requirements: { type: string, count: number }[]) {
    const results: Record<string, any[]> = {};

    // For each requirement, fetch candidates
    try {
        for (const req of requirements) {
            // 1. Fetch valid banners (try/catch per loop or global?) Global is safer for DB connection issues.
            const activeBanners = await db.banner.findMany({
                where: {
                    type: req.type,
                    active: true,
                    OR: [
                        { expiresAt: { gt: new Date() } },
                        { days: 0 }
                    ],
                },
                take: 100 // Fetch a pool to pick from
            });

            // Filter limits
            const candidates = activeBanners.filter(b => {
                if (b.targetViews > 0 && b.views >= b.targetViews) return false;
                if (b.targetClicks > 0 && b.clicks >= b.targetClicks) return false;
                return true;
            });

            // Pick unique randoms
            const picked = getRandomUnique(candidates, req.count);
            results[req.type] = picked;

            // Async increment view stats for picked ones
            if (picked.length > 0) {
                try {
                    await db.banner.updateMany({
                        where: { id: { in: picked.map((b: any) => b.id) } },
                        data: { views: { increment: 1 } }
                    });
                } catch (e) { /* ignore view increment error */ }
            }
        }
    } catch (e) {
        console.error("Failed to fetch banners (DB Error):", e);
        // Fallback: return empty results so the page doesn't crash
        for (const req of requirements) {
            results[req.type] = [];
        }
    }

    return results;
}

export async function getRandomBanner(type: string) {
    // Legacy support or fallback
    const batched = await getBannerBatch([{ type, count: 1 }]);
    return batched[type]?.[0] || null;
}
