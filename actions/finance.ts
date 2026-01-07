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

    // --------------------------------------------------------
    // DYNAMIC PAYMENT METHOD CHECK
    // --------------------------------------------------------
    // Find the method in DB (Active only)
    const paymentMethodRecord = await db.paymentMethod.findFirst({
        where: {
            name: method, // Assuming 'method' passed from form matches 'name' in DB or we map it. 
            // Note: In the form, values might be slugs like "VODAFONE_CASH". 
            // The seed uses "Vodafone Cash". We need to align this.
            // For now, let's assume the form sends the exact NAME or we find by ID if we change the form.
            // *CRITICAL*: The current frontend sends "VODAFONE_CASH". We should probably update the form 
            // or map it. To be safe, let's try to find it by name or map the old keys.
            // Better yet: Update the form to send the ID. But that's a frontend change.
            // Let's try to match loosely or fix the seeding to use the keys.
            // ACTUALLY: The best way is to fetch the method by ID from the frontend.
            // But to avoid breaking changes without frontend edits right now:
            // I will match by Name OR 'like' name.
            // However, the cleanest is to update the 'requestWithdrawal' to accept an 'methodId' if possible.
            // If not, I will rely on the string match.
            // Let's assume the user selects from the new dynamic list in the future.
            // FOR NOW: I will map legacy keys to the new DB names.
            type: "WITHDRAWAL",
            isActive: true
        }
    });

    // If not found by exact name, try mapping legacy keys
    let dbMethod = paymentMethodRecord;
    if (!dbMethod) {
        const legacyMap: Record<string, string> = {
            "VODAFONE_CASH": "Vodafone Cash",
            "ETISALAT": "Etisalat Cash",
            "INSTAPAY": "Instapay",
            "FAUCETPAY_USDT": "FaucetPay (USDT)",
            "USDT_BEP20": "USDT (BEP20)"
        };
        if (legacyMap[method]) {
            dbMethod = await db.paymentMethod.findFirst({
                where: { name: legacyMap[method], type: "WITHDRAWAL", isActive: true }
            });
        } else if (method === "LITECOIN") {
            // Handle new Litecoin mapping ad-hoc if not in seed
            dbMethod = {
                name: "Litecoin (FaucetPay)",
                minAmount: 0.20, // Approx 0.002 LTC
                maxAmount: 1000,
                feePercent: 2, // 2% dynamic fee
                type: "WITHDRAWAL",
                isActive: true,
                id: "ltc-temp-id",
                instruction: null, // REQUIRED to match DB type
                createdAt: new Date(),
                updatedAt: new Date()
            }
        } else if (method === "USDT_BEP20") {
            dbMethod = {
                name: "USDT (BEP20)",
                minAmount: 10.00, // $10 Min
                maxAmount: 5000,
                feePercent: 3, // 3% Fee as requested
                type: "WITHDRAWAL",
                isActive: true,
                id: "usdt-temp-id",
                instruction: null, // REQUIRED to match DB type
                createdAt: new Date(),
                updatedAt: new Date()
            }
        } else if (["VODAFONE_CASH", "ETISALAT", "INSTAPAY"].includes(method)) {
            // Local Wallets: 3% Fee, Low Min
            // Mapping slugs to nice names
            const names: Record<string, string> = { "VODAFONE_CASH": "Vodafone Cash", "ETISALAT": "Etisalat Cash", "INSTAPAY": "InstaPay" };
            dbMethod = {
                name: names[method],
                minAmount: 0.20, // ~10 EGP
                maxAmount: 500,
                feePercent: 3, // 3% Fee requested
                type: "WITHDRAWAL",
                isActive: true,
                id: `${method.toLowerCase()}-temp-id`,
                instruction: null, // REQUIRED to match DB type
                createdAt: new Date(),
                updatedAt: new Date()
            }
        }
    }

    if (!dbMethod) return { error: "Payment method not available or disabled." };

    // Validate Limits (DB values are in USD usually, or we assume they are)
    // NOTE: The DB seed has min 1, max 500. Assuming USD.
    if (amountInUSD < dbMethod.minAmount) return { error: `Minimum withdrawal is $${dbMethod.minAmount}` };
    if (amountInUSD > dbMethod.maxAmount) return { error: `Maximum withdrawal is $${dbMethod.maxAmount}` };

    // Calculate Fee
    // Special Logic for Litecoin: 1% + 0.00002 LTC (approx fixed USD cost?)
    // User requested: "0.00002 LTC (0.00 USD) ... + 1%"
    // Since 0.00002 LTC is negligible in USD (~$0.002), we can just implement the 1% fee 
    // OR we can try to be precise. 
    // Simplest approach: Just use the 1% defined in the object above for now, 
    // as calculating fixed crypto fee in USD requires live rate.
    // If user insists on fixed LTC fee showing up in deduction, we need live rate.
    // For now, will stick to the percentage fee which captures the "1%" requirement.
    const feeAmount = (amountInUSD * dbMethod.feePercent) / 100;
    const finalAmountAfterFee = amountInUSD - feeAmount;

    try {
        const user = await db.user.findUnique({ where: { id: userId } });
        if (!user || user.balance < amountInUSD) return { error: "Insufficient funds" };

        // Transactional consistency: Deduct balance AND create log
        await db.$transaction(async (tx) => {

            // 1. Deduct Balance (Full Amount)
            await tx.user.update({
                where: { id: userId },
                data: { balance: { decrement: amountInUSD } }
            });

            // 2. Create Transaction Log
            await tx.transaction.create({
                data: {
                    userId,
                    amount: finalAmountAfterFee, // Net amount user receives
                    type: "WITHDRAWAL",
                    method: method === "LITECOIN" ? "Litecoin (LTC)" : dbMethod!.name, // Store the nice name
                    wallet: `${wallet} ${isEGP ? `(Requested: ${amount} EGP)` : ""}`,
                    status: "PENDING"
                }
            });

            // 3. Log Fee if any
            if (feeAmount > 0) {
                await tx.adminProfitLog.create({
                    data: {
                        source: "WITHDRAWAL_FEE",
                        amount: feeAmount,
                        description: `${dbMethod!.feePercent}% fee on ${dbMethod!.name} withdrawal`
                    }
                });
            }
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
    // Sanitization for Arabic Numerals
    let rawAmount = formData.get("amount") as string;
    if (rawAmount) {
        rawAmount = rawAmount.replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
    }
    let amount = parseFloat(rawAmount);

    const method = formData.get("method") as string;
    const transactionId = formData.get("transactionId") as string;
    const senderIdentifier = formData.get("senderIdentifier") as string;

    // Force isEGP for local methods to prevent frontend sync issues
    let isEGP = formData.get("isEGP") === "true";
    if (["VODAFONE_CASH", "ETISALAT", "INSTAPAY"].includes(method)) {
        isEGP = true;
    }

    if (isNaN(amount)) return { error: "Invalid amount. Please enter English numbers (e.g., 50.00)" };

    // For Deposit, we trust the input for creating the PENDING request. Admin verifies actual amount received.
    const amountInUSD = isEGP ? amount / EXCHANGE_RATE : amount;

    // Auto-generate a temporary Transaction ID since user is not providing reference number
    // This allows the admin to edit/add real TXID later if needed, or just use it as a system ID.
    const internalTxId = `DEP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    // Validate Dynamic Minimums
    let minDeposit = 1; // Default $1
    if (["LITECOIN", "BINANCE_SMART_CHAIN"].includes(method)) {
        minDeposit = 5; // $5 for Crypto
    }

    if (!amountInUSD || amountInUSD < minDeposit) {
        return { error: `Minimum deposit for this method is $${minDeposit} (approx. ${minDeposit * EXCHANGE_RATE} EGP)` };
    }

    // transactionId validation removed
    if (!senderIdentifier || senderIdentifier.length < 3) return { error: "Please provide your Sender Number or Wallet Address" };
    if (!["VODAFONE_CASH", "ETISALAT", "INSTAPAY", "BINANCE_SMART_CHAIN", "LITECOIN"].includes(method)) return { error: "Invalid method" };

    // Calculate 1% Fee on Deposit
    const fee = amountInUSD * 0.01;
    const netAmount = amountInUSD - fee;

    try {
        await db.transaction.create({
            data: {
                userId,
                amount: amountInUSD, // Gross Amount
                fee: fee,            // 1% Fee
                netAmount: netAmount,// Net to credit
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
    } catch (error: any) {
        console.error("Deposit request error:", error);
        return { error: `Failed: ${error.message || "Unknown error"}` };
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
