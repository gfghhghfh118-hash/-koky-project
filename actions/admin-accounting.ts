"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";

export async function getAccountingStats() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    const users = await db.user.findMany({
        select: { balance: true }
    });

    const totalUserLiabilities = users.reduce((acc, user) => acc + user.balance, 0);

    const profitLogs = await db.adminProfitLog.findMany();
    const totalNetProfit = profitLogs.reduce((acc, log) => acc + log.amount, 0);

    const realAdRevenue = totalUserLiabilities + totalNetProfit;

    return {
        totalUserLiabilities,
        totalNetProfit,
        realAdRevenue
    };
}

export async function getRecentProfitLogs() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        throw new Error("Unauthorized");
    }

    return await db.adminProfitLog.findMany({
        orderBy: { timestamp: "desc" },
        take: 20
    });
}
