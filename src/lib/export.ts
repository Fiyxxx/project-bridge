import { Document, Paragraph, TextRun, AlignmentType, HeadingLevel, Packer } from 'docx';
import { saveAs } from 'file-saver';

export async function exportCaseNoteToDocx(caseNoteText: string, filename: string) {
  // Split the case note into sections for better formatting
  const sections = caseNoteText.split('\n\n').filter(s => s.trim());

  const paragraphs: Paragraph[] = [];

  sections.forEach((section) => {
    const lines = section.split('\n');
    lines.forEach((line, index) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        // Heading
        const text = line.replace(/\*\*/g, '');
        paragraphs.push(
          new Paragraph({
            text: text,
            heading: text.includes('CHILD') || text.includes('DEVELOPMENTAL') || text.includes('SUMMARY') || text.includes('RECOMMENDATIONS')
              ? HeadingLevel.HEADING_2
              : HeadingLevel.HEADING_3,
            spacing: { before: 240, after: 120 },
          })
        );
      } else if (line.startsWith('*') && line.endsWith('*')) {
        // Subheading
        const text = line.replace(/\*/g, '');
        paragraphs.push(
          new Paragraph({
            text: text,
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 200, after: 100 },
          })
        );
      } else if (line.trim().startsWith('---')) {
        // Separator
        paragraphs.push(
          new Paragraph({
            text: '___________________________________________________________________________',
            spacing: { before: 200, after: 200 },
          })
        );
      } else if (line.trim()) {
        // Regular text
        paragraphs.push(
          new Paragraph({
            children: [new TextRun(line)],
            spacing: { after: 120 },
          })
        );
      }
    });
  });

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: paragraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
}
