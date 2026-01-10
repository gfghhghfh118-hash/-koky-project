import { auth } from "@/auth";
import { PromoAssetsClient } from "./PromoAssetsClient";

export default async function PromoAssetsPage() {
    const session = await auth();
    const username = session?.user?.username || "user";

    // Construct the "Safe Bio Link"
    // Using absolute URL to ensure it works everywhere
    const bioLink = `https://koky-project-op1a.vercel.app/u/${username}`;

    const assets = [
        {
            id: "banner-sq-1",
            title: "Instagram/Square Post",
            type: "IMAGE" as const,
            url: "/promo/square-1.png",
            color: "bg-gradient-to-br from-purple-600 to-blue-600",
            text: "Earn money online simply by watching videos! 💸 #SideHustle",
        },
        {
            id: "banner-wide-1",
            title: "Facebook/Twitter Cover",
            type: "IMAGE" as const,
            url: "/promo/wide-1.png",
            color: "bg-gradient-to-r from-emerald-500 to-teal-500",
            text: "Join thousands earning daily with Koky. Sign up now! 🚀",
        },
        {
            id: "yt-professional",
            title: "Professional YouTube Script",
            type: "TEXT" as const,
            url: "/promo/yt-icon.png",
            color: "bg-red-600",
            text: `💰 Earn money by watching videos + 10% discount on ads publishing
🎯 10% referral commission + EXTRA 10% bonus for 3 months when you create a website review video
👉 Sign up now:
${bioLink}`,
        }
    ];

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white">Marketing Assets & Scripts</h1>
                <p className="text-slate-500">Download banners and copy smart scripts to promote your referral link safely.</p>
            </div>

            <PromoAssetsClient assets={assets} />
        </div>
    );
}
