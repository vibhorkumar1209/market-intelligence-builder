import { ResearchParams } from '@/types';

export const runSizingEngineAgent = async (params: ResearchParams, resolvedScope: any, taxonomy: any, anchors: any[], callParallel: (prompt: string) => Promise<string>) => {
    const prompt = `
You are a quantitative market analyst. Build the complete market sizing model.

RESOLVED SCOPE: ${JSON.stringify(resolvedScope)}
TAXONOMY: ${JSON.stringify(taxonomy)}
DATA ANCHORS: ${JSON.stringify(anchors)}

Build the following tables (Respond in valid JSON only):
1. CONSOLIDATED MARKET: Data for Current Year (Base), 5 Historical Years, and 5 Forecast Years. Include Volume, Value, and Price metrics.
2. SUPPLIER BREAKDOWN: Market share % and total revenue for Top 10 Suppliers in this geography.
3. PRIMARY AXIS SEGMENTATION: Detailed revenue/volume breakdown for the segments defined in Taxonomy.
4. GEOGRAPHIC SEGMENTATION: Breakdown by major states/regions within ${params.geography}.
5. FORECAST ANALYSIS: Year-on-year growth rates and CAGR for different periods.

CRITICAL RULES:
- If raw data is missing, perform high-confidence estimations based on the hard anchors provided.
- Maintain perfect consistency: Value = Volume × Avg Price.
- All segment sums must match the consolidated market totals.
- No generic ranges (e.g., "$1B - $2B"); provide a specific data point.

Respond in JSON with the structure specified in AGENT_SCHEMAS.sizing.
`;

    return await callParallel(prompt);
};
