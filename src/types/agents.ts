import { ResearchParams } from './index';

export interface AgentResult {
    id: string;
    data: any;
    insights: string[];
}

export interface MarketSizingData {
    historicalData: { year: number; value: number; unit: string }[];
    forecastData: { year: number; value: number; unit: string; scenario: 'base' | 'bull' | 'bear' }[];
    cagrByPeriod: { period: string; cagr: string }[];
    topDownEstimate: any;
    bottomUpEstimate: any;
    reconciliationNote: string;
    insights: string[];
}

export interface SegmentationData {
    dimensions: string[];
    segmentData: {
        dimension: string;
        segment: string;
        values: { year: number; value: number }[];
        share: string;
        cagr: string;
    }[];
    insights: string[];
}

export interface Trend {
    category: 'Demand' | 'Supply' | 'Technology' | 'Macro' | 'Commercial' | 'Market';
    trendName: string;
    trigger: string;
    scenarioType: 'Structural' | 'Cyclical' | 'Secular' | 'Disruptive';
    timelineToImpact: string;
    impactMagnitude: 'High' | 'Medium' | 'Low';
    affectedSegments: string[];
    quantifiedImpact: string;
    examples: string[];
    analystNote: string;
}

export interface TechData {
    traditional: {
        techName: string;
        useCase: string;
        maturityLevel: string;
        adoptionRate: string;
        costStructure: string;
        limitations: string;
        displacementRisk: string;
        keyProviders: { name: string; marketPosition: string; keyProduct: string }[];
    }[];
    emerging: {
        techName: string;
        useCase: string;
        trlLevel: string;
        expectedCommercializationYear: string;
        costCurveProjection: string;
        adoptionBarriers: string;
        firstMoverAdvantage: string;
        regionalLeaders: { region: string; leadingPlayers: string[] }[];
        impactOnValueChain: string;
    }[];
    insights: string[];
}

export interface CompetitiveData {
    players: {
        company: string;
        revenue: string;
        marketShare: string;
        hq: string;
        businessModel: string;
        keyStrengths: string[];
        keyVulnerabilities: string[];
        recentStrategicMoves: string[];
        pricingTier: 'Premium' | 'Mid' | 'Value';
        growthStrategy: string;
        analystVerdict: string;
    }[];
    insights: string[];
}

export interface FinancialModelData {
    tam: { value: string; methodology: string; assumptions: string[] };
    sam: { value: string; filteringCriteria: string };
    som: { value: string; captureRationale: string };
    scenarios: {
        type: 'Base' | 'Bull' | 'Bear';
        forecast: { year: number; revenue: number; cagr: string; margin: string }[];
        triggers: string[];
    }[];
    sensitivity: {
        variable: string;
        impact10: string;
        impact20: string;
    }[];
    insights: string[];
}
