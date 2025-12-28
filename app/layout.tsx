import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import clsx from "clsx";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/components/providers/LanguageProvider";
import { cookies } from "next/headers";
import { BrowserBlock } from "@/components/BrowserBlock";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Koky.bz",
    description: "Earn money by completing simple tasks online.",
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
            </head>
            <body className={clsx(outfit.className, "min-h-screen bg-background text-foreground transition-colors duration-300")}>
                {/* <BrowserBlock /> */}
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
            </body>
        </html>
    );
}
