"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// --- FETCHING ---

export async function getAdminAds() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { banners: [], textAds: [] };

    const banners = await db.banner.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: { select: { username: true, id: true, email: true } }
        }
    });

    const textAds = await db.adPlacement.findMany({
        orderBy: { startsAt: "desc" },
        include: {
            user: { select: { username: true, id: true, email: true } }
        }
    });

    return { banners, textAds };
}

// --- ACTIONS ---

// 1. Disable/Enable Banner
export async function toggleBannerStatus(bannerId: string, isActive: boolean) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

    await db.banner.update({
        where: { id: bannerId },
        data: { active: isActive }
    });
    revalidatePath("/admin/advertisements");
    revalidatePath("/dashboard");
}

// 2. Ban Ad Placement (Text Ad)
export async function banAdPlacement(adId: string) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

    await db.adPlacement.update({
        where: { id: adId },
        data: { status: "BANNED" }
    });
    revalidatePath("/admin/advertisements");
    revalidatePath("/dashboard");
}

// 3. Edit Text (Ad Placement)
export async function updateAdText(adId: string, newText: string) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

    await db.adPlacement.update({
        where: { id: adId },
        data: { text: newText }
    });
    revalidatePath("/admin/advertisements");
    revalidatePath("/dashboard");
}

// 4. Update Price (Works for both, but usually for reporting or adjustment)
export async function updateAdPrice(id: string, type: "BANNER" | "TEXT", newPrice: number) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

    if (type === "BANNER") {
        await db.banner.update({
            where: { id },
            data: { cost: newPrice }
        });
    } else {
        await db.adPlacement.update({
            where: { id },
            data: { pricePaid: newPrice }
        });
    }
    revalidatePath("/admin/advertisements");
}
