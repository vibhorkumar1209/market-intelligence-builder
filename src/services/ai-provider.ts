import { ResearchParams } from '@/types';

export interface AIProvider {
    runMarketSizing(params: ResearchParams): Promise<string>;
    runSegmentation(params: ResearchParams, sizingData: string): Promise<string>;
    runTrends(params: ResearchParams): Promise<string>;
    runTechAnalysis(params: ResearchParams): Promise<string>;
    runCompetitiveAnalysis(params: ResearchParams): Promise<string>;
    runFinancialModel(params: ResearchParams, sizingData: string, segmentationData: string): Promise<string>;
    synthesizeReport(results: { id: string, data: string }[], params: ResearchParams): Promise<string>;
}

// Parallel.ai Implementation (Enterprise Research)
export class ParallelProvider implements AIProvider {
    private async callParallel(agentType: string, prompt: string): Promise<string> {
        try {
            const response = await fetch('/api/parallel', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agent_type: agentType, prompt })
            });
            const data = await response.json();

            if (data.error) {
                console.error(`Parallel API error for ${agentType}:`, data.error);
                return `[Error] Parallel API: ${data.error}`;
            }

            return data.content || "No research data returned.";
        } catch (error) {
            console.error(`Internal connection error for ${agentType}:`, error);
            return `[Error] Failed to connect to research service for ${agentType}.`;
        }
    }

    async runMarketSizing(params: ResearchParams): Promise<string> {
        const prompt = `Conduct deep institutional-grade research on Market Sizing for ${params.industry} ${params.subCategory ? `(${params.subCategory})` : ''} in ${params.geography}.
        REQUIRED: 
        1. TAM, SAM, and SOM figures with forecasts.
        2. Use Markdown Tables.
        3. Cite only credible sources.
        4. Include CAGR analysis.`;
        return this.callParallel('Market Sizing', prompt);
    }

    async runSegmentation(params: ResearchParams, sizingData: string): Promise<string> {
        const prompt = `Based on the following market sizing data:\n${sizingData}\n\nConduct deep segmentation analysis for ${params.industry} ${params.subCategory ? `(${params.subCategory})` : ''}.
        REQUIRED:
        1. Segmentation by Application, Product Type, and Region.
        2. Detailed Markdown Tables with Market Share %.
        3. Strategic Implications for each segment.`;
        return this.callParallel('Segmentation', prompt);
    }

    async runTrends(params: ResearchParams): Promise<string> {
        const prompt = `Identify major Industry Trends, Drivers, and Barriers for ${params.industry} ${params.subCategory ? `(${params.subCategory})` : ''} in ${params.geography}.
        REQUIRED:
        1. Table with: Trend Name | Impact (1-10) | Description | Strategic Move.
        2. Categorize by Demand, Supply, Tech, and Macro.`;
        return this.callParallel('Trends', prompt);
    }

    async runTechAnalysis(params: ResearchParams): Promise<string> {
        const prompt = `Analyze Technology Intelligence (Traditional vs Emerging) for ${params.industry} ${params.subCategory ? `(${params.subCategory})` : ''}.
        REQUIRED:
        1. Table with: Tech Type | Use Case | Adoption Maturity | Disruptive Potential.
        2. Mention key patents and regional penetration.`;
        return this.callParallel('Technology', prompt);
    }

    async runCompetitiveAnalysis(params: ResearchParams): Promise<string> {
        const prompt = `Analyze the Competitive Landscape for ${params.industry} ${params.subCategory ? `(${params.subCategory})` : ''} in ${params.geography}.
        REQUIRED:
        1. Table of Key Players | Estimated Market Share | Strategic Focus | SWOT Theme.
        2. Revenue comparison and margin benchmarks where available.`;
        return this.callParallel('Competitive', prompt);
    }

    async runFinancialModel(params: ResearchParams, sizingData: string, segmentationData: string): Promise<string> {
        const prompt = `Create an Investment-Grade Financial Model forecast for ${params.industry} ${params.subCategory ? `(${params.subCategory})` : ''} based on the data provided.
        REQUIRED:
        1. Revenue Forecast Table.
        2. TAM / SAM / SOM visual analysis.
        3. Sensitivity Analysis.
        4. Margin & Profit simulation.`;
        return this.callParallel('Financial Modeling', prompt);
    }

    async synthesizeReport(results: { id: string, data: string }[], params: ResearchParams): Promise<string> {
        return "Synthesis handled by OpenAI.";
    }
}

// OpenAI Implementation for Report Synthesis
export class OpenAIProvider implements AIProvider {
    async runMarketSizing(params: ResearchParams): Promise<string> { return "Research handled by Parallel."; }
    async runSegmentation(params: ResearchParams): Promise<string> { return "Research handled by Parallel."; }
    async runTrends(params: ResearchParams): Promise<string> { return "Research handled by Parallel."; }
    async runTechAnalysis(params: ResearchParams): Promise<string> { return "Research handled by Parallel."; }
    async runCompetitiveAnalysis(params: ResearchParams): Promise<string> { return "Research handled by Parallel."; }
    async runFinancialModel(params: ResearchParams): Promise<string> { return "Research handled by Parallel."; }

    async synthesizeReport(results: { id: string, data: string }[], params: ResearchParams): Promise<string> {
        try {
            const response = await fetch('/api/synthesize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ results, params })
            });
            const data = await response.json();

            if (data.error) {
                const errMsg = typeof data.error === 'object' ? (data.error.message || JSON.stringify(data.error)) : data.error;
                return `[Error] OpenAI API: ${errMsg}`;
            }

            return data.choices?.[0]?.message?.content || "Failed to synthesize report.";
        } catch (error) {
            console.error("Internal connection error for synthesis:", error);
            return "Failed to connect to synthesis service.";
        }
    }
}

// Combined Multi-Agent Provider
export class MultiAgentProvider implements AIProvider {
    private researchProvider = new ParallelProvider();
    private synthesisProvider = new OpenAIProvider();

    async runMarketSizing(params: ResearchParams): Promise<string> { return this.researchProvider.runMarketSizing(params); }
    async runSegmentation(params: ResearchParams, sizingData: string): Promise<string> { return this.researchProvider.runSegmentation(params, sizingData); }
    async runTrends(params: ResearchParams): Promise<string> { return this.researchProvider.runTrends(params); }
    async runTechAnalysis(params: ResearchParams): Promise<string> { return this.researchProvider.runTechAnalysis(params); }
    async runCompetitiveAnalysis(params: ResearchParams): Promise<string> { return this.researchProvider.runCompetitiveAnalysis(params); }
    async runFinancialModel(params: ResearchParams, sizingData: string, segmentationData: string): Promise<string> {
        return this.researchProvider.runFinancialModel(params, sizingData, segmentationData);
    }

    async synthesizeReport(results: { id: string, data: string }[], params: ResearchParams): Promise<string> {
        return this.synthesisProvider.synthesizeReport(results, params);
    }
}

// Legacy for compatibility
export class ClaudeSaaSProvider extends MultiAgentProvider { }
