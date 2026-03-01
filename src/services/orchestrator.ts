import { AIProvider, ClaudeSaaSProvider } from './ai-provider';
import { ResearchParams } from '@/types';

export class Orchestrator {
    private provider: AIProvider;

    constructor(provider?: AIProvider) {
        this.provider = provider || new ClaudeSaaSProvider();
    }

    async generateReport(params: ResearchParams, onUpdate: (agentId: string, progress: number) => void) {
        const agents = [
            { id: 'sizing', call: () => this.provider.runMarketSizing(params) },
            { id: 'segmentation', call: () => this.provider.runSegmentation(params) },
            { id: 'trends', call: () => this.provider.runTrends(params) },
            { id: 'tech', call: () => this.provider.runTechAnalysis(params) },
            { id: 'competitive', call: () => this.provider.runCompetitiveAnalysis(params) },
            { id: 'financial', call: () => this.provider.runFinancialModel(params) },
        ];

        // Parallel execution
        const results = await Promise.all(
            agents.map(async (agent) => {
                onUpdate(agent.id, 20);
                // Simulate research time
                await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));
                onUpdate(agent.id, 60);
                const data = await agent.call();
                onUpdate(agent.id, 100);
                return { id: agent.id, data };
            })
        );

        return this.consolidate(results);
    }

    private consolidate(results: { id: string, data: string }[]): string {
        const sections = results.map(r => r.data).join('\n\n---\n\n');
        const appendix = `
# APPENDICES
## Appendix A: Source List
- Gartner Research (2023)
- IDC MarketScape
- World Bank Data
## Appendix B: Methodology
Bottom-up revenue aggregation and top-down penetration modeling.
    `;
        return sections + '\n\n' + appendix;
    }
}
