import { ResearchParams } from '@/types';

export const runTaxonomyBuilderAgent = async (params: ResearchParams, resolvedScope: any, callParallel: (prompt: string) => Promise<string>) => {
    const prompt = `
You are a senior market research consultant. Build a complete market taxonomy based on the RESOLVED MARKET SCOPE.

RESOLVED SCOPE: ${JSON.stringify(resolvedScope)}

Tasks:
1. DEFINITIONS & COVERAGE: Product definition, segmentation axis definitions, geo regions, time periods.
2. SEGMENTATION DETAIL: List segments for Primary, Secondary, Supplier, and Geographic axes.
3. REGULATORY & STANDARDS: Active norms, upcoming changes, certification bodies.

Use ACTUAL product names and ratings. Every segment must be MECE.
Respond ONLY in valid JSON.
`;

    return await callParallel(prompt);
};
