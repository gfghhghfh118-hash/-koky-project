import { db } from "@/lib/db";
import { BannerSlotClient } from "@/components/BannerSlotClient";
import { BannerRouteGuard } from "./BannerRouteGuard";

export async function BottomBannerSection() {
    const bottomBanner = await db.banner.findFirst({
        where: { active: true, type: "FOOTER" },
        orderBy: { createdAt: "desc" }
    });

    return (
        <BannerRouteGuard>
            <div className="w-full bg-white border-t border-slate-100 py-8 mt-8">
                <div className="max-w-[1200px] mx-auto px-4">
                    <div className="flex justify-center">
                        <BannerSlotClient type="FOOTER" initialBanner={bottomBanner} />
                    </div>
                </div>
            </div>
        </BannerRouteGuard>
    );
}
