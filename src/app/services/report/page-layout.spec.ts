import {
  isThermalPageFormat,
  normalizePageFormat,
  normalizePageOrientation,
  pagePreviewAspectRatio
} from './page-layout';

describe('page layout catalog', () => {
  it('keeps A4 portrait as the compatibility default', () => {
    expect(normalizePageFormat(undefined)).toBe('A4');
    expect(normalizePageOrientation(undefined)).toBe('PORTRAIT');
  });

  it('identifies thermal formats', () => {
    expect(isThermalPageFormat('THERMAL_80MM')).toBeTrue();
    expect(isThermalPageFormat('A4')).toBeFalse();
  });

  it('swaps the preview proportion in landscape', () => {
    expect(pagePreviewAspectRatio('A4', 'PORTRAIT')).toBe('210 / 297');
    expect(pagePreviewAspectRatio('A4', 'LANDSCAPE')).toBe('297 / 210');
  });
});
