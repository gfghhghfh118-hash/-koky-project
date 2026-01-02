"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const EXCHANGE_RATE = 50; // 1 USD = 50 EGP

export async function requestWithdrawal(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Not authenticated" };

    const userId = session.user.id;
    let amount = parseFloat(formData.get("amount") as string);
    const method = formData.get("method") as string;
    const wallet = formData.get("wallet") as string;
    const isEGP = formData.get("isEGP") === "true"; // Check if user input was in EGP

    // If EGP, convert amount to USD for validation and deduction
    const amountInUSD = isEGP ? amount / EXCHANGE_RATE : amount;

    // Minimum USD limit (e.g. 0.2 USD = 10 EGP)
    if (!amountInUSD || amountInUSD < 0.2) return { error: `Minimum withdrawal is $0.20 (approx. ${0.2 * EXCHANGE_RATE} EGP)` };
    if (!wallet || wallet.length < 10) return { error: "Invalid wallet number" };
    if (!["VODAFONE_CASH", "ETISALAT", "INSTAPAY", "FAUCETPAY_USDT", "USDT_BEP20"].includes(method)) return { error: "Invalid method" };

    try {
        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user || user.balance < amountInUSD) return { error: "Insufficient funds" };

        // Transactional consistency: Deduct balance AND create log
        await db.$transaction(async (tx) => {

            // 1. Deduct Balance (Always in USD)
            await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: amountInUSD } }
            });

            // 2. Create Transaction Log
            await tx.transaction.create({
                data: {
                    userId,
                    amount: amountInUSD, // Store normalized USD amount
                    type: "WITHDRAWAL",
                    method,
                    wallet: `${wallet} ${isEGP ? `(Requested: ${amount} EGP)` : ""}`,
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
    let amount = parseFloat(formData.get("amount") as string);
    const method = formData.get("method") as string;
    const transactionId = formData.get("transactionId") as string;
    const senderIdentifier = formData.get("senderIdentifier") as string;
    const isEGP = formData.get("isEGP") === "true";

    // For Deposit, we trust the input for creating the PENDING request. Admin verifies actual amount received.
    const amountInUSD = isEGP ? amount / EXCHANGE_RATE : amount;

    // Auto-generate a temporary Transaction ID since user is not providing reference number
    // This allows the admin to edit/add real TXID later if needed, or just use it as a system ID.
    const internalTxId = `DEP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    if (!amountInUSD || amountInUSD < 1) return { error: `Minimum deposit is $1.00 (approx. ${1 * EXCHANGE_RATE} EGP)` };
    // transactionId validation removed
    if (!senderIdentifier || senderIdentifier.length < 3) return { error: "Please provide your Sender Number or Wallet Address" };
    if (!["VODAFONE_CASH", "ETISALAT", "INSTAPAY", "BINANCE_SMART_CHAIN"].includes(method)) return { error: "Invalid method" };

    try {
        await db.transaction.create({
            data: {
                userId,
                amount: amountInUSD,
                type: "DEPOSIT",
                method,
                status: "PENDING",
                wallet: "SYSTEM_WALLET",
                senderWallet: senderIdentifier,
                txId: internalTxId,            // Use generated ID
            }
        });

        revalidatePath("/dashboard");
        return { success: "Deposit request submitted! Waiting for manager approval." };
    } catch (error) {
        console.error("Deposit request error:", error);
        return { error: "Failed to submit deposit request" };
    }
}

export async function addTestBalance() {
    try {
        const session = await auth();
        if (!session?.user?.email) return { error: "Unauthorized" };

        const user = await db.user.findUnique({ where: { email: session.user.email } });
        if (!user) return { error: "User not found" };

        await db.user.update({
            where: { id: user.id },
            data: {
                balance: { increment: 50 },
                adBalance: { increment: 50 },
            }
        });

        revalidatePath("/dashboard");
        return { success: "Added $50.00 to balances!" };
    } catch (error) {
        return { error: "Internal Server Error" };
    }
}
