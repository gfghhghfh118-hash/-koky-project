import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

async function watch() {
    console.log("Watching for Support Ticket activity... (Ctrl+C to stop)");

    // Store localized snapshots
    let lastState = new Map();

    // Initial fetch
    const initial = await db.supportTicket.findMany();
    initial.forEach(t => lastState.set(t.id, JSON.stringify(t)));

    console.log(`Initial tickets: ${initial.length}`);

    while (true) {
        const current = await db.supportTicket.findMany();

        // Check for new or changed
        current.forEach(t => {
            const old = lastState.get(t.id);
            const now = JSON.stringify(t);

            if (!old) {
                console.log("\n[NEW TICKET]");
                console.log(JSON.stringify(t, null, 2));
                lastState.set(t.id, now);
            } else if (old !== now) {
                console.log("\n[TICKET UPDATED]");
                console.log(JSON.stringify(t, null, 2));
                lastState.set(t.id, now);
            }
        });

        await new Promise(r => setTimeout(r, 2000));
    }
}

watch().catch(console.error);
