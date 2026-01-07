import { UserSidebar } from "@/components/UserSidebar";
import { SidebarAds } from "@/components/SidebarAds";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { BannerSlot } from "@/components/BannerSlot";
import { getBannerBatch } from "@/actions/banners";
import { BottomBannerSection } from "@/components/banners/BottomBannerSection";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    console.log("[Dashboard Layout] Session User ID:", session?.user?.id);
    // Rebuild Layout Hook

    // Fetch unique banners batch for the whole page
    // Optimization: Only fetch SIDEBAR here, as Top/Bottom manage their own data
    const banners = await getBannerBatch([
        { type: "SIDEBAR", count: 5 }
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
            />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
                <div className="max-w-6xl mx-auto space-y-6">
                    {children}

                    {/* --- GLOBAL BOTTOM BANNER SECTION --- */}
                    <BottomBannerSection />
                </div>
            </main>
        </div>
    );
}
