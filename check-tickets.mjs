import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function main() {
    const tickets = await db.supportTicket.findMany({
        orderBy: { createdAt: 'desc' }
    });
    console.log(JSON.stringify(tickets, null, 2));
    await db.$disconnect();
}

main().catch(console.error);
