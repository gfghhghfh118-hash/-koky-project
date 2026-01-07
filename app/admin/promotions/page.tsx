import { db } from "@/lib/db";
import PromoRequestList from "./PromoRequestList";

export default async function AdminPromotionsPage() {
    const requests = await db.promotionRequest.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: true }
    });

    return (
        <div className="p-6 text-right" dir="rtl">
            <h1 className="text-2xl font-bold mb-6">إدارة طلبات الترويج (فيديو)</h1>
            <PromoRequestList initialRequests={requests} />
        </div>
    );
}
