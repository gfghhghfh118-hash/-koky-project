"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Advertise Page Error Boundary caught:", error);
    }, [error]);

    return (
        <div className="p-6 bg-red-50 rounded-xl border border-red-200">
            <h2 className="text-xl font-bold text-red-700 mb-2">Something went wrong!</h2>
            <p className="text-red-600 mb-4 text-sm font-mono bg-white p-2 rounded border border-red-100 overflow-auto">
                {error.message || "Unknown error"}
            </p>
            <button
                onClick={() => reset()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
                Try again
            </button>
        </div>
    );
}
