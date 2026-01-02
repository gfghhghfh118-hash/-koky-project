
import { getRandomBanner } from "@/actions/banners";
import { BannerSlotClient } from "./BannerSlotClient";

export async function BannerSlot({ type, manualData }: { type: string, manualData?: any }) {
    // If manualData is provided (even null), use it. Otherwise fetch random.
    const banner = manualData !== undefined ? manualData : await getRandomBanner(type);

    return <BannerSlotClient type={type} initialBanner={banner} />;
}
