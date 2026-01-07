"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// 1. Submit a Video for Promotion
export async function submitPromotion(videoUrl: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authorized" };

    if (!videoUrl) return { error: "Video URL is required" };

    try {
        await db.promotionRequest.create({
            data: {
                userId: session.user.id,
                videoUrl,
                status: "PENDING"
            }
        });

        revalidatePath("/dashboard/promote");
        return { success: "تم إرسال الفيديو للمراجعة بنجاح" };
    } catch (error) {
        console.error("Submit promotion error:", error);
        return { error: "فشل في إرسال الفيديو" };
    }
}

// 2. Admin: Approve Promotion & Generate Code
export async function approvePromotion(requestId: string) {
    const session = await auth();
    // In a real app, verify admin role here
    if (!session?.user?.id) return { error: "Not authorized" };

    try {
        const request = await db.promotionRequest.findUnique({
            where: { id: requestId },
            include: { user: true }
        });

        if (!request) return { error: "Request not found" };

        // Generate a unique code: e.g. "USER123-X9Y"
        // We'll use the user's name or ID part + random characters
        const usernamePart = request.user.username?.substring(0, 3).toUpperCase() || "USER";
        const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
        const code = `${usernamePart}-${randomPart}-PROMO`;

        // Create the Promo Code (10% for 90 days)
        await db.promoCode.create({
            data: {
                code,
                bonusRate: 0.10, // 10%
                duration: 90,    // 90 Days
                maxUses: 1,      // One time use
            }
        });

        // Update Request Status
        await db.promotionRequest.update({
            where: { id: requestId },
            data: {
                status: "APPROVED",
                adminNote: code // Store code here so admin can see it
            }
        });

        revalidatePath("/admin/promotions");
        return { success: true, code };

    } catch (error) {
        console.error("Approve promotion error:", error);
        return { error: "فشل في قبول الطلب وإنشاء الكود" };
    }
}

// 3. Admin: Reject Promotion
export async function rejectPromotion(requestId: string) {
    try {
        await db.promotionRequest.update({
            where: { id: requestId },
            data: { status: "REJECTED" }
        });
        revalidatePath("/admin/promotions");
        return { success: true };
    } catch (error) {
        return { error: "Failed to reject" };
    }
}

// 4. User: Redeem Code
export async function redeemPromoCode(code: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "يجب تسجيل الدخول أولاً" };

    const userId = session.user.id;

    try {
        const promo = await db.promoCode.findUnique({
            where: { code }
        });

        if (!promo) return { error: "الكود غير صالح" };

        if (promo.usedCount >= promo.maxUses) {
            return { error: "تم استخدام هذا الكود بالفعل" };
        }

        // Apply to User
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + promo.duration);

        await db.$transaction([
            // Update User
            db.user.update({
                where: { id: userId },
                data: {
                    bonusRate: promo.bonusRate,
                    bonusExpiresAt: expiresAt
                }
            }),
            // Update Code Usage
            db.promoCode.update({
                where: { id: promo.id },
                data: {
                    usedCount: { increment: 1 }
                }
            })
        ]);

        return { success: `تم تفعيل الكود! حصلت على زيادة ${(promo.bonusRate * 100).toFixed(0)}% لمدة ${promo.duration} يوم` };

    } catch (error) {
        console.error("Redeem error:", error);
        return { error: "حدث خطأ أثناء تفعيل الكود" };
    }
}
