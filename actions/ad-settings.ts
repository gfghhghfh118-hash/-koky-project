"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getAdSettings() {
    try {
        let settings = await db.adSettings.findFirst();

        if (!settings) {
            settings = await db.adSettings.create({
                data: {
                    pricePerDaySidebar: 0.15,
                    pricePerDayHeader: 0.15,
                    pricePer1kViews: 0.20,
                    pricePerClick: 0.005
                }
            });
        }
        return settings;
    } catch (error) {
        console.error("Error fetching AdSettings (likely migration missing):", error);
        // Fallback defaults to prevent crash
        return {
            id: "fallback",
            pricePerDaySidebar: 0.15,
            pricePerDayHeader: 0.15,
            pricePer1kViews: 0.20,
            pricePerClick: 0.005
        };
    }
}

export async function updateAdSettings(data: FormData) {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return { error: "Unauthorized" };

    try {
        const settings = await getAdSettings();

        await db.adSettings.update({
            where: { id: settings.id },
            data: {
                pricePerDaySidebar: parseFloat(data.get("pricePerDaySidebar") as string),
                pricePerDayHeader: parseFloat(data.get("pricePerDayHeader") as string),
                pricePer1kViews: parseFloat(data.get("pricePer1kViews") as string),
                pricePerClick: parseFloat(data.get("pricePerClick") as string),
            }
        });

        revalidatePath("/admin/settings/ads");
        return { success: "Ad settings updated successfully" };
    } catch (error) {
        console.error("Failed to update ad settings:", error);
        return { error: "Failed to update settings" };
    }
}
