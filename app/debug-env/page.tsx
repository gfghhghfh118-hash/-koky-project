
export const dynamic = 'force-dynamic';

export default function DebugEnvPage() {
    const googleId = process.env.AUTH_GOOGLE_ID;
    const googleSecret = process.env.AUTH_GOOGLE_SECRET;
    const nextAuthUrl = process.env.NEXTAUTH_URL;
    const authSecret = process.env.AUTH_SECRET;

    return (
        <div className="p-8 font-mono space-y-4 bg-slate-950 text-emerald-400 min-h-screen">
            <h1 className="text-2xl font-bold text-white mb-6">Environment Debugger 🕵️‍♂️</h1>

            <div className="border border-emerald-500/30 p-4 rounded-lg bg-slate-900/50">
                <h2 className="text-white font-bold mb-2">Google Credentials</h2>
                <div className="grid grid-cols-[200px_1fr] gap-2 items-center">
                    <span className="text-slate-400">AUTH_GOOGLE_ID:</span>
                    <span>
                        {googleId
                            ? `✅ Loaded (${googleId.substring(0, 15)}...${googleId.slice(-5)})`
                            : "❌ UNDEFINED"}
                    </span>

                    <span className="text-slate-400">AUTH_GOOGLE_SECRET:</span>
                    <span>
                        {googleSecret
                            ? `✅ Loaded (Length: ${googleSecret.length})`
                            : "❌ UNDEFINED"}
                    </span>
                </div>
            </div>

            <div className="border border-blue-500/30 p-4 rounded-lg bg-slate-900/50">
                <h2 className="text-white font-bold mb-2">System Config</h2>
                <div className="grid grid-cols-[200px_1fr] gap-2 items-center">
                    <span className="text-slate-400">NEXTAUTH_URL:</span>
                    <span>{nextAuthUrl || "❌ UNDEFINED (Vercel automatic?)"}</span>

                    <span className="text-slate-400">AUTH_SECRET:</span>
                    <span>{authSecret ? "✅ Defined" : "❌ UNDEFINED"}</span>
                </div>
            </div>

            <div className="text-xs text-slate-500 mt-8">
                Generated at: {new Date().toISOString()}
            </div>
        </div>
    );
}
