export const AGENT_SCHEMAS = {
  resolver: `{
      "market_title": string,
      "market_type": "equipment | materials | components | services | hybrid",
      "measurement_framework": { "volume_unit": string, "value_basis": string, "primary_currency": string },
      "data_source_landscape": {
        "industry_associations": [{ "name": string, "relevance": string }],
        "government_databases": [{ "name": string, "url": string }],
        "data_availability_assessment": { "overall_rating": number, "critical_data_gaps": string[] }
      }
    }`,
  taxonomy: `{
      "definitions": { "product": string, "geo_regions": string[] },
      "segmentation": {
        "primary_axis": { "name": string, "segments": [{ "name": string, "definition": string }] },
        "secondary_axis": { "name": string, "segments": [{ "name": string, "definition": string }] },
        "supplier_axis": { "tier_1": string[], "tier_2": string[] }
      }
    }`,
  anchors_volume: `[{ "source_name": string, "data_point": string, "unit": string, "period": string, "credibility": number }]`,
  anchors_pricing: `[{ "source_name": string, "data_point": string, "unit": string, "period": string, "credibility": number }]`,
  sizing: `{
      "consolidated_market": [{ "period": string, "volume": number, "value": number }],
      "supplier_breakdown": [{ "supplier": string, "share": string, "annual_volume": number }],
      "forecast": [{ "year": string, "growth_pct": string }]
    }`,
  methodology: `{
      "approach_overview": string,
      "segment_logic": [{ "segment": string, "logic": string, "confidence": number }],
      "error_margins": { "overall": string }
    }`
};
