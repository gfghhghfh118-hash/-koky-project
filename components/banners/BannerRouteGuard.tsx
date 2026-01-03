"use client";

import { usePathname } from "next/navigation";

export function BannerRouteGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    // console.log("BannerRouteGuard Pathname:", pathname);

    // List of path prefixes where banners should be hidden
    const excludedPrefixes = ["/admin", "/dashboard/admin"];

    const shouldHide = excludedPrefixes.some((prefix) => pathname?.startsWith(prefix));

    if (shouldHide) {
        return null;
    }

    return <>{children}</>;
}
