import { ResearchParams } from '@/types';

export interface AIProvider {
    runMarketSizing(params: ResearchParams): Promise<string>;
    runSegmentation(params: ResearchParams): Promise<string>;
    runTrends(params: ResearchParams): Promise<string>;
    runTechAnalysis(params: ResearchParams): Promise<string>;
    runCompetitiveAnalysis(params: ResearchParams): Promise<string>;
    runFinancialModel(params: ResearchParams): Promise<string>;
}

// Initial Mock implementation for Claude SaaS logic
export class ClaudeSaaSProvider implements AIProvider {
    async runMarketSizing(params: ResearchParams): Promise<string> {
        return `### Market Size for ${params.subIndustry}\nEstimated at $250B with a CAGR of 15%...`;
    }
    async runSegmentation(params: ResearchParams): Promise<string> {
        return `### Segmentation Table\nApplication | Growth | Adoption...`;
    }
    async runTrends(params: ResearchParams): Promise<string> {
        return `### Trends & Barries\nTrigger | Impact | Scenario...`;
    }
    async runTechAnalysis(params: ResearchParams): Promise<string> {
        return `### Technology Intelligence\nTraditional vs Emerging...`;
    }
    async runCompetitiveAnalysis(params: ResearchParams): Promise<string> {
        return `### Competitive Landscape\nTop Players | Market Share...`;
    }
    async runFinancialModel(params: ResearchParams): Promise<string> {
        return `### TAM / SAM / SOM\nProjections for 5 years...`;
    }
}
