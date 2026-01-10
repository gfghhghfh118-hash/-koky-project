import { db } from "@/lib/db";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { PromoSection } from "@/components/landing/PromoSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { SupportSection } from "@/components/landing/SupportSection";
import { SidebarAds } from "@/components/SidebarAds";
import { BottomBannerSection } from "@/components/banners/BottomBannerSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export const dynamic = "force-dynamic";

export default async function Home() {
    const sidebarAds = await db.banner.findMany({
        where: {
            active: true,
            type: "SIDEBAR",
            OR: [
                { expiresAt: { gt: new Date() } },
                { days: 0 }
            ]
        },
        take: 10,
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 border-t-4 border-green-600">
            <LandingHeader />

            <main className="flex-1">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 px-4">
                    {/* Main Content Area */}
                    <div className="flex-1 min-w-0">
                        <HeroSection />
                        <PromoSection />
                        <FeaturesSection />
                    </div>

                    {/* --- SIDEBAR --- */}
                    <aside className="hidden lg:block w-[300px] shrink-0 pt-10">
                        <div className="sticky top-24 space-y-6">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    Partner Links
                                </h3>
                                <SidebarAds ads={JSON.parse(JSON.stringify(sidebarAds))} displayPrice={0.07} />
                            </div>
                        </div>
                    </aside>
                </div>

                <SupportSection />

                {/* --- BOTTOM BANNER SECTION --- */}
                <BottomBannerSection />
            </main>

            <LandingFooter />
        </div>
    );
}
