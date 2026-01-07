
// Basic regex patterns for content moderation
// Expanding this list requires more keywords or an external API.

const BANNED_PATTERNS = {
    drugs: /drug|cocaine|heroin|weed|cannabis|مخدرات|حشيش|هيروين|كوكايين/i,
    terrorism: /bomb|terror|kill|attack|isis|daesh|إرهاب|قنبلة|قتل|داعش|تفجير/i,
    sexual: /sex|porn|nude|xxx|jins|جنس|إباحي|عاري|نيك/i
};

export function checkContent(text: string): { safe: boolean; flagged: string[] } {
    const flagged: string[] = [];

    if (BANNED_PATTERNS.drugs.test(text)) {
        flagged.push("drugs");
    }
    if (BANNED_PATTERNS.terrorism.test(text)) {
        flagged.push("terrorism");
    }
    if (BANNED_PATTERNS.sexual.test(text)) {
        flagged.push("sexual");
    }

    return {
        safe: flagged.length === 0,
        flagged
    };
}
