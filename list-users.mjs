import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function run() {
    try {
        const users = await db.user.findMany();
        console.log("Users in DB:", JSON.stringify(users, null, 2));
    } catch (e) {
        console.error(e);
    } finally {
        await db.$disconnect();
    }
}
run();
