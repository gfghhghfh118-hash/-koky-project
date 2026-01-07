import type { NextAuthConfig } from "next-auth";

export const authConfig = {
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");

            console.log(`[Middleware] Path: ${nextUrl.pathname}`);
            console.log(`[Middleware] Auth Object present: ${!!auth}`);
            console.log(`[Middleware] User ID: ${auth?.user?.id}`);
            console.log(`[Middleware] IsLoggedIn: ${isLoggedIn}`);

            if (isOnAdmin) {
                if (isLoggedIn) return true; // Let middleware check role
                return false; // Redirect to login
            }

            if (isOnDashboard) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }

            return true;
        },
        async session({ session, token }) {
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    providers: [], // Providers configured in auth.ts
} satisfies NextAuthConfig;
