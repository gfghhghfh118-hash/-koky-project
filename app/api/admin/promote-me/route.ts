
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get("secret");

    // Hardcoded secret for one-time use
    if (secret !== "KOKY_MASTER_KEY_2026") {
        return NextResponse.json({ error: "Invalid Secret" }, { status: 401 });
    }

    const email = "gfghhghfh118@gmail.com";

    try {
        const user = await db.user.update({
            where: { email },
            data: { role: "ADMIN" }
        });
        return NextResponse.json({ success: true, message: `User ${email} is now ADMIN`, user });
    } catch (error) {
        return NextResponse.json({ error: "User not found or DB error", details: error }, { status: 500 });
    }
}
