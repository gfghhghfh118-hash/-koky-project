import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import WithdrawForm from "./WithdrawForm";

export default async function WithdrawServerPage() {
    const session = await auth();
    if (!session || !session.user) {
        redirect("/login");
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { balance: true }
    });

    if (!user) {
        redirect("/login");
    }

    return <WithdrawForm userBalance={user.balance} />;
}
