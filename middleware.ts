import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Rename export default to export const proxy for Next.js 16 convention
export default NextAuth(authConfig).auth((req) => {
    // ----------------------------------------------------------------------
    // GEO BLOCKING: Block access from Israel (IL)
    // ----------------------------------------------------------------------

    const country = (req as any).geo?.country || req.headers.get("x-vercel-ip-country");

    // Prevent infinite redirect loop: Don't redirect if already on /blocked
    if (country === "IL" && !req.nextUrl.pathname.startsWith("/blocked")) {
        return Response.redirect(new URL("/blocked", req.nextUrl.origin));
    }
    // ----------------------------------------------------------------------

    // ----------------------------------------------------------------------
    const { pathname } = req.nextUrl;
    const isDashboard = pathname.startsWith("/dashboard");
    const isAdminRoute = pathname.startsWith("/admin");
    const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
    const isLoggedIn = !!req.auth;
    const isAdminUser = req.auth?.user?.role === "ADMIN";
    const userEmail = req.auth?.user?.email;
    const MASTER_ADMIN_EMAIL = "gfghhghfh118@gmail.com";

    // DEBUG: Log Cookies
    const cookieNames = req.cookies.getAll().map(c => c.name).join(", ");
    console.log(`[Proxy Middleware] Path: ${pathname}, LoggedIn: ${isLoggedIn}, Cookies: [${cookieNames}]`);

    // REDIRECT LOGGED-IN USERS FROM AUTH PAGES
    if (isLoggedIn && isAuthRoute) {
        return Response.redirect(new URL("/dashboard", req.nextUrl.origin));
    }

    // PROTECT DASHBOARD (& ADMIN) FROM UNAUTHENTICATED USERS
    if ((isDashboard || isAdminRoute) && !isLoggedIn) {
        console.log(`[Proxy Middleware] Redirecting unauthenticated user from ${pathname} to /login`);
        let callbackUrl = pathname;
        if (req.nextUrl.search) callbackUrl += req.nextUrl.search;
        const loginUrl = new URL("/login", req.nextUrl.origin);
        loginUrl.searchParams.set("callbackUrl", callbackUrl);
        return Response.redirect(loginUrl);
    }

    // BLOCK NON-ADMINS FROM ADMIN ROUTES
    if (isAdminRoute && !isAdminUser) {
        return Response.redirect(new URL("/dashboard", req.nextUrl.origin));
    }

    // ADMIN 2FA & LOCATION PROTECTION
    if (isAdminRoute && isAdminUser) {
        // 0. MASTER EMAIL CHECK
        if (userEmail !== MASTER_ADMIN_EMAIL) {
            console.log(`[Admin Blocked] Unauthorized Email: ${userEmail}`);
            return Response.redirect(new URL("/blocked", req.nextUrl.origin));
        }
        // 1. LOCATION CHECK (Skip on Localhost)
        const host = req.headers.get("host") || "";
        const isLocalhost = host.includes("localhost") || host.includes("127.0.0.1");

        if (!isLocalhost && process.env.NODE_ENV === "production") {
            const city = req.headers.get("x-vercel-ip-city") || "";
            const region = req.headers.get("x-vercel-ip-region") || "";
            console.log(`[Admin Access Attempt] IP City: ${city}, Region: ${region}`);

            // User requested "El Marg, Cairo". 
            // IP Geo usually returns "Cairo". We allow both to prevent lockout.
            const allowedLocations = ["Cairo", "El Marg", "Al Marg", "Ezbet El Nakhl"];
            const isAllowed = allowedLocations.some(loc =>
                city.toLowerCase().includes(loc.toLowerCase()) ||
                region.toLowerCase().includes(loc.toLowerCase())
            );

            if (!isAllowed) {
                console.log(`[Admin Blocked] Location Mismatch. User is in: ${city}, ${region}`);
                // Redirect to a specific blocked page or generic
                return Response.redirect(new URL("/blocked", req.nextUrl.origin));
            }
        }

        // 2. 2FA CHECK
        // Allow access to verify page without loop
        if (pathname === "/admin/verify") return;

        // Check for 2FA cookie
        const isVerified = req.cookies.get("ADMIN_2FA_VERIFIED")?.value === "true";

        if (!isVerified) {
            return Response.redirect(new URL("/admin/verify", req.nextUrl.origin));
        }
    }
    // ----------------------------------------------------------------------
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
