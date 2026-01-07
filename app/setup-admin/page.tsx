"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { promoteToAdmin } from "@/actions/admin-setup"; // We will create this

export default function SetupAdminPage() {
    const { data: session } = useSession();
    const [secret, setSecret] = useState("");
    const [status, setStatus] = useState("");
    const router = useRouter();

    const handlePromote = async () => {
        setStatus("Processing...");
        const res = await promoteToAdmin(secret);
        if (res.success) {
            setStatus("Success! You are now an Admin.");
            alert("Success! Please LOGOUT and LOGIN again to access the Admin Dashboard.");
            router.push("/api/auth/signout");
        } else {
            setStatus("Error: " + res.error);
        }
    };

    if (!session) return <div className="p-10">Please login first.</div>;

    return (
        <div className="p-10 max-w-md mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-red-600">🛡️ Admin Setup</h1>

            <div className="space-y-2">
                <label className="font-bold block">Enter Setup Secret:</label>
                <input
                    type="password"
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    className="w-full p-3 border rounded"
                    placeholder="Enter the secret key..."
                />
            </div>

            <button
                onClick={handlePromote}
                className="w-full py-3 bg-red-600 text-white font-bold rounded shadow-lg hover:bg-red-700 transition"
            >
                Promote Me to Admin 👑
            </button>

            {status && <p className="font-bold text-center mt-4">{status}</p>}
        </div>
    );
}
