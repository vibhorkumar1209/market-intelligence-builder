export class OpenAIService {
    async synthesize(prompt: string, context: any): Promise<string> {
        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ action: 'synthesize', prompt })
        });
        const data = await response.json();
        return data.content || '';
    }

    async enhanceInsights(rawResult: any, agentType: string): Promise<string[]> {
        const prompt = `You are a Senior Strategic Analyst. Review the following research data for the ${agentType} agent:
        ${JSON.stringify(rawResult)}
        
        TASK:
        1. Add expert analyst commentary.
        2. Identify non-obvious patterns.
        3. Flag anomalies or data gaps.
        4. Write 3-5 forward-looking strategic implications.
        
        RESTRICTION: Every insight MUST be quantified and specific. No generic filler.
        Return ONLY a JSON array of strings in a field called "insights".`;

        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'enrich',
                prompt,
                response_format: { type: 'json_object' }
            })
        });

        const data = await response.json();
        try {
            const parsed = JSON.parse(data.content);
            return parsed.insights || [];
        } catch {
            return [];
        }
    }

    async structureData(rawSearchData: any, agentType: string, schemaDescription: string): Promise<any> {
        const prompt = `You are a Precise Data Extraction Agent. I will provide you with a blob of raw search results (JSON).
        
        TASK:
        Extract every available data point, number, and specific example to populate the following schema:
        ${schemaDescription}
        
        DATA:
        ${JSON.stringify(rawSearchData).substring(0, 15000)} // Truncate to avoid context limit but keep enough
        
        RULES:
        1. If a value is missing, use "N/A" or reasonable estimates based on the data provided.
        2. PRIORITIZE QUANTIFIED DATA (USD, %, counts).
        3. DO NOT ADD GENERIC PROSE.
        4. Return ONLY VALID JSON following the schema precisely.`;

        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'enrich', // Reusing the enrich action for now or adding a new one
                prompt,
                response_format: { type: 'json_object' }
            })
        });

        const data = await response.json();
        try {
            return JSON.parse(data.content);
        } catch (err) {
            console.error("Failed to parse structured data:", err);
            return { error: "Failed to parse data", original: rawSearchData };
        }
    }

    async checkQuality(text: string): Promise<{ score: number; suggestions: string[]; refinedText: string }> {
        const prompt = `You are a Report Quality Gatekeeper. Scan the following report text for generic filler or lack of quantification.
        
        Text: ${text}
        
        TASK:
        1. Rate quality from 0-100.
        2. Replace generic segments with quantified statements.
        3. Return as JSON: { "score": number, "suggestions": string[], "refinedText": string }`;

        const response = await fetch('/api/openai', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'quality',
                prompt,
                response_format: { type: 'json_object' }
            })
        });

        const data = await response.json();
        return JSON.parse(data.content || '{}');
    }
}
