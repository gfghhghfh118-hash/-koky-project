
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

    const displayName = ref || "A Friend";

    // High Conversion / "Enticing" Copy
    const title = `🎁 ${displayName} sent you a $0.50 Bonus! | Join Koky.bz`;
    const description = "Stop scrolling for free! Start earning $10 daily by watching ads and surfing sites. Instant payouts to Crypto & PayPal. Claim your signup bonus now!";

    const ogTitle = `🔥 Earn $10 Daily - Invited by ${displayName}`;

    return {
        title: title,
        description: description,
        openGraph: {
            title: ogTitle,
            description: description,
            type: 'website',
            // images is handled automatically by opengraph-image.tsx
        },
        twitter: {
            card: 'summary_large_image',
            title: ogTitle,
            description: description,
        }
    };
}

export default function RegisterPage() {
    return <RegisterContent />;
}
