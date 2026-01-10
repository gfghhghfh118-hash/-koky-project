
import { getRandomBanner } from "@/actions/banners";
import { BannerSlotClient } from "./BannerSlotClient";

import { getAdSettings } from "@/actions/ad-settings";

export async function BannerSlot({ type, manualData }: { type: string, manualData?: any }) {
    // If manualData is provided (even null), use it. Otherwise fetch random.
    const banner = manualData !== undefined ? manualData : await getRandomBanner(type);

    // Force Build Update
    let price = 0;
    const settings = await getAdSettings();
    price = settings.pricePerDayHeader;

    return <BannerSlotClient type={type} initialBanner={banner ? JSON.parse(JSON.stringify(banner)) : null} displayPrice={price} settings={JSON.parse(JSON.stringify(settings))} />;
}
