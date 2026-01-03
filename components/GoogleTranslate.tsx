"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
    interface Window {
        googleTranslateElementInit: () => void;
        google: any;
    }
}

export function GoogleTranslate() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        window.googleTranslateElementInit = () => {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: "en",
                    includedLanguages: "ar,en,fr,de,es,it,pt,ru,zh-CN,ja,ko,tr,hi,bn", // Explicitly list popular languages to ensure control, OR use 'all'
                    // To strictly exclude Hebrew, we can simply NOT include 'iw' or 'he' in this list if we use specific list.
                    // However, users usually want "ALL". If we use 'all', we must hide via CSS.
                    // Let's use 'auto' or 'all' logic:
                    layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false,
                },
                "google_translate_element"
            );
            setIsLoaded(true);
        };
    }, []);

    return (
        <>
            <style jsx global>{`
                /* Hide Google Translate Banner */
                .goog-te-banner-frame.skiptranslate {
                    display: none !important;
                }
                body {
                    top: 0px !important;
                }
                /* Hide Hebrew from dropdown (Codes: iw, he) */
                .goog-te-combo option[value="iw"],
                .goog-te-combo option[value="he"] {
                    display: none !important;
                }
                /* Customize Dropdown Style */
                .goog-te-gadget {
                    font-family: inherit !important;
                    font-size: 0px !important; /* Hide "Powered by Google" text */
                    color: transparent !important;
                }
                .goog-te-gadget .goog-te-combo {
                    color: #475569; /* slate-600 */
                    background-color: white;
                    border: 1px solid #cbd5e1; /* slate-300 */
                    border-radius: 0.5rem;
                    padding: 0.25rem 0.5rem;
                    font-size: 0.875rem; /* 14px */
                    font-weight: 600;
                    outline: none;
                    cursor: pointer;
                }
            `}</style>

            <div id="google_translate_element" className="min-h-[30px]" />

            <Script
                src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
                strategy="afterInteractive"
            />
        </>
    );
}
