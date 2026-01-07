"use client";

import { useState } from "react";
import { deleteBanner } from "@/actions/banners";
import { Trash2, Loader2 } from "lucide-react";

export default function DeleteBannerButton({ bannerId }: { bannerId: string }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this banner?\n\nUnused budget will be refunded to your Ad Balance.");
        if (!confirmed) return;

        setIsDeleting(true);
        try {
            const result = await deleteBanner(bannerId);
            if (result.error) {
                alert(result.error);
            } else {
                // Success
            }
        } catch (e) {
            alert("Failed to delete banner");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition-all border border-red-100 flex items-center justify-center disabled:opacity-50"
            title="Delete Banner & Refund"
        >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
    );
}
