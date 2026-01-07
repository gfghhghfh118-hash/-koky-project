"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "@/lib/i18n/en";
import { ar } from "@/lib/i18n/ar";

type Dictionary = typeof en;
type Language = "en" | "ar";

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
    dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>("en");

    useEffect(() => {
        // Load persist language inside client
        const stored = localStorage.getItem("language") as Language;
        if (stored && (stored === "en" || stored === "ar")) {
            setLanguageState(stored);
            document.documentElement.dir = stored === "ar" ? "rtl" : "ltr";
            document.documentElement.lang = stored;
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem("language", lang);
        document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;
        document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = lang;
    };

    const t = (path: string): string => {
        const keys = path.split(".");
        let current: any = language === "ar" ? ar : en;

        for (const key of keys) {
            if (current[key] === undefined) return path;
            current = current[key];
        }

        return typeof current === "string" ? current : path;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir: language === "ar" ? "rtl" : "ltr" }}>
            {children}
        </LanguageContext.Provider>
    );
}

const defaultContext: LanguageContextType = {
    language: "en",
    setLanguage: () => { },
    t: (key: string) => key,
    dir: "ltr"
};

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        // Prevent crash during hydration/initial render issues
        // console.warn("useLanguage used outside of provider. Returning default.");
        return defaultContext;
    }
    return context;
}
