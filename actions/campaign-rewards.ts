"use server";

import { db } from "@/lib/db";

/**
 * Checks if the user has ever created a campaign before.
 * If NOT, calculates 10% of the cost and credits it back to Ad Balance.
 * 
 * @param tx Prisma Transaction Client
 * @param userId User ID
 * @param cost Total cost paid for the campaign
 */
export async function checkAndApplyFirstCampaignBonus(tx: any, userId: string, cost: number) {
    if (cost <= 0) return;

    // 1. Check if user has ANY prior campaigns
    // We check concurrently for speed
    const [taskCount, bannerCount, adPlacementCount] = await Promise.all([
        tx.task.count({ where: { creatorId: userId } }),
        tx.banner.count({ where: { userId: userId } }),
        tx.adPlacement.count({ where: { userId: userId } })
    ]);

    const totalCampaigns = taskCount + bannerCount + adPlacementCount;

    // IMPORTANT: The count *might* include the one we are currently creating if this runs AFTER creation in the same transaction context depending on isolation level,
    // BUT usually we call this helper BEFORE creation to be safe, or we check if count == 0.
    // However, if called inside the same transaction where creation happens, optimization might vary.
    // Safe approach: The caller should call this BEFORE the `create` statement of the new campaign.
    // If called before, count should be 0.

    if (totalCampaigns === 0) {
        // First Time!
        const bonusAmount = cost * 0.10; // 10%

        if (bonusAmount > 0) {
            // Credit Ad Balance
            await tx.user.update({
                where: { id: userId },
                data: { adBalance: { increment: bonusAmount } }
            });

            // Log Transaction (Bonus)
            await tx.transaction.create({
                data: {
                    userId,
                    amount: bonusAmount,
                    type: "BONUS",
                    description: "First Campaign Cashback (10%)",
                    status: "COMPLETED",
                    method: "SYSTEM",
                    wallet: "Ad Balance"
                }
            });

            // Log Admin Info (Expense)
            await tx.adminProfitLog.create({
                data: {
                    source: "CAMPAIGN_BONUS",
                    amount: -bonusAmount, // Negative because it's a cost to system
                    description: `First Campaign Bonus for User ${userId}`
                }
            });
        }
    }
}
