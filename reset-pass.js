const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const username = 'gfghhghfh118@gmail.com'
    const newPassword = 'Mohamedalfy2016@'
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const updatedUser = await prisma.user.update({
        where: { username },
        data: {
            password: hashedPassword,
            role: 'ADMIN' // Leveling them up to admin so they can see the admin panel too
        }
    })
    console.log('User password reset and role set to ADMIN:', updatedUser.username)

    // Also create a simple 'admin' user just in case
    const adminExists = await prisma.user.findUnique({ where: { username: 'admin' } })
    if (!adminExists) {
        const adminHashed = await bcrypt.hash('admin123', 10)
        await prisma.user.create({
            data: {
                username: 'admin',
                password: adminHashed,
                role: 'ADMIN'
            }
        })
        console.log('Created fallback admin user: admin / admin123')
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect()
    })
