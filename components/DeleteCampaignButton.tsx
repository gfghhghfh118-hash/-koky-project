"use client";

import { useState } from "react";
import { deleteCampaign } from "@/actions/advertise";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteCampaignButton({ taskId, title }: { taskId: string, title?: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        const confirmed = window.confirm(`Are you sure you want to delete campaign "${title || 'this campaign'}"?\n\nAny remaining budget will be refunded to your AD BALANCE.`);
        if (!confirmed) return;

        setIsDeleting(true);
        try {
            const result = await deleteCampaign(taskId);
            if (result.error) {
                alert(result.error);
            } else {
                // Success - the server action revalidates path, so UI should update.
                // We could show a toast here.
            }
        } catch (e) {
            alert("Failed to delete");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2.5 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-all border border-red-100 flex items-center justify-center disabled:opacity-50"
            title="Delete Campaign & Refund"
        >
            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
        </button>
    );
}
