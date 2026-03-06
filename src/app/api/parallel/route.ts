import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const apiKey = process.env.PARALLEL_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ error: 'Parallel API key not configured' }, { status: 500 });
        }

        const response = await fetch('https://api.parallel.ai/v1/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(body)
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Parallel Proxy Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
