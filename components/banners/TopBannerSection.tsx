import { db } from "@/lib/db";
import { BannerSlotClient } from "@/components/BannerSlotClient";
import { BannerRouteGuard } from "./BannerRouteGuard";
import { getAdSettings } from "@/actions/ad-settings";

export async function TopBannerSection() {
    // Fetch Large Banner
    const topBannerLarge = await db.banner.findFirst({
        where: {
            active: true,
            type: "TOP_HEADER",
            size: "728x90",
            OR: [
                { expiresAt: { gt: new Date() } },
                { days: 0 }
            ]
        },
        orderBy: { createdAt: "desc" }
    });

    // Fetch 2 Small Banners
    const topSmallBanners = await db.banner.findMany({
        where: {
            active: true,
            type: "TOP_HEADER",
            size: { not: "728x90" },
            OR: [
                { expiresAt: { gt: new Date() } },
                { days: 0 }
            ]
        },
        take: 2,
        orderBy: { createdAt: "desc" }
    });

    const settings = await getAdSettings();
    const price = settings.pricePerDayHeader;

    return (
        <BannerRouteGuard>
            <div className="w-full bg-slate-50 border-b border-slate-100 py-6 mb-4">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start justify-center">
                        {/* Large Banner (Left/Center) */}
                        <div className="flex-1 w-full flex justify-center">
                            <BannerSlotClient type="TOP_HEADER" initialBanner={topBannerLarge} displayPrice={price} />
                        </div>

                        {/* 2 Small Banners (Right Side) */}
                        <div className="flex gap-2 shrink-0">
                            {/* Small Banner 1 */}
                            <div className="w-[150px] h-[150px] bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                                {topSmallBanners[0] ? (
                                    <BannerSlotClient type="TOP_HEADER" initialBanner={topSmallBanners[0]} displayPrice={price} />
                                ) : (
                                    <BannerSlotClient type="TOP_HEADER" initialBanner={null} displayPrice={price} />
                                )}
                            </div>
                            {/* Small Banner 2 */}
                            <div className="w-[150px] h-[150px] bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                                {topSmallBanners[1] ? (
                                    <BannerSlotClient type="TOP_HEADER" initialBanner={topSmallBanners[1]} displayPrice={price} />
                                ) : (
                                    <BannerSlotClient type="TOP_HEADER" initialBanner={null} displayPrice={price} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BannerRouteGuard>
    );
}
