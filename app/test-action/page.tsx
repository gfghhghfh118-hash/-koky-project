"use client";
import { testAction } from "@/actions/test";
import { toast } from "sonner";

export default function TestActionPage() {
    return (
        <div className="p-20 text-center">
            <button
                onClick={async () => {
                    console.log("Clicking test button");
                    try {
                        const res = await testAction();
                        console.log("Action response:", res);
                        toast.success(res.message);
                    } catch (e) {
                        console.error("Action error:", e);
                        toast.error("Action failed");
                    }
                }}
                className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold"
            >
                Test Server Action
            </button>
        </div>
    );
}
