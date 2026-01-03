"use client";

import { MousePointerClick, ArrowRight, Globe } from "lucide-react";

export function FeaturesSection() {
    return (
        <div className="max-w-6xl mx-auto px-4 py-20 border-t border-slate-100">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tighter uppercase italic">Why Choose Us</h2>
                <div className="w-12 h-1 bg-green-500 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Feature 1: Simple Tasks */}
                <div className="text-center group">
                    <div className="bg-blue-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-blue-600 group-hover:scale-110 transition-transform">
                        <MousePointerClick size={36} />
                    </div>
                    <h3 className="text-xl font-extrabold mb-3 text-slate-800">Simple Tasks</h3>
                    <p className="text-slate-500 text-sm leading-relaxed px-4">
                        Earn money by completing simple micro-tasks like signing up for websites, liking posts, or testing apps.
                    </p>
                </div>

                {/* Feature 2: Watch Videos */}
                <div className="text-center group">
                    <div className="bg-red-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-red-600 group-hover:scale-110 transition-transform">
                        <ArrowRight size={36} />
                    </div>
                    <h3 className="text-xl font-extrabold mb-3 text-slate-800">Watch Videos</h3>
                    <p className="text-slate-500 text-sm leading-relaxed px-4">
                        Get paid to watch YouTube videos. Just sit back, watch engaging content, and grow your balance.
                    </p>
                </div>

                {/* Feature 3: Surf Ads */}
                <div className="text-center group">
                    <div className="bg-green-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-green-600 group-hover:scale-110 transition-transform">
                        <Globe size={36} />
                    </div>
                    <h3 className="text-xl font-extrabold mb-3 text-slate-800">Surf Websites</h3>
                    <p className="text-slate-500 text-sm leading-relaxed px-4">
                        Browse our advertiser&apos;s websites and get paid instantly for every visit. It&apos;s the easiest way to earn.
                    </p>
                </div>
            </div>
        </div>
    );
}
