export type PageFormat =
  | 'A4' | 'A3' | 'A5' | 'A6' | 'LETTER' | 'LEGAL' | 'TABLOID' | 'LEDGER'
  | 'A0' | 'A1' | 'A2' | 'THERMAL_58MM' | 'THERMAL_80MM';

export type PageOrientation = 'PORTRAIT' | 'LANDSCAPE';

export interface PageFormatOption {
  value: PageFormat;
  label: string;
  description: string;
  widthMm: number;
  heightMm: number;
  thermal?: boolean;
}

export interface PageOrientationOption {
  value: PageOrientation;
  label: string;
  icon: string;
}

export const PAGE_FORMATS: PageFormatOption[] = [
  {value: 'A4', label: 'A4', description: '210 × 297 mm', widthMm: 210, heightMm: 297},
  {value: 'A3', label: 'A3', description: '297 × 420 mm', widthMm: 297, heightMm: 420},
  {value: 'A5', label: 'A5', description: '148 × 210 mm', widthMm: 148, heightMm: 210},
  {value: 'A6', label: 'A6', description: '105 × 148 mm', widthMm: 105, heightMm: 148},
  {value: 'LETTER', label: 'Carta', description: '216 × 279 mm', widthMm: 215.9, heightMm: 279.4},
  {value: 'LEGAL', label: 'Ofício / Legal', description: '216 × 356 mm', widthMm: 215.9, heightMm: 355.6},
  {value: 'TABLOID', label: 'Tabloide', description: '279 × 432 mm', widthMm: 279.4, heightMm: 431.8},
  {value: 'LEDGER', label: 'Ledger', description: '432 × 279 mm', widthMm: 431.8, heightMm: 279.4},
  {value: 'A0', label: 'A0', description: '841 × 1189 mm', widthMm: 841, heightMm: 1189},
  {value: 'A1', label: 'A1', description: '594 × 841 mm', widthMm: 594, heightMm: 841},
  {value: 'A2', label: 'A2', description: '420 × 594 mm', widthMm: 420, heightMm: 594},
  {value: 'THERMAL_58MM', label: 'Bobina 58 mm', description: '58 mm × altura automática', widthMm: 58, heightMm: 150, thermal: true},
  {value: 'THERMAL_80MM', label: 'Bobina 80 mm', description: '80 mm × altura automática', widthMm: 80, heightMm: 180, thermal: true}
];

export const PAGE_ORIENTATIONS: PageOrientationOption[] = [
  {value: 'PORTRAIT', label: 'Retrato', icon: 'pi pi-file'},
  {value: 'LANDSCAPE', label: 'Paisagem', icon: 'pi pi-tablet'}
];

export function normalizePageFormat(value: string | null | undefined): PageFormat {
  return PAGE_FORMATS.some(option => option.value === value) ? value as PageFormat : 'A4';
}

export function normalizePageOrientation(value: string | null | undefined): PageOrientation {
  return value === 'LANDSCAPE' ? 'LANDSCAPE' : 'PORTRAIT';
}

export function isThermalPageFormat(value: PageFormat): boolean {
  return PAGE_FORMATS.find(option => option.value === value)?.thermal === true;
}

export function pagePreviewAspectRatio(format: PageFormat, orientation: PageOrientation): string {
  const option = PAGE_FORMATS.find(item => item.value === format) ?? PAGE_FORMATS[0];
  const landscape = orientation === 'LANDSCAPE' && !option.thermal;
  const width = landscape ? option.heightMm : option.widthMm;
  const height = landscape ? option.widthMm : option.heightMm;
  return `${width} / ${height}`;
}

export function pageFormatLabel(format: PageFormat): string {
  return PAGE_FORMATS.find(option => option.value === format)?.label ?? 'A4';
}
