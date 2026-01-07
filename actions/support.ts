"use server";

import { db } from "@/lib/db";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createTicket(formData: FormData) {
    console.log("--- START CREATE TICKET ACTION ---");
    const session = await auth();
    const userId = session?.user?.id || null;

    const subject = formData.get("subject") as string;
    const message = formData.get("message") as string;
    const email = formData.get("email") as string;
    const whatsapp = formData.get("whatsapp") as string;

    console.log("Action Input:", { subject, message, email, whatsapp, userId });

    if (!subject || !message || !email) {
        console.log("Action Error: Missing required fields");
        return { error: "Please fill in all required fields." };
    }

    try {
        const newTicket = await db.supportTicket.create({
            data: {
                userId,
                subject,
                message,
                email,
                whatsapp,
                status: "OPEN"
            }
        });

        console.log("Action Success: Ticket created ID =", newTicket.id);

        revalidatePath("/admin/tickets");
        revalidatePath("/dashboard/support");
        return { success: "Ticket created! Our team will contact you soon." };
    } catch (error) {
        console.error("Support Action Database Error:", error);
        return { error: "Failed to send message." };
    }
}

export async function replyTicket(ticketId: string, replyMessage: string) {
    console.log("--- START REPLY TICKET ACTION (PRISMA) ---");
    console.log("Input:", { ticketId, replyMessage });

    try {
        await db.supportTicket.update({
            where: { id: ticketId },
            data: {
                adminReply: replyMessage,
                status: "CLOSED",
                repliedAt: new Date()
            }
        });

        console.log("Reply Success: Prisma update executed for ID =", ticketId);

        revalidatePath("/admin/tickets");
        revalidatePath("/dashboard/support");
        return { success: "Reply sent successfully!" };
    } catch (error: any) {
        console.error("Reply Action Prisma Error:", error);
        return { error: `Failed to send reply: ${error.message || "Database error"}` };
    }
}

export async function getUserTickets() {
    console.log("--- START GET USER TICKETS ---");
    const session = await auth();
    console.log("Session User:", session?.user);

    if (!session || !session.user) {
        console.log("No session found, returning empty array");
        return [];
    }

    try {
        // Construct a robust query
        const conditions: any[] = [];

        if (session.user.id) {
            conditions.push({ userId: session.user.id });
        }

        if (session.user.email) {
            conditions.push({
                email: { equals: session.user.email, mode: 'insensitive' }
            });
        }

        // If we have no identifiers, return empty
        if (conditions.length === 0) return [];

        const query = {
            where: {
                OR: conditions
            },
            orderBy: { createdAt: "desc" } as any
        };
        console.log("Ticket Query:", JSON.stringify(query, null, 2));

        const tickets = await db.supportTicket.findMany(query);
        console.log(`Found ${tickets.length} tickets`);
        return tickets;
    } catch (error) {
        console.error("Fetch Tickets Action Error:", error);
        return [];
    }
}

export async function getSessionInfo() {
    const session = await auth();
    console.log("Debug: Fetching Session info for UI:", session?.user);
    return session;
}
