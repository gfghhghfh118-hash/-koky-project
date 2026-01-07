"use server";

import { db } from "@/lib/db";

/**
 * Distributes commissions for a completed task.
 * @param tx Prisma Transaction Client
 * @param userId The ID of the worker who completed the task
 * @param amount The visible payout amount the worker received (e.g. 0.20)
 */
export async function distributeCommissions(tx: any, userId: string, amount: number) {
    // 1. Fetch User & Referrer
    const user = await tx.user.findUnique({
        where: { id: userId },
        select: { id: true, referredById: true }
    });

    if (!user) return; // Should not happen

    // RATES
    const L1_RATE = 0.10; // 10% to Direct Referrer (e.g. 10% of worker's payout)

    const l1Amount = amount * L1_RATE;

    // 3. Handle Level 1 (Direct Referrer)
    if (user.referredById) {
        // Credit Referrer
        await tx.user.update({
            where: { id: user.referredById },
            data: {
                balance: { increment: l1Amount },
                referralEarnings: { increment: l1Amount }
            }
        });
    } else {
        // No Referrer -> Site takes the 8%
        // We log this as profit
        await tx.adminProfitLog.create({
            data: {
                source: "ORPHAN_USER_COMMISSION",
                amount: l1Amount,
                description: `8% from user ${userId} (No Referrer)`
            }
        });
    }

    // Note: The WORKER already got their 'amount' in the calling function.
    // This function only handles the side-payments.
}
