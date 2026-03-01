import { ResearchParams } from '@/types';

export interface AIProvider {
    runMarketSizing(params: ResearchParams): Promise<string>;
    runSegmentation(params: ResearchParams): Promise<string>;
    runTrends(params: ResearchParams): Promise<string>;
    runTechAnalysis(params: ResearchParams): Promise<string>;
    runCompetitiveAnalysis(params: ResearchParams): Promise<string>;
    runFinancialModel(params: ResearchParams): Promise<string>;
    synthesizeReport(results: { id: string, data: string }[], params: ResearchParams): Promise<string>;
}

// Perplexity Implementation for Web Research (via internal API)
export class PerplexityProvider implements AIProvider {
    private async callPerplexity(agentType: string, params: ResearchParams): Promise<string> {
        const prompt = `Research Agent: ${agentType}
Industry: ${params.industry}
Sub-industry: ${params.subIndustry}
Geography: ${params.geography}
Timeframe: ${params.historicalYears}-${params.forecastYears}

Task: Conduct deep web research and provide detailed market data. 
Requirements:
1. Provide specific numbers, market sizes, and CAGR where possible.
2. Use Markdown Tables for any tabular data.
3. Use bullet points for key insights.
4. Cite sources (e.g., Gartner, Statista, Official Reports).
5. Output valid Markdown.`;

        try {
            const response = await fetch('/api/research', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agent_type: agentType, prompt })
            });
            const data = await response.json();

            if (data.error) {
                const errMsg = typeof data.error === 'object' ? (data.error.message || JSON.stringify(data.error)) : data.error;
                console.error(`Perplexity API error for ${agentType}:`, data.error);
                return `[Error] Perplexity API: ${errMsg}`;
            }

            return data.choices?.[0]?.message?.content || "No research data returned.";
        } catch (error) {
            console.error(`Internal connection error for ${agentType}:`, error);
            return `[Error] Failed to connect to research service for ${agentType}.`;
        }
    }

    async runMarketSizing(params: ResearchParams): Promise<string> { return this.callPerplexity('Market Sizing', params); }
    async runSegmentation(params: ResearchParams): Promise<string> { return this.callPerplexity('Segmentation', params); }
    async runTrends(params: ResearchParams): Promise<string> { return this.callPerplexity('Trends', params); }
    async runTechAnalysis(params: ResearchParams): Promise<string> { return this.callPerplexity('Technology', params); }
    async runCompetitiveAnalysis(params: ResearchParams): Promise<string> { return this.callPerplexity('Competitive', params); }
    async runFinancialModel(params: ResearchParams): Promise<string> { return this.callPerplexity('Financial', params); }

    async synthesizeReport(results: { id: string, data: string }[], params: ResearchParams): Promise<string> {
        return "Synthesis handled by OpenAI.";
    }
}

// OpenAI Implementation for Report Synthesis (via internal API)
export class OpenAIProvider implements AIProvider {
    async runMarketSizing(params: ResearchParams): Promise<string> { return "Research handled by Perplexity."; }
    async runSegmentation(params: ResearchParams): Promise<string> { return "Research handled by Perplexity."; }
    async runTrends(params: ResearchParams): Promise<string> { return "Research handled by Perplexity."; }
    async runTechAnalysis(params: ResearchParams): Promise<string> { return "Research handled by Perplexity."; }
    async runCompetitiveAnalysis(params: ResearchParams): Promise<string> { return "Research handled by Perplexity."; }
    async runFinancialModel(params: ResearchParams): Promise<string> { return "Research handled by Perplexity."; }

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
                console.error("OpenAI API error:", data.error);
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
    private researchProvider = new PerplexityProvider();
    private synthesisProvider = new OpenAIProvider();

    async runMarketSizing(params: ResearchParams): Promise<string> { return this.researchProvider.runMarketSizing(params); }
    async runSegmentation(params: ResearchParams): Promise<string> { return this.researchProvider.runSegmentation(params); }
    async runTrends(params: ResearchParams): Promise<string> { return this.researchProvider.runTrends(params); }
    async runTechAnalysis(params: ResearchParams): Promise<string> { return this.researchProvider.runTechAnalysis(params); }
    async runCompetitiveAnalysis(params: ResearchParams): Promise<string> { return this.researchProvider.runCompetitiveAnalysis(params); }
    async runFinancialModel(params: ResearchParams): Promise<string> { return this.researchProvider.runFinancialModel(params); }

    async synthesizeReport(results: { id: string, data: string }[], params: ResearchParams): Promise<string> {
        return this.synthesisProvider.synthesizeReport(results, params);
    }
}

// Legacy for compatibility
export class ClaudeSaaSProvider extends MultiAgentProvider { }
