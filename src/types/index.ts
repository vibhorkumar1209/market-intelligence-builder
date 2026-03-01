export type IndustryCategory =
    | 'Technology'
    | 'Healthcare'
    | 'Energy'
    | 'Financial Services'
    | 'Manufacturing'
    | 'Consumer Goods'
    | 'Automotive'
    | 'Telecom'
    | 'Agriculture'
    | 'Custom';

export type OutputType =
    | 'Full Industry Report'
    | 'Executive Summary Only'
    | 'Financial Model Only'
    | 'Segmentation Deep Dive'
    | 'Tech Intelligence Only';

export interface ResearchParams {
    industry: IndustryCategory;
    customIndustry?: string;
    subIndustry: string;
    geography: string;
    historicalYears: number;
    forecastYears: number;
    outputType: OutputType;
}

export interface AgentStatus {
    id: string;
    name: string;
    status: 'idle' | 'running' | 'completed' | 'error';
    progress: number;
}
