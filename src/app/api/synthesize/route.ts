import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { results, params } = await req.json();
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
        }

        const fullContent = results.map((r: any) => `Agent [${r.id}]:\n${r.data}`).join('\n\n');

        const prompt = `You are a Tier-1 Management Consultant (ex-McKinsey/Bain) and Investment Analyst. 
Synthesize the RAW research data into a MASTER INVESTMENT-QUALITY INDUSTRY REPORT.

THEMATIC INDUSTRY: ${params.industry}
SUB-DOMAIN: ${params.subIndustry}
GEOGRAPHY: ${params.geography}
TIME HORIZON: ${params.historicalYears} to ${params.forecastYears}

---
RAW RESEARCH DATA FROM AGENTS:
${fullContent}
---

STRICT REPORT STRUCTURE (FOLLOW EXACTLY):

1. EXECUTIVE SUMMARY
   - High-level investment thesis.
   - Key market metrics (Size, Growth, CAGR).

2. MARKET DEFINITION & SCOPE
   - Definitions of TAM, SAM, SOM in the context of ${params.subIndustry}.
   - Boundaries of the research.

3. MARKET SIZE ANALYSIS
   - [TABLE]: TAM/SAM/SOM 10-year projections.
   - [INSIGHTS]: 3-5 bullet points on growth drivers.

4. MARKET SEGMENTATION
   - [TABLES]: Breakdown by Application, Product, and Region.
   - [INSIGHTS]: 3-5 bullet points on high-growth segments.

5. MARKET TRENDS
   - [TABLE ONLY]: Trend Name | Impact (1-10) | Description | Strategic Move.
   - Categorized by Demand, Supply, Tech, and Macro.

6. TECHNOLOGY TRENDS
   - [TABLES]: Traditional Tech vs. Emerging Tech.
   - Adoption maturity and disruptive potential.

7. COMPETITIVE LANDSCAPE
   - [TABLE]: Key Players | Estimated Share | Strategic Focus.
   - [INSIGHTS]: Competitive intensity and SWOT themes.

8. FINANCIAL MODEL & FORECAST
   - [TABLE]: 10-Year Revenue Forecast (Base/Upside/Downside).
   - [TABLE]: Margin & Profit Simulation.
   - [INSIGHTS]: Revenue trajectory and ROI potential.

9. STRATEGIC INSIGHTS & INVESTMENT VIEW
   - Final strategic outlook and "Buy/Hold/Invest" logic.

---
🔚 EVERYTHING BELOW GOES ONLY AT THE END IN A "NOTES & APPENDICES" SECTION:

APPENDIX A: FULL SOURCE LIST
- List every URL/Source found in the raw data in a table: | Title | Publisher | Year | URL |

APPENDIX B: SOURCE CREDIBILITY
- Table: | Source | Type | Credibility Score (1-10) | Justification |

APPENDIX C: ASSUMPTIONS & ADJUSTMENTS
- List all calculation assumptions (Currency, Inflation, Estimation logic).

APPENDIX D: METHODOLOGY
- Explain the top-down/bottom-up and web-validation framework.

CRITICAL RULES:
- NO inline citations in the main sections.
- NO source mentions in the body.
- NO raw developer talk.
- Every table MUST be followed by 3-5 "Key Strategic Insights" bullets.
- Maintain a clean, institutional, authoritative tone.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
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
        return NextResponse.json(data);
    } catch (error) {
        console.error('API Synthesis Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
