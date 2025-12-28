import { cookies } from "next/headers";
import { en } from "./en";
import { ar } from "./ar";

export async function getTranslation() {
    const cookieStore = await cookies();
    const lang = cookieStore.get("NEXT_LOCALE")?.value || "en";
    const dict = lang === "ar" ? ar : en;

    return (path: string): string => {
        const keys = path.split(".");
        let current: any = dict;

        for (const key of keys) {
            if (current[key] === undefined) return path;
            current = current[key];
        }

        return typeof current === "string" ? current : path;
    };
}
