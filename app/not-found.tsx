import Link from "next/link";
import { CopyX } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-50 text-slate-900">
            <div className="text-center space-y-4 p-8">
                <div className="mx-auto w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
                    <CopyX size={32} />
                </div>
                <h2 className="text-3xl font-black tracking-tight">404 - Page Not Found</h2>
                <p className="text-slate-500 font-medium max-w-md mx-auto">
                    The page you are looking for does not exist or has been moved.
                </p>
                <div className="pt-4">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
                    >
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
