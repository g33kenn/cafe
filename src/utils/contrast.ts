/**
 * Calculates relative luminance of a color and determines optimal text color
 * to satisfy WCAG AA contrast requirements.
 */
export function getContrastTextColor(hexColor: string = '#6F4E37'): string {
  // Clean hex
  let hex = hexColor.replace('#', '').trim();
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  if (hex.length !== 6) {
    return '#FFFFFF'; // Default safe text color
  }

  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  // sRGB to linear RGB
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const rL = toLinear(r);
  const gL = toLinear(g);
  const bL = toLinear(b);

  // Luminance formula
  const luminance = 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;

  // Threshold: if luminance > 0.42, use dark espresso text; otherwise use crisp off-white text
  return luminance > 0.42 ? '#2A1C14' : '#FDFBF7';
}

/**
 * Escapes HTML characters to prevent Stored XSS
 */
export function escapeHtml(str: string | null | undefined): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
