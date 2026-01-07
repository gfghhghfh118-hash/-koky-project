import { db } from "@/lib/db";
import { getAdSettings } from "@/actions/ad-settings";
import { BannerRouteGuard } from "@/components/banners/BannerRouteGuard";
import { BannerSlotClient } from "@/components/BannerSlotClient";

export async function BottomBannerSection() {
    // Fetch bottom banner
    const bottomBanner = await db.banner.findFirst({
        // ... (query remains same)
        where: {
            active: true,
            type: "FOOTER",
            OR: [
                { expiresAt: { gt: new Date() } },
                { days: 0 }
            ]
        },
        orderBy: { createdAt: "desc" }
    });

    const settings = await getAdSettings();

    return (
        <BannerRouteGuard>
            <div className="w-full bg-white border-t border-slate-100 py-8 mt-8">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="flex justify-center">
                        <BannerSlotClient type="FOOTER" initialBanner={bottomBanner} displayPrice={settings.pricePerDayHeader} />
                    </div>
                </div>
            </div>
        </BannerRouteGuard>
    );
}
