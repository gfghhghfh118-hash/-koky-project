import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "#8B5CF6", // Premium Purple
                    foreground: "#ffffff",
                },
                card: {
                    DEFAULT: "rgba(30, 30, 40, 0.8)",
                    foreground: "#ffffff",
                }
            },
        },
    },
    plugins: [],
};
export default config;
