const text = `
Segment  | Value ($B)  | Market Share (%)  | 
Data 1  | 100  | 45%  | 
Data 2  | 120  | 55%  | 
`;

function parseMarkdownTableToChartData(markdown) {
    const rows = markdown.split('\n').filter(line => line.includes('|') && !line.includes('---'));
    if (rows.length < 2) return [];

    return rows.slice(1).map(row => {
        const cells = row.split('|').map(c => c.trim()).filter(c => c !== '');
        if (cells.length < 2) return null;

        const name = cells[0];
        const valueStr = cells[1].replace(/[$,%]/g, '').trim();
        const value = parseFloat(valueStr) || 0;

        return { name, value };
    }).filter(p => p !== null && !isNaN(p.value));
}

console.log(parseMarkdownTableToChartData(text));
