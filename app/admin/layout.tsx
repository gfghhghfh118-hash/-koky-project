import { AdminSidebar } from "@/components/AdminSidebar";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session || !session.user || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    return (
        <div className="flex h-screen overflow-hidden bg-background">
            <AdminSidebar />
            <main className="flex-1 overflow-y-auto p-6">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
