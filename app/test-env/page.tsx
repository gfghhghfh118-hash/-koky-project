export const dynamic = 'force-dynamic';

export default function TestEnvPage() {
    return (
        <div className="p-8 font-mono">
            <h1 className="text-2xl font-bold mb-4">Environment Diagnostics</h1>

            <div className="space-y-2 mb-8">
                <div>
                    <strong>GOOGLE_CLIENT_ID: </strong>
                    <span className={process.env.GOOGLE_CLIENT_ID ? "text-green-600" : "text-red-600"}>
                        {process.env.GOOGLE_CLIENT_ID ? "✅ Loaded" : "❌ Missing"}
                    </span>
                </div>
                <div>
                    <strong>GOOGLE_CLIENT_SECRET: </strong>
                    <span className={process.env.GOOGLE_CLIENT_SECRET ? "text-green-600" : "text-red-600"}>
                        {process.env.GOOGLE_CLIENT_SECRET ? "✅ Loaded" : "❌ Missing"}
                    </span>
                </div>
                <div>
                    <strong>AUTH_SECRET: </strong>
                    <span className={process.env.AUTH_SECRET ? "text-green-600" : "text-red-600"}>
                        {process.env.AUTH_SECRET ? "✅ Loaded" : "❌ Missing"}
                    </span>
                </div>
            </div>

            <div className="border p-4 rounded bg-gray-50">
                <h2 className="font-bold mb-2">Manual Sign-In Test</h2>
                <form action="/api/auth/signin/google" method="POST">
                    <input type="hidden" name="callbackUrl" value="/dashboard" />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Force Server-Side Login (POST)
                    </button>
                </form>
            </div>
        </div>
    );
}
