import { ResearchParams, AgentStatus } from '@/types';
import { ParallelAIService } from './parallelAIService';
import { OpenAIService } from './openAIService';
// New Agents
import { runIndustryResolverAgent } from '@/agents/industryResolverAgent';
import { runTaxonomyBuilderAgent } from '@/agents/taxonomyBuilderAgent';
import { runDataSourcingAgent } from '@/agents/dataSourcingAgent';
import { runSizingEngineAgent } from '@/agents/sizingEngineAgent';
import { runMethodologyAgent } from '@/agents/methodologyAgent';
import { AGENT_SCHEMAS } from './schemas';

export class Orchestrator {
    private parallel: ParallelAIService;
    private openai: OpenAIService;

    constructor() {
        this.parallel = new ParallelAIService();
        this.openai = new OpenAIService();
    }

    async generateReport(params: ResearchParams, onUpdate: (id: string, progress: number) => void) {
        const results: any = {};

        try {
            // STAGE 0: Industry Resolver
            onUpdate('resolver', 10);
            const callParallelResolver = (prompt: string) => this.parallel.runAgentTask('resolver', prompt);
            const rawResolver = await runIndustryResolverAgent(params, callParallelResolver);
            onUpdate('resolver', 50);
            const resolvedScope = await this.openai.structureData(rawResolver, 'resolver', AGENT_SCHEMAS.resolver);
            results['resolver'] = resolvedScope;
            onUpdate('resolver', 100);

            // SCOPE GATE
            const dataRating = resolvedScope.data_source_landscape?.data_availability_assessment?.overall_rating || 0;
            if (dataRating < 3) {
                console.warn("Scope Gate: Low data availability rating", dataRating);
                // In a real app, we'd trigger a UI callback to ask the user to proceed
            }

            // STAGE 1: Taxonomy Builder
            onUpdate('taxonomy', 10);
            const callParallelTaxonomy = (prompt: string) => this.parallel.runAgentTask('taxonomy', prompt);
            const rawTaxonomy = await runTaxonomyBuilderAgent(params, resolvedScope, callParallelTaxonomy);
            onUpdate('taxonomy', 50);
            const taxonomy = await this.openai.structureData(rawTaxonomy, 'taxonomy', AGENT_SCHEMAS.taxonomy);
            results['taxonomy'] = taxonomy;
            onUpdate('taxonomy', 100);

            // STAGE 2: Data Sourcing (Parallel)
            onUpdate('sourcing', 10);
            const callParallelSourcing = (prompt: string) => this.parallel.runAgentTask('sourcing', prompt);
            const [rawVol, rawPrice] = await Promise.all([
                runDataSourcingAgent(params, resolvedScope, taxonomy, 'volume', callParallelSourcing),
                runDataSourcingAgent(params, resolvedScope, taxonomy, 'pricing', callParallelSourcing)
            ]);
            onUpdate('sourcing', 50);
            const anchorsVol = await this.openai.structureData(rawVol, 'anchors_volume', AGENT_SCHEMAS.anchors_volume);
            const anchorsPrice = await this.openai.structureData(rawPrice, 'anchors_pricing', AGENT_SCHEMAS.anchors_pricing);
            const mergedAnchors = [...(Array.isArray(anchorsVol) ? anchorsVol : []), ...(Array.isArray(anchorsPrice) ? anchorsPrice : [])];
            results['sourcing'] = mergedAnchors;
            onUpdate('sourcing', 100);

            // STAGE 3: Sizing Engine
            onUpdate('sizing', 10);
            const callParallelSizing = (prompt: string) => this.parallel.runAgentTask('sizing', prompt);
            const rawSizing = await runSizingEngineAgent(params, resolvedScope, taxonomy, mergedAnchors, callParallelSizing);
            onUpdate('sizing', 50);
            const sizing = await this.openai.structureData(rawSizing, 'sizing', AGENT_SCHEMAS.sizing);
            results['sizing'] = sizing;
            onUpdate('sizing', 100);

            // ARITHMETIC GATE (Simplified)
            // Validation logic could go here

            // STAGE 4: Methodology
            onUpdate('methodology', 10);
            const callParallelMethod = (prompt: string) => this.parallel.runAgentTask('methodology', prompt);
            const rawMethod = await runMethodologyAgent(params, resolvedScope, taxonomy, mergedAnchors, sizing, callParallelMethod);
            onUpdate('methodology', 50);
            const methodology = await this.openai.structureData(rawMethod, 'methodology', AGENT_SCHEMAS.methodology);
            results['methodology'] = methodology;
            onUpdate('methodology', 100);

            // FINAL SYNTHESIS
            onUpdate('synthesis', 20);
            const synthesisPrompt = `
You are a Principal at McKinsey. Synthesize a MASTER INVESTMENT-GRADE DATAPACK REPORT for: ${params.industry}. 

Use the following segmented intelligence: ${JSON.stringify(results)}.

REPORT REQUIREMENTS:
1. EXECUTIVE SUMMARY: High-level institutional pitch.
2. MARKET TAXONOMY: Detailed breakdown of the product scope and geography.
3. DATA ANCHORS: List the hard data points found during sourcing.
4. QUANTIFIED MARKET SIZE: 
   - RENDER A STRICT MARKDOWN TABLE for Consolidated Market (Volume/Value) over 5 base/forecast years.
   - RENDER A STRICT MARKDOWN TABLE for Top Suppliers & Market Shares.
   - RENDER A STRICT MARKDOWN TABLE for Forecasted Growth CAGR.
   - Write 3-5 high-impact "Analyst Insights" after each table.
5. SEGMENTATION ANALYSIS:
   - RENDER A STRICT MARKDOWN TABLE for Primary Axis.
   - RENDER A STRICT MARKDOWN TABLE for Geography.
6. METHODOLOGY & CONFIDENCE: Logic chain and error margins.

CRITICAL RULES:
- YOU MUST USE PERFECT MARKDOWN TABLES FOR ALL DATA. Format them EXACTLY like this:
| Segment/Year | Value ($B) | Market Share (%) |
|--------------|------------|------------------|
| Data 1       | 100        | 45%              |
| Data 2       | 120        | 55%              |
- YOU ABSOLUTELY MUST output at least 4 Markdown tables.
- If raw data is missing, perform high-confidence strategic estimates to fill the tables. Do NOT write "Data not available", you must populate the tables with educated estimates.
- The UI parser reads Markdown tables to build the charts. If you fail to write a Markdown table, the charts will break.
- NO FILLER. NO FLUFF.
`;
            const rawReport = await this.openai.synthesize(synthesisPrompt, results);
            onUpdate('synthesis', 70);
            const qualityResult = await this.openai.checkQuality(rawReport);
            onUpdate('synthesis', 100);

            return {
                content: qualityResult.refinedText,
                qualityScore: qualityResult.score,
                data: results
            };

        } catch (err) {
            console.error("Orchestration failed:", err);
            throw err;
        }
    }
}
