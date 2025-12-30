import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth((req) => {
    const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");
    const isAdmin = req.auth?.user?.role === "ADMIN";

    // Strict Admin Redirect: If Admin tries to go to Dashboard, send to Admin Panel
    // DISABLED: This was causing issues where admins couldn't see dashboard pages like Referrals
    /*
    if (isDashboard && isAdmin) {
        const newUrl = new URL("/admin", req.nextUrl.origin);
        return Response.redirect(newUrl);
    }
    */
});

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
