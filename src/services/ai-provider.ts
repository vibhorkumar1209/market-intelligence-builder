import { ResearchParams } from '@/types';

export interface AIProvider {
    runMarketSizing(params: ResearchParams): Promise<string>;
    runSegmentation(params: ResearchParams): Promise<string>;
    runTrends(params: ResearchParams): Promise<string>;
    runTechAnalysis(params: ResearchParams): Promise<string>;
    runCompetitiveAnalysis(params: ResearchParams): Promise<string>;
    runFinancialModel(params: ResearchParams): Promise<string>;
}

// Real implementation for Claude SaaS logic via local bridge
export class ClaudeSaaSProvider implements AIProvider {
    private bridgeUrl = 'http://localhost:8000/research';

    private async callBridge(agentType: string, params: ResearchParams): Promise<string> {
        const prompt = `Research task for ${agentType} agent. Industry: ${params.industry}, Sub-industry: ${params.subIndustry}, Geography: ${params.geography}, Timeframe: ${params.historicalYears}-${params.forecastYears}.`;

        try {
            const response = await fetch(this.bridgeUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ agent_type: agentType, prompt })
            });
            const data = await response.json();
            return data.content || "No research data returned.";
        } catch (error) {
            console.error(`Bridge error for ${agentType}:`, error);
            return `[Error] Could not connect to the local SaaS bridge. Please ensure 'python3 server/bridge.py' is running.`;
        }
    }

    async runMarketSizing(params: ResearchParams): Promise<string> {
        return this.callBridge('Market Sizing', params);
    }
    async runSegmentation(params: ResearchParams): Promise<string> {
        return this.callBridge('Segmentation', params);
    }
    async runTrends(params: ResearchParams): Promise<string> {
        return this.callBridge('Trends', params);
    }
    async runTechAnalysis(params: ResearchParams): Promise<string> {
        return this.callBridge('Technology', params);
    }
    async runCompetitiveAnalysis(params: ResearchParams): Promise<string> {
        return this.callBridge('Competitive', params);
    }
    async runFinancialModel(params: ResearchParams): Promise<string> {
        return this.callBridge('Financial', params);
    }
}
