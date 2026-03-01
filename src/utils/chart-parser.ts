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
        const cells = row.split('|').map(c => c.trim()).filter(Boolean);
        return {
            name: cells[0],
            value: parseFloat(cells[1].replace(/[^0-9.-]/g, '')) || 0
        };
    });
};
