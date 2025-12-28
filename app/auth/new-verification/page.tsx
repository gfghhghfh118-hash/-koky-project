"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
// We need a server action to verify the token, creating it locally for now in same file for simplicity or importing
// Actually, better to have a separate action.
import { newVerification } from "@/actions/new-verification";
import Link from "next/link";

export default function NewVerificationPage() {
    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const onSubmit = useCallback(() => {
        if (success || error) return;
        if (!token) {
            setError("Missing token!");
            return;
        }

        newVerification(token).then((data) => {
            setSuccess(data.success);
            setError(data.error);
        }).catch(() => {
            setError("Something went wrong!");
        });
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
    }, [onSubmit]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
                <h1 className="text-2xl font-bold mb-4">Verifying your email</h1>

                {!success && !error && (
                    <div className="animate-pulse text-slate-500">Loading...</div>
                )}

                {success && (
                    <div className="p-3 bg-green-100 text-green-700 rounded mb-4">
                        {success}
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-100 text-red-700 rounded mb-4">
                        {error}
                    </div>
                )}

                <Link href="/login" className="text-sm underline text-slate-600 hover:text-slate-900">
                    Back to login
                </Link>
            </div>
        </div>
    );
}
