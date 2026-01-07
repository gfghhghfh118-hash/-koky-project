"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, DollarSign, Link as LinkIcon, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

interface ReferralStats {
    totalReferrals: number;
    activeReferrals: number;
    totalEarnings: number;
    referralLink: string;
    recentReferrals: { username: string; date: string; income: number }[];
}

export function ReferralView({ stats }: { stats: ReferralStats }) {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(stats.referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">{t("referrals.title")}</h1>
                    <p className="text-muted-foreground">{t("referrals.promo_text")}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-400 uppercase">{t("referrals.total_referrals")}</CardTitle>
                        <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{stats.totalReferrals}</div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/10 border-green-200 dark:border-green-800">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-green-800 dark:text-green-400 uppercase">{t("referrals.total_earnings")}</CardTitle>
                        <DollarSign className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-900 dark:text-green-100">${stats.totalEarnings.toFixed(4)}</div>
                    </CardContent>
                </Card>

                <Card className="bg-card">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm font-medium text-muted-foreground uppercase">{t("referrals.active_referrals")}</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-foreground">{stats.activeReferrals}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Referral Link */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <LinkIcon size={20} />
                        {t("referrals.your_link")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-2">
                        <Input value={stats.referralLink} readOnly className="font-mono bg-muted" />
                        <Button onClick={handleCopy} className="min-w-[100px]">
                            <span className="flex items-center gap-2">
                                {copied ? <Check size={16} /> : <Copy size={16} />}
                                <span>{copied ? t("referrals.copied") : t("referrals.copy")}</span>
                            </span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Referrals List */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">{t("referrals.list_title")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <div className="grid grid-cols-3 p-4 bg-muted font-bold text-sm">
                            <div>{t("referrals.user")}</div>
                            <div>{t("referrals.date")}</div>
                            <div className="text-right">{t("referrals.income")}</div>
                        </div>
                        {stats.recentReferrals.length === 0 ? (
                            <div className="p-8 text-center text-muted-foreground">
                                {t("referrals.no_referrals")}
                            </div>
                        ) : (
                            stats.recentReferrals.map((ref, i) => (
                                <div key={i} className="grid grid-cols-3 p-4 border-t text-sm hover:bg-muted/50 transition-colors">
                                    <div className="font-medium">{ref.username}</div>
                                    <div className="text-muted-foreground">{ref.date}</div>
                                    <div className="text-right text-green-600 font-bold">---</div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
