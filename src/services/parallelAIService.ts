export class ParallelAIService {
    async runAgentTask(agentName: string, prompt: string): Promise<any> {
        try {
            const response = await fetch('/api/perplexity', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: prompt
                })
            });

            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(`Perplexity Proxy Error: ${response.status} - ${JSON.stringify(errData)}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error in ResearchService [${agentName}]:`, error);
            throw error;
        }
    }
}
