import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Standard Next.js 15+ params
) {
    // Await params promise as per Next.js 15
    const { id } = await params;

    if (!id) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    try {
        // 1. Try finding in Banner (Image Ads)
        const banner = await db.banner.findUnique({
            where: { id }
        });

        if (banner) {
            // Increment Clicks (Fire and Forget)
            db.banner.update({
                where: { id },
                data: { clicks: { increment: 1 } }
            }).catch(e => console.error("Click Log Error:", e));

            return NextResponse.redirect(banner.targetUrl || "/");
        }

        // 2. Try finding in AdPlacement (Text/Link Ads)
        const textAd = await db.adPlacement.findUnique({
            where: { id }
        });

        if (textAd) {
             // Increment Clicks (Fire and Forget)
             db.adPlacement.update({
                where: { id },
                data: { clicks: { increment: 1 } }
            }).catch(e => console.error("Click Log Error:", e));

            return NextResponse.redirect(textAd.linkUrl || "/");
        }

        // Not Found
        return NextResponse.redirect(new URL("/", req.url));

    } catch (error) {
        console.error("Click Redirect Error:", error);
        return NextResponse.redirect(new URL("/", req.url));
    }
}
