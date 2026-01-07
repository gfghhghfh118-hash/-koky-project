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
    metadataBase: new URL("https://koky-project-op1a.vercel.app"), // Set base URL for OG images
    title: {
        default: "Koky.bz | Earn $10 Daily from Home 💸",
        template: "%s | Koky.bz"
    },
    description: "Join 50,000+ users earning real money securely! Watch videos, surf sites, and get paid instantly via Crypto & PayPal. Sign up now & get a $0.50 bonus!",
    openGraph: {
        title: "🔥 Earn $10 Daily - Guaranteed Payouts!",
        description: "Stop scrolling for free. Start getting paid for your time online. Instant withdrawals to Binance, Payeer & more.",
        url: "https://koky.bz",
        siteName: "Koky.bz",
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "💸 I just withdrew $10 from Koky.bz!",
        description: "Easiest way to earn crypto online. No investment needed. Click to join my team!",
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
