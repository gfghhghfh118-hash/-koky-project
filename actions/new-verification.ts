"use server";

import { db } from "@/lib/db";

export const newVerification = async (token: string) => {
    const existingToken = await db.verificationToken.findUnique({
        where: { token }
    });

    if (!existingToken) {
        return { error: "Token does not exist!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Token has expired!" };
    }

    const existingUser = await db.user.findFirst({
        where: { email: existingToken.identifier } // Ensure this matches identifier logic
    });

    if (!existingUser) {
        return { error: "Email does not exist!" };
    }

    await db.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
        }
    });

    await db.verificationToken.delete({
        where: { token: existingToken.token }
    });

    return { success: "Email verified!" };
};
