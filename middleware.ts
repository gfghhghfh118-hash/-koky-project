import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth((req) => {
    const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
    const isAdmin = req.auth?.user?.role === "ADMIN";

    // Strict Admin Redirect: If Admin tries to go to Dashboard, send to Admin Panel
    // BUT allow access to Referrals and Settings page for testing
    /*
    if (isDashboard && isAdmin) {
        if (!req.nextUrl.pathname.includes("/invite") && !req.nextUrl.pathname.includes("/settings")) {
            const newUrl = new URL("/admin", req.nextUrl.origin);
            return Response.redirect(newUrl);
        }
    }
    */
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
