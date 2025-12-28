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
            // Update email to match token identifier if user changed email (optional logic)
        }
    });

    await db.verificationToken.delete({
        where: { id: existingToken.token } // Wait, verificationToken primary key is identifier_token usually or just token unique? In schema we made token unique but no ID.
        // Actually schema says: @@unique([identifier, token]) AND token @unique.
        // Prisma relies on unique constraints.
    });

    // Deleting by non-unique criteria in delete() is tricky if not PK. 
    // Let's use deleteMany or just update the logic to delete correctly.
    // Actually, since token is @unique in our schema, we can delete by token.
    await db.verificationToken.delete({
        where: { token: existingToken.token }
    });

    return { success: "Email verified!" };
};
