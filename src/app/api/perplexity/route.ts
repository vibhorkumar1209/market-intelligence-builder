import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { query } = await req.json();
        const apiKey = process.env.PERPLEXITY_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'Perplexity API key not configured' }, { status: 500 });
        }

        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'sonar-pro', // Using high-end model for thorough results
                messages: [
                    {
                        role: 'system',
                        content: 'You are an elite market intelligence researcher. Provide exhaustive, data-rich research with specific numbers, citations, and evidence. Avoid generic summaries.'
                    },
                    { role: 'user', content: query }
                ],
                temperature: 0.1,
                return_images: false,
                return_related_questions: false,
                stream: false
            })
        });

        const data = await response.json();

        // Perplexity returns completion in data.choices[0].message.content
        // We'll return it in a way that the existing service can easily parse
        return NextResponse.json({
            content: data.choices[0].message.content,
            citations: data.citations || []
        });
    } catch (error) {
        console.error('Perplexity Proxy Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
