import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { results, params } = await req.json();
        const apiKey = process.env.OPENAI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
        }

        const fullContent = results.map((r: any) => `Agent [${r.id}]:\n${r.data}`).join('\n\n');

        const prompt = `You are an Elite Strategy Consultant and Industry Analyst. 
Synthesize the following RAW research data into a MASTER institutional-grade market intelligence report.

THEMATIC INDUSTRY: ${params.industry}
SUB-DOMAIN: ${params.subIndustry}
GEOGRAPHY: ${params.geography}
TIME HORIZON: ${params.historicalYears} to ${params.forecastYears}

---
RAW RESEARCH DATA FROM AGENTS:
${fullContent}
---

INSTRUCTIONS:
1. DO NOT summarize into a short blurb. This must be a COMPREHENSIVE multi-section report.
2. USE MARKDOWN: Headers (##, ###), Bold text, and BULLET POINTS for readability.
3. DATA TABLES: Convert any relevant numerical data into Markdown Tables.
4. REQUIRED SECTIONS:
   ## 1. Executive Summary
      - High-level take-home message.
      - Key Market metrics (Market Size, CAGR).
   ## 2. Market Sizing & Forecasts
      - Detailed TAM/SAM/SOM breakdown.
      - 5-year growth trajectory with specific CAGR mentioned.
   ## 3. Market Segmentation
      - Deep dive into Customer, Product, and Geographic segments.
   ## 4. Market Trends & Drivers
      - Macro and micro trends affecting the industry.
   ## 5. Technology Intelligence
      - Key innovations, patents, and disruptive tech.
   ## 6. Competitive Landscape
      - Key players, market share estimated, and SWOT themes.
   ## 7. Strategic Outlook & Recommendations
      - Where the industry is heading and recommended moves.
   ## 8. Appendices
      - List of sources cited in the raw data.
      - Research methodology.

CRITICAL: If an agent provided data on a specific section, it MUST be included and expanded upon. DO NOT leave out any agent's findings.`;

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
