import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { User, CheckCircle, ArrowRight } from "lucide-react";
import { Metadata } from "next";

type Props = {
    params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { username } = await params;

    return {
        title: `Join ${username} on Koky`,
        description: `Join ${username} and start earning money online by watching videos and completing tasks.`,
    };
}

export default async function UserBioPage({ params }: Props) {
    const { username } = await params;

    // Find user (case insensitive if possible, but distinct is standard)
    const user = await db.user.findUnique({
        where: { username: username }
    });

    if (!user) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl text-center">
                    {/* Avatar */}
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-emerald-400 to-blue-500 p-[2px]">
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden">
                            {user.image ? (
                                <img src={user.image} alt={user.username || "User"} className="w-full h-full object-cover" />
                            ) : (
                                <User size={40} className="text-white/50" />
                            )}
                        </div>
                    </div>

                    {/* Name & Title */}
                    <h1 className="text-3xl font-black text-white mb-2">{user.username}</h1>
                    <p className="text-slate-400 font-medium mb-8">invites you to join Koky</p>

                    {/* Stats / Social Proof (Static for now to entice) */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                            <div className="flex justify-center text-emerald-400 mb-1">
                                <CheckCircle size={20} />
                            </div>
                            <div className="text-sm font-bold text-white">Verified</div>
                            <div className="text-[10px] text-slate-500">Member</div>
                        </div>
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                            <div className="flex justify-center text-blue-400 mb-1">
                                <User size={20} />
                            </div>
                            <div className="text-sm font-bold text-white">Active</div>
                            <div className="text-[10px] text-slate-500">Earner</div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <Link
                        href={`/register?ref=${user.username}`}
                        className="block w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-400 hover:to-blue-400 text-white font-black text-lg shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 group"
                    >
                        Join Team Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <p className="mt-6 text-xs text-slate-500">
                        Join & start earning immediately. No fees required.
                    </p>
                </div>

                {/* Branding Footer */}
                <div className="mt-8 text-center">
                    <Link href="/" className="text-white/20 hover:text-white/50 font-black tracking-widest uppercase text-sm transition-colors">
                        KOKY
                    </Link>
                </div>
            </div>
        </div>
    );
}
