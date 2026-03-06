import { ResearchParams } from '@/types';

export const runDataSourcingAgent = async (params: ResearchParams, resolvedScope: any, taxonomy: any, variant: 'volume' | 'pricing', callParallel: (prompt: string) => Promise<string>) => {
    const prompt = `
You are a market research analyst. Find hard data anchors for market sizing.
MARKET TYPE: ${resolvedScope.market_type}
VARIANT: ${variant.toUpperCase()}

RESOLVED SCOPE: ${JSON.stringify(resolvedScope)}
TAXONOMY: ${JSON.stringify(taxonomy)}

Systematically search identified sources (associations, gov databases, listed companies, trade data) for:
${variant === 'volume' ? '1. VOLUME ANCHORS, 2. MARKET SHARE ANCHORS, 3. SEASONAL PATTERN DATA' : '4. VALUE ANCHORS, 5. PRICING DATA'}

NEVER use syndicated research numbers. Document each anchor with source name, type, data point, period, url, and credibility rating (1-5 stars).
Respond ONLY in valid JSON array.
`;

    return await callParallel(prompt);
};
