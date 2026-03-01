import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { agent_type, prompt } = await req.json();
        const apiKey = process.env.PERPLEXITY_API_KEY;

        if (!apiKey) {
            console.error('PERPLEXITY_API_KEY is missing from environment');
            return NextResponse.json({ error: 'Perplexity API key not configured' }, { status: 500 });
        }

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'sonar-pro',
                messages: [
                    { role: 'system', content: 'You are an elite market researcher.' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.2,
            })
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error(`Perplexity API error ${response.status}:`, errBody);
            return NextResponse.json({ error: `Perplexity API Error ${response.status}`, details: errBody }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('API Research Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
