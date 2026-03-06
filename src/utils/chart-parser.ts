export interface ChartDataPoint {
    name: string;
    value: number;
}

export const parseMarkdownTableToChartData = (markdown: string): ChartDataPoint[] => {
    // Simple regex to find numeric values in columns
    // In a real app, this would be more robust
    const rows = markdown.split('\n').filter(line => line.includes('|') && !line.includes('---'));
    if (rows.length < 2) return [];

    // Assuming format | Month/Year | Value |
    return rows.slice(1).map(row => {
        const cells = row.split('|').map(c => c.trim()).filter(c => c !== '');
        if (cells.length < 2) return null;

        const name = cells[0];
        // Remove currency symbols, commas, and percentage signs
        const valueStr = cells[1].replace(/[$,%]/g, '').trim();
        const value = parseFloat(valueStr) || 0;

        return { name, value };
    }).filter((p): p is ChartDataPoint => p !== null && !isNaN(p.value));
};
