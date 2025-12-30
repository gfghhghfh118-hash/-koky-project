
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    const email = "testadmin@example.com";
    // Consistent hash for "password123"
    const password = await bcrypt.hash("password123", 10);

    // Upsert: Create if not exists, update if exists
    const user = await prisma.user.upsert({
        where: { email },
        update: {
            role: "ADMIN",
            password: password
        },
        create: {
            email,
            username: "TestAdmin",
            password: password,
            role: "ADMIN",
            balance: 1000,
            adBalance: 1000,
        }
    });

    console.log(`✅ Test Admin Ready: ${user.email} / password123`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
