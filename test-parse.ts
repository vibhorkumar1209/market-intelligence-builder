import { parseMarkdownTableToChartData } from './src/utils/chart-parser';

const markdown = `
| Segment | Value ($B) | Market Share (%) |
|---|---|---|
| Data 1 | 100 | 45% |
| Data 2 | 120 | 55% |
`;

console.log(parseMarkdownTableToChartData(markdown));
