import { ResearchParams } from '@/types';

export const runMethodologyAgent = async (params: ResearchParams, resolvedScope: any, taxonomy: any, anchors: any[], sizing: any, callParallel: (prompt: string) => Promise<string>) => {
    const prompt = `
You are a senior analyst. Document the complete estimation methodology.

RESOLVED SCOPE: ${JSON.stringify(resolvedScope)}
TAXONOMY: ${JSON.stringify(taxonomy)}
DATA ANCHORS: ${JSON.stringify(anchors)}
MARKET MODEL: ${JSON.stringify(sizing)}

Create documentation covering:
1. APPROACH OVERVIEW
2. ANNUAL MARKET SIZE BUILD (per-segment logic)
3. QUARTERLY BREAKDOWN METHODOLOGY
4. VALUE / PRICING ESTIMATION
5. SOURCE CREDIBILITY MATRIX
6. STRENGTH ASSESSMENT & ERROR MARGINS

Respond ONLY in valid JSON.
`;

    return await callParallel(prompt);
};
