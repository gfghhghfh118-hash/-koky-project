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
        console.error("Global Error Caught:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
            <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-8 max-w-2xl w-full text-center">
                <h2 className="text-3xl font-black mb-4 text-red-500">💥 Application Error Detected!</h2>

                <p className="text-slate-300 mb-6 font-medium">
                    Please take a screenshot of this error and send it to your developer.
                </p>

                <div className="bg-black/50 p-4 rounded-xl text-left overflow-auto max-h-64 mb-6 border border-slate-700 font-mono text-xs text-red-300">
                    <p className="font-bold text-base mb-2">{error.name}: {error.message}</p>
                    <pre className="whitespace-pre-wrap opacity-70">{error.stack}</pre>
                    {error.digest && <p className="mt-2 text-slate-500">Digest: {error.digest}</p>}
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-all"
                    >
                        Try Again
                    </button>
                    <a
                        href="/dashboard"
                        className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-lg font-bold transition-all"
                    >
                        Go to Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
