import { Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';

// Font chuẩn văn bản hành chính VN: Times New Roman 13-14pt (theo Nghị định 30/2020/NĐ-CP)
export const FONT = 'Times New Roman';

export const tieuDeChinh = (text: string) =>
  new Paragraph({
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text, bold: true, size: 30, font: FONT })],
  });

export const tieuDeMuc = (text: string) =>
  new Paragraph({
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 26, font: FONT })],
  });

export const tieuDeMucCon = (text: string) =>
  new Paragraph({
    spacing: { before: 120, after: 60 },
    indent: { left: 200 },
    children: [new TextRun({ text, bold: true, italics: true, size: 24, font: FONT })],
  });

export const vanBanThuong = (text: string, opts: { indent?: boolean; bold?: boolean; italics?: boolean } = {}) =>
  new Paragraph({
    spacing: { after: 100 },
    indent: opts.indent ? { left: 300 } : undefined,
    children: [new TextRun({ text, size: 24, font: FONT, bold: opts.bold, italics: opts.italics })],
  });

export const gachDau = (text: string) =>
  new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 60 },
    children: [new TextRun({ text, size: 24, font: FONT })],
  });

export const dongTrong = () => new Paragraph({ text: '', spacing: { after: 100 } });

const borderNone = { style: BorderStyle.SINGLE, size: 4, color: '999999' };
export const allBorders = { top: borderNone, bottom: borderNone, left: borderNone, right: borderNone };

export function oCell(text: string, opts: { bold?: boolean; widthPct?: number; align?: (typeof AlignmentType)[keyof typeof AlignmentType] } = {}) {
  return new TableCell({
    width: opts.widthPct ? { size: opts.widthPct, type: WidthType.PERCENTAGE } : undefined,
    borders: allBorders,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [
      new Paragraph({
        alignment: opts.align,
        children: [new TextRun({ text, bold: opts.bold, size: 22, font: FONT })],
      }),
    ],
  });
}

export function taoBang(headers: string[], rows: string[][]) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({ children: headers.map((h) => oCell(h, { bold: true, align: AlignmentType.CENTER })) }),
      ...rows.map((r) => new TableRow({ children: r.map((c) => oCell(c)) })),
    ],
  });
}

export const tieuDeQuocHieu = () => [
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', bold: true, size: 24, font: FONT })],
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new TextRun({ text: 'Độc lập - Tự do - Hạnh phúc', bold: true, size: 24, font: FONT })],
  }),
];
