import { auth } from "@/auth";
import { getAdminAds } from "@/actions/admin-ads"; // Import the fetcher
import { AdminAdsClient } from "@/components/admin/AdManagementClient";
import { ShieldAlert } from "lucide-react";

export default async function AdminAdsPage() {
    const session = await auth();

    // 1. Check Admin Role
    if (session?.user?.role !== "ADMIN") {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center text-red-500">
                <ShieldAlert size={48} className="mb-4" />
                <h1 className="text-2xl font-black">Access Denied</h1>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }

    // 2. Fetch Data
    try {
        const { banners, textAds } = await getAdminAds();

        // Serialize data to avoid "Date object passed to Client Component" error
        const serializedBanners = JSON.parse(JSON.stringify(banners));
        const serializedTextAds = JSON.parse(JSON.stringify(textAds));

        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                        Ad Management
                    </h1>
                    <p className="text-slate-500 font-medium">Monitor active campaigns, edit text, and manage pricing.</p>
                </div>

                <AdminAdsClient banners={serializedBanners} textAds={serializedTextAds} />
            </div>
        );
    } catch (error) {
        console.error("Error loading Admin Ads:", error);
        return (
            <div className="p-6 text-red-500 bg-red-50 rounded-xl border border-red-200">
                <h3 className="font-bold text-lg mb-2">Error Loading Ads</h3>
                <p className="font-mono text-sm">{String(error)}</p>
            </div>
        );
    }
}
