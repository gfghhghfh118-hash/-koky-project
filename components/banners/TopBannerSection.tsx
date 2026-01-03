import { db } from "@/lib/db";
import { BannerSlotClient } from "@/components/BannerSlotClient";
import { BannerRouteGuard } from "./BannerRouteGuard";

export async function TopBannerSection() {
    // Fetch Large Banner
    const topBannerLarge = await db.banner.findFirst({
        where: { active: true, type: "TOP_HEADER", size: "728x90" },
        orderBy: { createdAt: "desc" }
    });

    // Fetch 2 Small Banners
    const topSmallBanners = await db.banner.findMany({
        where: { active: true, type: "TOP_HEADER", size: { not: "728x90" } },
        take: 2,
        orderBy: { createdAt: "desc" }
    });

    return (
        <BannerRouteGuard>
            <div className="w-full bg-slate-50 border-b border-slate-100 py-6 mb-4">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-4 items-start justify-center">
                        {/* Large Banner (Left/Center) */}
                        <div className="flex-1 w-full flex justify-center">
                            <BannerSlotClient type="TOP_HEADER" initialBanner={topBannerLarge} />
                        </div>

                        {/* 2 Small Banners (Right Side) */}
                        <div className="flex gap-2 shrink-0">
                            {/* Small Banner 1 */}
                            <div className="w-[150px] h-[150px] bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                                {topSmallBanners[0] ? (
                                    <BannerSlotClient type="TOP_HEADER" initialBanner={topSmallBanners[0]} />
                                ) : (
                                    <span className="text-xs text-slate-400">Ad Space</span>
                                )}
                            </div>
                            {/* Small Banner 2 */}
                            <div className="w-[150px] h-[150px] bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center">
                                {topSmallBanners[1] ? (
                                    <BannerSlotClient type="TOP_HEADER" initialBanner={topSmallBanners[1]} />
                                ) : (
                                    <span className="text-xs text-slate-400">Ad Space</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BannerRouteGuard>
    );
}
