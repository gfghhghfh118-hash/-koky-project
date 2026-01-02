import { promoteToAdmin } from "@/actions/admin-setup";
import { auth } from "@/auth";

export const dynamic = "force-dynamic";

export default async function MagicLinkPage({
    searchParams,
}: {
    searchParams: Promise<{ secret?: string }>;
}) {
    const { secret } = await searchParams; // Next.js 15+ await searchParams
    const key = secret || "";
    const session = await auth();

    let message = "";
    let isSuccess = false;

    if (!session?.user?.email) {
        message = "You are NOT logged in. Please log in first.";
    } else if (key) {
        // Only attempt promotion if logged in and key is present
        const res = await promoteToAdmin(key);
        if (res.success) {
            message = "Congratulations! You are now an Admin.";
            isSuccess = true;
        } else {
            message = `Error: ${res.error}`;
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
            <div className="max-w-md w-full glass-card p-8 rounded-2xl text-center border border-white/10">
                <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    Magic Admin Link 🪄
                </h1>

                {/* Status Indicator */}
                <div className="mb-6 p-2 rounded bg-white/5 text-sm text-gray-400">
                    Status: {session?.user?.email ? <span className="text-green-400">Logged in as {session.user.email}</span> : <span className="text-red-400">Not Logged In</span>}
                </div>

                {message ? (
                    <div className={`p-4 rounded-xl mb-6 ${isSuccess ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                        <p className="font-bold text-lg">{message}</p>
                        {isSuccess && (
                            <a href="/admin" className="block mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-all">
                                Go to Admin Panel
                            </a>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-gray-400">
                            Enter the secret key in the URL to upgrade your account.
                        </p>
                        <div className="p-4 bg-zinc-900/50 rounded-lg text-sm font-mono break-all border border-white/5">
                            /magic?secret=YOUR_SECRET_KEY
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
