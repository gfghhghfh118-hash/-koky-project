import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./lib/db";
import { z } from "zod";
import GoogleProvider from "next-auth/providers/google";

const providers = [
    GoogleProvider({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
        allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
        credentials: {
            username: { label: "Username", type: "text" },
            password: { label: "Password", type: "password" },
        },
        authorize: async (credentials) => {
            console.log(">>> [AUTH] Authorizing credentials:", credentials);
            const parsedCredentials = z
                .object({ username: z.string(), password: z.string() })
                .safeParse(credentials);

            if (parsedCredentials.success) {
                const { username, password } = parsedCredentials.data;
                console.log(">>> [AUTH] Parsed credentials for:", username);

                const user = await db.user.findUnique({ where: { username } });
                if (!user) {
                    console.log(">>> [AUTH] User NOT found in DB:", username);
                    return null;
                }

                // Allow users without password (Google users) to fail credentials gracefully
                if (!user.password) return null;

                console.log(">>> [AUTH] User found, comparing passwords...");
                const passwordsMatch = await bcrypt.compare(password, user.password);

                if (passwordsMatch) {
                    console.log(">>> [AUTH] SUCCESS: Passwords match for:", username);
                    return user;
                }
                console.log(">>> [AUTH] FAILURE: Password mismatch for:", username);
            } else {
                console.log(">>> [AUTH] FAILURE: Zod parsing failed:", parsedCredentials.error.format());
            }

            console.log(">>> [AUTH] Authorization returning null");
            return null;
        },
    }),
];

export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    providers,
    session: { strategy: "jwt" },
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account }) {
            // Allow Google OAuth without email verification (Google emails are verified)
            if (account?.provider === "google") return true;
            return true;
        },
        async jwt({ token }) {
            if (!token.sub) return token;

            try {
                const existingUser = await db.user.findUnique({
                    where: { id: token.sub }
                });

                if (!existingUser) {
                    console.log("[JWT] User not found in DB for token.sub:", token.sub);
                    return token;
                }

                // console.log(`[JWT Callback] User: ${existingUser.username}, Role: ${existingUser.role}`);
                token.role = existingUser.role;
                token.id = token.sub;
            } catch (error) {
                console.error("[JWT Callback] Error fetching user:", error);
            }
            return token;
        },
        async session({ session, token }) {
            // console.log("[Session Callback] Token ID:", token.sub, "Session User:", !!session.user);
            if (token.sub && session.user) {
                session.user.id = token.sub;
            }
            if (token.role && session.user) {
                session.user.role = token.role as string;
            }
            return session;
        },
    },
});
