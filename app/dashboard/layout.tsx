import { UserSidebar } from "@/components/UserSidebar";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { BannerSlot } from "@/components/BannerSlot";
import { getBannerBatch } from "@/actions/banners";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    console.log("[Dashboard Layout] Session User ID:", session?.user?.id);

    // Fetch unique banners batch for the whole page
    const banners = await getBannerBatch([
        { type: "TOP_HEADER", count: 2 },
        { type: "SIDEBAR", count: 2 },
        { type: "FOOTER", count: 2 }
    ]);

    let balance = 0;
    let adBalance = 0;
    let role = "USER";

    if (session?.user?.id) {
        const user = await db.user.findUnique({ where: { id: session.user.id } });
        balance = user?.balance || 0;
        adBalance = user?.adBalance || 0;
        role = user?.role || "USER";
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <UserSidebar
                balance={balance}
                adBalance={adBalance}
                role={role}
                sidebarBanner={
                    <div className="flex flex-col gap-4">
                        <BannerSlot type="SIDEBAR" manualData={banners["SIDEBAR"]?.[0] || null} />
                        <BannerSlot type="SIDEBAR" manualData={banners["SIDEBAR"]?.[1] || null} />
                    </div>
                }
            />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
                <div className="max-w-6xl mx-auto space-y-6">
                    {/* Top Header Banner Slot */}
                    <div className="w-full flex flex-col gap-4">
                        <BannerSlot type="TOP_HEADER" manualData={banners["TOP_HEADER"]?.[0] || null} />
                        <BannerSlot type="TOP_HEADER" manualData={banners["TOP_HEADER"]?.[1] || null} />
                    </div>
                    {children}

                    {/* Footer Banner Slot */}
                    <div className="w-full mt-10 flex flex-col gap-4">
                        <BannerSlot type="FOOTER" manualData={banners["FOOTER"]?.[0] || null} />
                        <BannerSlot type="FOOTER" manualData={banners["FOOTER"]?.[1] || null} />
                    </div>
                </div>
            </main>
        </div>
    );
}
