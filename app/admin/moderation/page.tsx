import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Action to approve task
async function approveTask(formData: FormData) {
    "use server";
    const taskId = formData.get("taskId") as string;
    await db.task.update({
        where: { id: taskId },
        data: { adminStatus: "APPROVED", active: true }
    });
    revalidatePath("/admin/moderation");
}

// Action to reject task
async function rejectTask(formData: FormData) {
    "use server";
    const taskId = formData.get("taskId") as string;
    await db.task.delete({ // Or set status REJECTED
        where: { id: taskId }
    });
    revalidatePath("/admin/moderation");
}

export default async function AdminModerationPage() {
    // Find tasks that are PENDING admin approval or have moderation tags
    const tasks = await db.task.findMany({
        where: { 
            OR: [
                { adminStatus: "PENDING" },
                { moderationTags: { isEmpty: false } }
            ]
        },
        orderBy: { createdAt: "desc" },
        include: { creator: true }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white">Content Moderation Queue</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.map((task) => (
                    <div key={task.id} className="glass-card p-6 border border-red-500/20">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{task.title}</h3>
                                <p className="text-sm text-gray-400">By: {task.creator?.email}</p>
                            </div>
                            {task.moderationTags.length > 0 && (
                                <div className="flex gap-1">
                                    {task.moderationTags.map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-red-500/20 text-red-500 text-xs rounded border border-red-500/20">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="mb-4 p-3 bg-black/20 rounded text-sm text-gray-300">
                            {task.description || "No description provided."}
                        </div>

                        <div className="flex gap-3 mt-4">
                            <form action={approveTask}>
                                <input type="hidden" name="taskId" value={task.id} />
                                <button className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded transition-colors shadow-lg shadow-green-900/20 w-full">
                                    Safe & Approve
                                </button>
                            </form>
                            
                            <form action={rejectTask}>
                                <input type="hidden" name="taskId" value={task.id} />
                                <button className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded transition-colors shadow-lg shadow-red-900/20 w-full">
                                    Reject & Delete
                                </button>
                            </form>
                        </div>
                    </div>
                ))}

                {tasks.length === 0 && (
                    <p className="text-gray-500 col-span-2 text-center py-10">
                        No content currently pending moderation. Good job!
                    </p>
                )}
            </div>
        </div>
    );
}
