export default function BlockedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white p-4">
            <div className="max-w-md text-center space-y-6">
                <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto border border-red-500/20">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="4.93" x2="19.07" y1="4.93" y2="19.07" />
                    </svg>
                </div>
                <h1 className="text-3xl font-black">Access Denied</h1>
                <p className="text-slate-400">
                    Our services are not available in your region.
                </p>
                <div className="pt-8 text-xs text-slate-600 font-mono">
                    ERROR: 403_FORBIDDEN_REGION
                </div>
            </div>
        </div>
    );
}
