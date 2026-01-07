import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
async function run() {
    try {
        await db.user.update({
            where: { username: "gfghhghfh118@gmail.com" },
            data: { email: "gfghhghfh118@gmail.com" }
        });
        console.log("Updated user gfghhghfh118@gmail.com with email!");
    } catch (e) {
        console.error(e);
    } finally {
        await db.$disconnect();
    }
}
run();
