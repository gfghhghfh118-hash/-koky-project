
import { Metadata, ResolvingMetadata } from "next";
import RegisterContent from "./RegisterContent";

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const params = await searchParams;
    const ref = params.ref as string;

    const title = ref
        ? `دعوة خاصة من ${ref} للانضمام إلى Koky.bz 🎁`
        : "سجل الآن وابدأ الربح | Koky.bz";

    const description = "فرصة عمل من المنزل لا تعوض! اربح دولارات يومياً من خلال مشاهدة الإعلانات وتنفيذ المهام البسيطة. سحب فوري للأرباح. انضم الآن!";

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: description,
        }
    };
}

export default function RegisterPage() {
    return <RegisterContent />;
}
