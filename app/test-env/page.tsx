"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addTestBalance } from "@/actions/finance"; // We will create this action

export default function TestEnvPage() {
    const { data: session } = useSession();
    const [status, setStatus] = useState("");
    const router = useRouter();

    const handleAddFunds = async () => {
        setStatus("Processing...");
        try {
            const res = await addTestBalance();
            if (res.success) {
                setStatus("Success! Funds added.");
                router.refresh();
            } else {
                setStatus("Error: " + res.error);
            }
        } catch (e) {
            setStatus("Failed to connect.");
        }
    };

    if (!session) return <div className="p-10">Please login first.</div>;

    return (
        <div className="p-10 max-w-md mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-red-600">🚧 Test Environment</h1>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="font-bold">Logged in as: {session.user?.email}</p>
            </div>

            <button
                onClick={handleAddFunds}
                className="w-full py-4 bg-emerald-600 text-white font-bold rounded shadow-lg hover:bg-emerald-700 transition"
            >
                Add $50.00 Test Balance 💰
            </button>

            {status && <p className="font-bold text-center mt-4">{status}</p>}
        </div>
    );
}
