import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { AuthProvider } from "@/components/providers/SessionProvider";
import { cookies } from "next/headers";
import { BrowserBlock } from "@/components/BrowserBlock";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
    metadataBase: new URL("https://koky-project-op1a.vercel.app"),
    applicationName: "Koky Project",
    title: {
        default: "Koky Project | Earn $10 Daily Watching Videos 💸",
        template: "%s | Koky Project"
    },
    description: " The #1 site to earn money online. Join Koky Project to watch videos, visit websites, and get paid instantly. Safe, legit, and trusted by 50,000+ users.",
    keywords: ["Koky Project", "Koky", "Koky.bz", "Earn Money Online", "Watch Videos Earn", "Make Money from Home", "Legit Paying Sites", "Crypto Earning"],
    authors: [{ name: "Koky Team", url: "https://koky.bz" }],
    openGraph: {
        title: "🔥 Koky Project - Earn $10 Daily Guaranteed!",
        description: "Stop scrolling for free. Start getting paid for your time online with Koky Project. Instant withdrawals.",
        url: "https://koky.bz",
        siteName: "Koky Project",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "💸 I just withdrew $10 from Koky Project!",
        description: "Easiest way to earn crypto online. No investment needed. Click to join my team on Koky Project!",
    }
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const cookieStore = await cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "en";
    const dir = locale === "ar" ? "rtl" : "ltr";

    return (
        <html lang={locale} dir={dir} suppressHydrationWarning>
            <head>
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            (function() {
                                var suppressError = function(prop) {
                                    try {
                                        Object.defineProperty(window, prop, {
                                            get: function() { return undefined; },
                                            set: function(v) { /* Ignore setup by conflicting extensions */ },
                                            configurable: true
                                        });
                                    } catch (e) {}
                                };
                                suppressError('ethereum');
                                suppressError('tronLink');
                            })();
                        `,
                    }}
                />
            </head>
            <body className={clsx(outfit.className, "min-h-screen bg-background text-foreground transition-colors duration-300")}>
                {/* <BrowserBlock /> */}
                <AuthProvider>
                    <LanguageProvider>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="light"
                            enableSystem
                            disableTransitionOnChange
                        >
                            {children}
                        </ThemeProvider>
                    </LanguageProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
