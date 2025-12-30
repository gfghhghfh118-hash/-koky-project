
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
    console.log("Checking database users...");
    const users = await db.user.findMany();
    console.log(`Found ${users.length} users:`);
    users.forEach((u) => {
        console.log(`- User: ${u.username} | Email: ${u.email} | Role: ${u.role} | ID: ${u.id}`);
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await db.$disconnect();
    });
