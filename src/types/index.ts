export type MarketType = 'equipment' | 'materials' | 'components' | 'services' | 'hybrid';

export interface ResearchParams {
    industry: string;
    subCategory?: string;
    geography: string;

    // Advanced Settings
    baseYearOverride?: string;
    forecastQuarters?: number;
    geographicGranularity?: 'Region only' | 'State / Province' | 'City tier';
    supplierDetail?: 'Top 5 + Others' | 'Top 8 + Others' | 'Top 10+ (deep competitive view)';
    dualCurrency?: boolean;
    excludeSyndicatedSources?: boolean;
    additionalContext?: string;
}

export interface AgentStatus {
    id: string;
    name: string;
    status: 'idle' | 'running' | 'completed' | 'error';
    progress: number;
}
