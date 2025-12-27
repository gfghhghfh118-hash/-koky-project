import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./lib/db";
import { z } from "zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
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
    ],
    pages: {
        signIn: "/login",
    },
    session: { strategy: "jwt" },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.id && session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
    },
});
