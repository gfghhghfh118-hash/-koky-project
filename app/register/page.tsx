
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
        ? `Join ${ref} on Koky.bz & Start Earning!`
        : "Create Account | Koky.bz - Earn Money Online";

    const description = ref
        ? `${ref} has invited you to join Koky.bz. Sign up now to earn money by watching ads, completing tasks, and more. Instant withdrawals!`
        : "Join the fastest growing earning platform. Watch ads, complete tasks, and get paid instantly.";

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
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
