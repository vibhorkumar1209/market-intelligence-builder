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

// Perplexity Implementation for Web Research
export class PerplexityProvider implements AIProvider {
    private apiKey = process.env.NEXT_PUBLIC_PERPLEXITY_API_KEY || '4nWUcLljq5QHOD27uZSOr86S9XiUqkjzcCNinit1saNamNvq';

    private async callPerplexity(agentType: string, params: ResearchParams): Promise<string> {
        const prompt = `Research Agent: ${agentType}
Industry: ${params.industry}
Sub-industry: ${params.subIndustry}
Geography: ${params.geography}
Timeframe: ${params.historicalYears}-${params.forecastYears}

Task: Conduct deep web research and provide detailed market data, tables, and insights. Focus on credible sources and current year data.`;

        try {
            const response = await fetch('https://api.perplexity.ai/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'sonar-pro',
                    messages: [
                        { role: 'system', content: 'You are an elite market researcher.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.2,
                })
            });
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error(`Perplexity error for ${agentType}:`, error);
            return `[Error] Failed to fetch research from Perplexity for ${agentType}.`;
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

// OpenAI Implementation for Report Synthesis
export class OpenAIProvider implements AIProvider {
    private apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || '4nWUcLljq5QHOD27uZSOr86S9XiUqkjzcCNinit1saNamNvq';

    async runMarketSizing(params: ResearchParams): Promise<string> { return "Research handled by Perplexity."; }
    async runSegmentation(params: ResearchParams): Promise<string> { return "Research handled by Perplexity."; }
    async runTrends(params: ResearchParams): Promise<string> { return "Research handled by Perplexity."; }
    async runTechAnalysis(params: ResearchParams): Promise<string> { return "Research handled by Perplexity."; }
    async runCompetitiveAnalysis(params: ResearchParams): Promise<string> { return "Research handled by Perplexity."; }
    async runFinancialModel(params: ResearchParams): Promise<string> { return "Research handled by Perplexity."; }

    async synthesizeReport(results: { id: string, data: string }[], params: ResearchParams): Promise<string> {
        const fullContent = results.map(r => `Agent [${r.id}]:\n${r.data}`).join('\n\n');

        const prompt = `You are a Senior Industry Analyst. Synthesize the following raw research into a professional, institutional-grade market report for the ${params.subIndustry} in ${params.industry} (${params.geography}).

Research Data:
${fullContent}

Requirements:
1. Executive Summary: High-level overview and key metrics.
2. Market Dynamics: Deep dive into sizing, trends, and segments.
3. Competitive Strategy: Intelligence and landscape.
4. Strategic Outlook: 5-year projections.
5. Appendices: Sources, methodology, and assumptions.

Maintain professional formatting, clear headings, and insightful synthesis. Always output valid Markdown.`;

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        { role: 'system', content: 'You are an elite research synthesizer.' },
                        { role: 'user', content: prompt }
                    ],
                    temperature: 0.5,
                })
            });
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error("OpenAI error:", error);
            return "Failed to synthesize report with OpenAI.";
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
