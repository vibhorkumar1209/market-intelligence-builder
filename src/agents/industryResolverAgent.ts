import { ResearchParams } from '@/types';

export const runIndustryResolverAgent = async (params: ResearchParams, callParallel: (prompt: string) => Promise<string>) => {
    const prompt = `
You are a senior market research strategist. Your task is to take a broad industry name, an optional 
sub-category, and a geography, and resolve them into a precise, actionable market 
scope that can be researched and quantified.

INDUSTRY: ${params.industry}
SUB-CATEGORY: ${params.subCategory || 'None provided'}
GEOGRAPHY: ${params.geography}

Determine:
1. The EXACT product scope (what's in, what's out)
2. The MARKET TYPE — which determines the entire measurement framework:
   - EQUIPMENT markets (gensets, excavators, pumps) → measure in UNITS sold
   - MATERIALS markets (chemicals, polymers, metals) → measure in MT or KL produced/consumed
   - COMPONENTS markets (bearings, gaskets, filters) → measure in UNITS or value
   - SERVICES markets (MRO, testing, consulting) → measure in revenue only
   - HYBRID markets (multiple measurement units needed)
3. The appropriate UNIT OF MEASURE, VALUE BASIS, and CURRENCY
4. The FISCAL YEAR convention for the geography
5. The PRIMARY DATA SOURCE landscape — which associations, government databases,
   and listed companies are the go-to sources for THIS industry in THIS geography
6. The natural SEGMENTATION AXES for this market type

GEOGRAPHY INTELLIGENCE:
- For India: Use April-March fiscal year, INR, identify relevant Ministry data (MoSPI, DGCI&S)
- For US: Use January-December calendar year, USD, identify Census/BLS/BEA data
- For China: Use January-December, CNY, identify NBS/MIIT data
- For EU: Use January-December, EUR, identify Eurostat/PRODCOM data
- For Global: Use January-December, USD, identify UN Comtrade/ITC TradeMap data

CRITICAL RULES:
- If sub-category is provided, scope DOWN to that specific product
- If sub-category is blank, scope to the FULL industry but identify the top 5-8 product sub-segments
- Always check: can this market actually be sized with publicly available data?

Respond in JSON with the following structure:
{
  "resolved_scope": {
    "market_title": "string",
    "product_scope": { "included": [], "excluded": [] },
    "market_type": "equipment | materials | components | services | hybrid",
    "measurement_framework": { "volume_unit": "string", "value_basis": "string", "primary_currency": "string" },
    "time_framework": { "fiscal_year_convention": "string", "base_year": "string" },
    "segmentation_strategy": { "primary_axis": { "axis_name": "string", "axis_type": "string" } },
    "data_source_landscape": { "industry_associations": [], "government_databases": [], "listed_companies": [], "data_availability_assessment": { "overall_rating": 1-5 } }
  }
}
`;

    return await callParallel(prompt);
};
