"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function requestWithdrawal(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const userId = session.user.id;
    const amount = parseFloat(formData.get("amount") as string);
    const method = formData.get("method") as string;
    const wallet = formData.get("wallet") as string;

    if (!amount || amount < 0.2) return { error: "Minimum withdrawal is $0.20 (approx. 10 EGP)" };
    if (!wallet || wallet.length < 10) return { error: "Invalid wallet number" };
    if (!["VODAFONE_CASH", "ETISALAT", "INSTAPAY"].includes(method)) return { error: "Invalid method" };

    try {
        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user || user.balance < amount) return { error: "Insufficient funds" };

        // Transactional consistency: Deduct balance AND create log
        await db.$transaction(async (tx) => {

            // 1. Deduct Balance
            await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: amount } }
            });

            // 2. Create Transaction Log
            await tx.transaction.create({
                data: {
                    userId,
                    amount,
                    type: "WITHDRAWAL",
                    method,
                    wallet,
                    status: "PENDING"
                }
            });
        });

        revalidatePath("/dashboard");
        return { success: "Withdrawal requested successfully!" };

    } catch (error) {
        console.error("Withdrawal error:", error);
        return { error: "Failed to process withdrawal" };
    }
}

export async function exchangeToAdBalance(amount: number) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };
    const userId = session.user.id;

    if (amount < 0.1) return { error: "Minimum transfer is $0.10" };

    try {
        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user || user.balance < amount) return { error: "Insufficient main balance." };

        const fee = amount * 0.01;
        const netAmount = amount - fee;

        await db.$transaction(async (tx) => {
            // Deduct full amount from Main
            await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: amount } }
            });
            // Add net amount to Ad Balance
            await tx.user.update({
                where: { id: userId },
                data: { adBalance: { increment: netAmount } }
            });
            // Log Profit for Admin (The 1% fee)
            await tx.adminProfitLog.create({
                data: {
                    source: "TRANSFER_FEE",
                    amount: fee,
                    description: `1% fee on transfer of $${amount} to Ad Balance`
                }
            });
        });

        revalidatePath("/dashboard");
        revalidatePath("/dashboard/advertise");
        return { success: `Transferred $${netAmount.toFixed(4)} to Ad Balance (Fee: $${fee.toFixed(4)})` };
    } catch (error) {
        return { error: "Transfer failed" };
    }
}

export async function requestDeposit(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const userId = session.user.id;
    const amount = parseFloat(formData.get("amount") as string);
    const method = formData.get("method") as string;
    const transactionId = formData.get("transactionId") as string;

    if (!amount || amount < 1) return { error: "Minimum deposit is $1.00 (approx. 50 EGP)" };
    if (!transactionId || transactionId.length < 5) return { error: "Please provide a valid Transaction ID or Sender Number" };
    if (!["VODAFONE_CASH", "ETISALAT", "INSTAPAY"].includes(method)) return { error: "Invalid method" };

    try {
        await db.transaction.create({
            data: {
                userId,
                amount,
                type: "DEPOSIT",
                method,
                status: "PENDING",
                wallet: transactionId // Store TXID in the wallet field for now
            }
        });

        revalidatePath("/dashboard");
        return { success: "Deposit request submitted! Waiting for manager approval." };
    } catch (error) {
        console.error("Deposit request error:", error);
        return { error: "Failed to submit deposit request" };
    }
}
