
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findFirst();
    if (user) {
        console.log(`Referral Link: http://localhost:3000/register?ref=${user.username || user.id}`);
    } else {
        console.log("No user found.");
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
