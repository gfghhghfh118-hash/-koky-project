import { UserSidebar } from "@/components/UserSidebar";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export default async function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    let balance = 0;
    let adBalance = 0;

    if (session?.user?.id) {
        const user = await db.user.findUnique({ where: { id: session.user.id } });
        balance = user?.balance || 0;
        adBalance = user?.adBalance || 0;
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <UserSidebar balance={balance} adBalance={adBalance} />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-muted/30">
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
