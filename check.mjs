import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function check() {
    const t = await db.supportTicket.findMany();
    console.log("Current Tickets:", JSON.stringify(t, null, 2));
    await db.$disconnect();
}
check();
