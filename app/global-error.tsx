"use client";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className="bg-slate-900 text-white flex flex-col items-center justify-center min-h-screen p-4">
                <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-8 max-w-2xl w-full text-center">
                    <h2 className="text-3xl font-black mb-4 text-red-500">💥 Critical System Error</h2>
                    <p className="text-slate-300 mb-6 font-medium">
                        A critical error occurred in the application layout.
                    </p>
                    <div className="bg-black/50 p-4 rounded-xl text-left overflow-auto max-h-64 mb-6 border border-slate-700 font-mono text-xs text-red-300">
                        <p className="font-bold text-base mb-2">{error.name}: {error.message}</p>
                        <pre className="whitespace-pre-wrap opacity-70">{error.stack}</pre>
                        {error.digest && <p className="mt-2 text-slate-500">Digest: {error.digest}</p>}
                    </div>
                    <button onClick={() => reset()} className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold">Try Again</button>
                </div>
            </body>
        </html>
    );
}
