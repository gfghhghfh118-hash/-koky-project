
import { getRandomBanner } from "@/actions/banners";
import { BannerSlotClient } from "./BannerSlotClient";

import { getAdSettings } from "@/actions/ad-settings";

export async function BannerSlot({ type, manualData }: { type: string, manualData?: any }) {
    // If manualData is provided (even null), use it. Otherwise fetch random.
    const banner = manualData !== undefined ? manualData : await getRandomBanner(type);

    // Force Build Update
    let price = 0;
    if (type.startsWith("DASHBOARD_GRID")) {
        price = 0.20;
    } else {
        // Fallback to settings for other future types
        const settings = await getAdSettings();
        price = type === "SIDEBAR" ? settings.pricePerDaySidebar : settings.pricePerDayHeader;
    }

    return <BannerSlotClient type={type} initialBanner={banner} displayPrice={price} />;
}
