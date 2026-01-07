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
    secret: process.env.AUTH_SECRET,
    callbacks: {
        ...authConfig.callbacks,
        async signIn({ user, account }) {
            // Allow Google OAuth without email verification (Google emails are verified)
            if (account?.provider === "google") return true;
            return true;
        },
        async jwt({ token, account, profile }) {
            console.log("[AUTH DEBUG] JWT Callback Triggered. Account:", !!account, "Sub:", token.sub);
            // On initial sign-in
            if (account && profile) {
                console.log("[AUTH DEBUG] Initial Sign In - Google/Provider");
                const email = profile.email;
                if (!email) return token;

                try {
                    // 1. Try to find user by email
                    let dbUser = await db.user.findUnique({
                        where: { email }
                    });

                    // 2. If user doesn't exist, create them
                    if (!dbUser) {
                        console.log("[JWT] Google User not found, creating new user for:", email);

                        // Generate unique username
                        let baseUsername = (profile.name || email.split("@")[0])
                            .replace(/[^a-zA-Z0-9]/g, "")
                            .toLowerCase()
                            .substring(0, 15);
                        let username = baseUsername;
                        let counter = 1;

                        while (await db.user.findUnique({ where: { username } })) {
                            username = `${baseUsername}${Math.floor(Math.random() * 1000)}`;
                            counter++;
                        }

                        // CHECK FOR REFERRAL
                        let referrerId: string | null = null;
                        try {
                            const { cookies } = await import("next/headers");
                            const cookieStore = await cookies();
                            const refCookie = cookieStore.get("ref");
                            const refUsername = refCookie?.value;

                            if (refUsername) {
                                console.log("[JWT] Found referral cookie for new Google user:", refUsername);
                                const referrer = await db.user.findFirst({
                                    where: {
                                        OR: [
                                            { username: refUsername },
                                            { id: refUsername }
                                        ]
                                    },
                                    select: { id: true }
                                });
                                if (referrer) {
                                    referrerId = referrer.id;
                                    console.log("[JWT] Linked to referrer:", referrer.id);
                                }
                            }
                        } catch (e) {
                            console.error("[JWT] Error checking referral cookie:", e);
                        }

                        dbUser = await db.user.create({
                            data: {
                                email,
                                username,
                                image: (profile.picture as string) || null,
                                role: "USER",
                                balance: 0,
                                adBalance: 0,
                                emailVerified: new Date(),
                                referredById: referrerId
                            }
                        });
                    }

                    // 3. Update token with DB ID and Role
                    token.sub = dbUser.id;
                    token.role = dbUser.role;
                    token.id = dbUser.id; // redundant but safe

                    console.log("[JWT] Synced Google User. Token Sub set to:", dbUser.id);
                } catch (error) {
                    console.error("[JWT] Error syncing user:", error);
                }
            } else if (token.sub) {
                // Subsequent requests, verify user exists/fetch role
                // console.log("[AUTH DEBUG] Existing token, verifying user:", token.sub);
                try {
                    const existingUser = await db.user.findUnique({
                        where: { id: token.sub }
                    });

                    if (!existingUser) {
                        console.log("[JWT] User not found (deleted?), invalidating token");
                        return null;
                    }

                    token.role = existingUser.role;
                } catch (error) {
                    // console.error("[JWT] Error refetching user", error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            console.log("[AUTH DEBUG] Session Callback. Token Sub:", token.sub, "Session User present:", !!session.user);
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
