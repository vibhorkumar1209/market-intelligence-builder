export interface ChartDataResult {
    data: any[];
    keys: string[];
    recommendedType: 'bar' | 'line' | 'pie' | 'composed';
}

export const parseMarkdownTableToChartData = (markdown: string): ChartDataResult => {
    const rows = markdown.split('\n').filter(line => line.includes('|') && !line.includes('---'));
    if (rows.length < 2) return { data: [], keys: [], recommendedType: 'bar' };

    const headerCells = rows[0].split('|').map(c => c.trim()).filter(c => c !== '');
    if (headerCells.length < 2) return { data: [], keys: [], recommendedType: 'bar' };

    // Use full header names for keys to ensure labels are correct
    const rawKeys = headerCells.slice(1);

    const data = rows.slice(1).map(row => {
        const cells = row.split('|').map(c => c.trim()).filter(c => c !== '');
        if (cells.length < 2) return null;

        const name = cells[0];
        const point: any = { name };
        let hasValidNumber = false;

        rawKeys.forEach((key, idx) => {
            if (idx + 1 < cells.length) {
                // Strip out commas, dollar signs, percentage signs etc.
                const valueStr = cells[idx + 1].replace(/[$,% ]/g, '').trim();
                const value = parseFloat(valueStr);
                if (!isNaN(value)) {
                    point[key] = value;
                    hasValidNumber = true;
                }
            }
        });

        return hasValidNumber ? point : null;
    }).filter(p => p !== null);

    // Re-extract keys that actually have data
    const validKeys = data.length > 0 ? Object.keys(data[0]).filter(k => k !== 'name') : [];

    let recommendedType: 'bar' | 'line' | 'pie' | 'composed' = 'bar';
    const keysStr = validKeys.join(' ').toLowerCase();

    // Auto-detect chart type based on content
    if (keysStr.includes('share') || keysStr.includes('%') || keysStr.includes('percentage') ||
        (data.some(d => d.name.toLowerCase().includes('tier') || d.name.toLowerCase().includes('company')) && validKeys.length === 1)) {
        recommendedType = 'pie';
    } else if ((keysStr.includes('volume') && keysStr.includes('value')) ||
        (keysStr.includes('revenue') && keysStr.includes('growth'))) {
        recommendedType = 'composed';
    } else if (data.length > 5 || data.every(d => !isNaN(parseInt(d.name.substring(0, 4))))) {
        // Line chart for time series (years, long sequences)
        recommendedType = 'line';
    }

    return { data, keys: validKeys, recommendedType };
};

