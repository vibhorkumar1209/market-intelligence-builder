import { ResearchParams } from '@/types';

export const runSizingEngineAgent = async (params: ResearchParams, resolvedScope: any, taxonomy: any, anchors: any[], callParallel: (prompt: string) => Promise<string>) => {
    const prompt = `
You are a quantitative market analyst. Build the complete market sizing model.

RESOLVED SCOPE: ${JSON.stringify(resolvedScope)}
TAXONOMY: ${JSON.stringify(taxonomy)}
DATA ANCHORS: ${JSON.stringify(anchors)}

Build the following tables:
1. CONSOLIDATED MARKET (Quarter-wise)
2. SUPPLIER / MANUFACTURER BREAKDOWN (Quarter-wise)
3. PRIMARY AXIS SEGMENTATION (Quarter-wise)
4. SECONDARY AXIS SEGMENTATION (Quarter-wise)
5. CROSS-TAB — SUPPLIER × PRIMARY AXIS
6. CROSS-TAB — SUPPLIER × SECONDARY AXIS
7. GEOGRAPHIC SEGMENTATION
8. PRICING / RATE CARD
9. FORECAST PERIOD OUTLOOK

Ensure internal consistency (Value / Volume = Price). All cross-tabs must sum correctly.
Respond ONLY in valid JSON.
`;

    return await callParallel(prompt);
};
