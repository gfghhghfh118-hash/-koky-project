"use client";

import { useSession } from "next-auth/react";

export default function DebugPage() {
    const { data: session } = useSession();

    if (!session) return <div className="p-10 text-xl">You are NOT logged in.</div>;

    return (
        <div className="p-10 space-y-4 font-mono text-lg">
            <h1 className="text-2xl font-bold text-blue-600">🕵️‍♂️ User Diagnostic</h1>
            <div className="border p-4 rounded bg-gray-100">
                <p><strong>Email:</strong> {session.user?.email}</p>
                <p><strong>ID:</strong> {session.user?.id}</p>
                <p><strong>Role (Session):</strong> {session.user?.role || "USER (Default)"}</p>
            </div>

            <p className="text-sm text-gray-500">
                If Role is "USER", go to <a href="/setup-admin" className="text-blue-500 underline">/setup-admin</a> again.
            </p>
        </div>
    );
}
