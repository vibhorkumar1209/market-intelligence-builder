import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, AlignmentType, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

export class DocxBuilder {
    async generate(reportData: { content: string; qualityScore: number; data: any }, params: any) {
        const doc = new Document({
            sections: [{
                properties: {},
                children: [
                    // Cover Page
                    new Paragraph({
                        text: "MARKET INTELLIGENCE REPORT",
                        heading: HeadingLevel.TITLE,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        text: `${params.industry} | ${params.subIndustry} | ${params.geography}`,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        text: `Time Horizon: ${params.historicalYears} - ${params.forecastYears}`,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({
                        text: `Generated on: ${new Date().toLocaleDateString()}`,
                        alignment: AlignmentType.CENTER,
                    }),
                    new Paragraph({ text: "\n\n" }),

                    // Table of Contents Placeholder
                    new Paragraph({ text: "Table of Contents", heading: HeadingLevel.HEADING_1 }),

                    // Main Content (Simplified for now, would parse Markdown into docx elements)
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: reportData.content,
                            }),
                        ],
                    }),

                    // Appendices
                    new Paragraph({ text: "APPENDICES", heading: HeadingLevel.HEADING_1, pageBreakBefore: true }),
                    // ... Source tables would go here
                ],
            }],
        });

        const blob = await Packer.toBlob(doc);
        saveAs(blob, `MarketIntelligence_${params.subIndustry.replace(/\s+/g, '_')}.docx`);
    }
}
