"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function approveFinancialRequest(requestId: string) {
    const session = await auth();
    // In a real app, check if user is admin: if (session?.user?.role !== "ADMIN") ...
    if (!session?.user?.id) return { error: "Not authenticated" };

    try {
        const result = await db.$transaction(async (tx) => {
            const request = await tx.transaction.findUnique({
                where: { id: requestId },
                include: { user: true }
            });

            if (!request) throw new Error("Request not found");
            if (request.status !== "PENDING") throw new Error("Request already processed");

            // Update user balance if it was a DEPOSIT
            if (request.type === "DEPOSIT") {
                await tx.user.update({
                    where: { id: request.userId },
                    data: { balance: { increment: request.amount } }
                });
            }

            // Mark request as APPROVED
            await tx.transaction.update({
                where: { id: requestId },
                data: { status: "APPROVED" }
            });

            return { success: true };
        });

        revalidatePath("/admin/financials");
        return { success: `Request approved successfully.` };
    } catch (error: any) {
        console.error("Approval error:", error);
        return { error: error.message || "Failed to approve request" };
    }
}

export async function rejectFinancialRequest(requestId: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    try {
        const result = await db.$transaction(async (tx) => {
            const request = await tx.transaction.findUnique({
                where: { id: requestId }
            });

            if (!request) throw new Error("Request not found");
            if (request.status !== "PENDING") throw new Error("Request already processed");

            // If it was a WITHDRAWAL, we need to REFUND the user's balance because it was deducted at request
            if (request.type === "WITHDRAWAL") {
                await tx.user.update({
                    where: { id: request.userId },
                    data: { balance: { increment: request.amount } }
                });
            }

            // Mark request as REJECTED
            await tx.transaction.update({
                where: { id: requestId },
                data: { status: "REJECTED" }
            });

            return { success: true };
        });

        revalidatePath("/admin/financials");
        return { success: "Request rejected successfully." };
    } catch (error: any) {
        console.error("Rejection error:", error);
        return { error: error.message || "Failed to reject request" };
    }
}

export async function getPendingRequests() {
    return await db.transaction.findMany({
        where: { status: "PENDING" },
        include: { user: { select: { username: true, email: true } } },
        orderBy: { timestamp: "desc" }
    });
}
