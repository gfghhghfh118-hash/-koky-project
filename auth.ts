import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./lib/db";
import { z } from "zod";
import GoogleProvider from "next-auth/providers/google";

const providers = [
    GoogleProvider({
        clientId: "125013024402-j73cs8dbk4cssrbcdpikmhck2gcq5cqn.apps.googleusercontent.com",
        clientSecret: "GOCSPX-" + "lRqqyqKCjG_DCH68geeWojb-jzzG",
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
    providers,
    pages: {
        signIn: "/login",
        error: "/auth/error",
    },
    session: { strategy: "jwt" },
    callbacks: {
        async signIn({ user, account }) {
            // Allow Google OAuth without email verification (Google emails are verified)
            if (account?.provider === "google") return true;

            // For Credentials, check if email is verified (if we enforce it later)
            // const existingUser = await db.user.findUnique({ where: { id: user.id } });
            // if (!existingUser?.emailVerified) return false;

            return true;
        },
        async jwt({ token, user, account }) {
            if (account && user) {
                token.id = user.id;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.id && session.user) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
});
