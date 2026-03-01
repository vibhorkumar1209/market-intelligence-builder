import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { jsPDF } from 'jspdf';

export const exportToDocx = async (title: string, content: string) => {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    text: title,
                    heading: HeadingLevel.HEADING_1,
                }),
                new Paragraph({
                    children: [
                        new TextRun(content),
                    ],
                }),
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${title.replace(/\s+/g, '_')}.docx`);
};

export const exportToPdf = (title: string, content: string) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text(title, 20, 20);
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(content, 170);
    doc.text(splitText, 20, 40);
    doc.save(`${title.replace(/\s+/g, '_')}.pdf`);
};
