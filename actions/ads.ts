"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getAdSettings() {
    const settings = await db.adSetting.findMany();
    const prices = {
        BANNER_PRICE: settings.find(s => s.key === "BANNER_PRICE")?.value || 0.20,
        TEXT_PRICE: settings.find(s => s.key === "TEXT_PRICE")?.value || 0.07,
    };
    return prices;
}

export async function updateAdSettings(bannerPrice: number, textPrice: number) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

    try {
        await db.adSetting.upsert({
            where: { key: "BANNER_PRICE" },
            update: { value: bannerPrice },
            create: { key: "BANNER_PRICE", value: bannerPrice }
        });
        await db.adSetting.upsert({
            where: { key: "TEXT_PRICE" },
            update: { value: textPrice },
            create: { key: "TEXT_PRICE", value: textPrice }
        });
        revalidatePath("/admin/ads");
        revalidatePath("/dashboard");
        return { success: "Prices updated successfully" };
    } catch (err) {
        return { error: "Failed to update prices" };
    }
}

export async function purchaseAd(type: "BANNER_TOP" | "TEXT_SIDEBAR", slotIndex: number, linkUrl: string, content: string) {
    const session = await auth();
    if (!session || !session.user) return { error: "Not logged in" };

    const userId = session.user.id;
    const prices = await getAdSettings();
    const price = type === "BANNER_TOP" ? prices.BANNER_PRICE : prices.TEXT_PRICE;

    // Check if slot is taken (active and not expired)
    const existing = await db.adPlacement.findFirst({
        where: {
            type,
            slotIndex,
            status: "ACTIVE",
            expiresAt: { gt: new Date() }
        }
    });

    if (existing) return { error: "This slot is already taken. Please try again later." };

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user || user.adBalance < price) return { error: "Insufficient Ad Balance" };

    try {
        await db.$transaction(async (tx) => {
            // Deduct balance
            await tx.user.update({
                where: { id: userId },
                data: { adBalance: { decrement: price } }
            });

            // Create Ad
            await tx.adPlacement.create({
                data: {
                    type,
                    slotIndex,
                    userId,
                    pricePaid: price,
                    linkUrl: linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`,
                    imageUrl: type === "BANNER_TOP" ? content : null, // content is image URL for banner
                    text: type === "TEXT_SIDEBAR" ? content : null,   // content is text for sidebar
                    status: "ACTIVE",
                    startsAt: new Date(),
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 Hours
                }
            });
        });

        revalidatePath("/dashboard");
        return { success: "Ad purchased successfully!" };
    } catch (err) {
        return { error: "Transaction failed. Please try again." };
    }
}

export async function getActiveAds(type: "BANNER_TOP" | "TEXT_SIDEBAR") {
    const ads = await db.adPlacement.findMany({
        where: {
            type,
            status: "ACTIVE",
            expiresAt: { gt: new Date() }
        }
    });
    return ads;
}

export async function getAllAdsForAdmin() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return [];

    return await db.adPlacement.findMany({
        orderBy: { startsAt: "desc" },
        include: { user: { select: { username: true, email: true } } }
    });
}

export async function moderateAd(adId: string, action: "BAN" | "ACTIVATE" | "DELETE", newContent?: { text?: string, link?: string }) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

    try {
        if (action === "DELETE") {
            await db.adPlacement.delete({ where: { id: adId } });
        } else if (newContent) {
            await db.adPlacement.update({
                where: { id: adId },
                data: {
                    text: newContent.text,
                    linkUrl: newContent.link
                }
            });
        }
        else {
            await db.adPlacement.update({
                where: { id: adId },
                data: { status: action === "BAN" ? "BANNED" : "ACTIVE" }
            });
        }
        revalidatePath("/admin/ads");
        revalidatePath("/dashboard");
        return { success: "Ad updated" };
    } catch (err) {
        return { error: "Operation failed" };
    }
}
