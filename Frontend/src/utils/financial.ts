/**
 * Financial Precision & Bangladesh Local Tax / Currency Utilities
 * NirmanERP Bangladesh Edition
 */

/**
 * Format currency in Bangladeshi Taka (BDT ৳) with commas or Crore / Lac notation
 */
export function formatBDT(amount: number, showSymbol = true): string {
  const rounded = Math.round((amount + Number.EPSILON) * 100) / 100;
  const formatted = new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(rounded);

  return showSymbol ? `৳ ${formatted}` : formatted;
}

/**
 * Compact BDT format for high-value Real Estate figures (e.g. 2.45 Cr, 85 Lac)
 */
export function formatCompactBDT(amount: number): string {
  if (amount >= 10000000) {
    const crore = amount / 10000000;
    return `৳ ${crore.toFixed(2)} Crore`;
  } else if (amount >= 100000) {
    const lac = amount / 100000;
    return `৳ ${lac.toFixed(2)} Lac`;
  }
  return formatBDT(amount);
}

/**
 * High-precision exact monetary addition to prevent floating-point drift
 */
export function addMoney(a: number, b: number): number {
  return Math.round((a + b + Number.EPSILON) * 100) / 100;
}

/**
 * High-precision exact monetary subtraction
 */
export function subtractMoney(a: number, b: number): number {
  return Math.round((a - b + Number.EPSILON) * 100) / 100;
}

/**
 * High-precision monetary multiplication
 */
export function multiplyMoney(amount: number, factor: number): number {
  return Math.round((amount * factor + Number.EPSILON) * 100) / 100;
}

/**
 * Subcontractor Running Account (RA) Bill Breakdown Calculation
 * Capping Retention (default 10%), AIT Withholding (default 5% under BD IT Rule), VAT (Mushak)
 */
export interface RABillBreakdown {
  grossAmount: number;
  retentionPct: number;
  retentionAmount: number;
  aitPct: number;
  aitAmount: number;
  vatPct: number;
  vatAmount: number;
  netPayable: number;
}

export function calculateRABillBreakdown(
  grossAmount: number,
  retentionPct = 10,
  aitPct = 5,
  vatPct = 0
): RABillBreakdown {
  const gross = Math.max(0, grossAmount);
  const retentionAmount = multiplyMoney(gross, retentionPct / 100);
  const aitAmount = multiplyMoney(gross, aitPct / 100);
  const vatAmount = multiplyMoney(gross, vatPct / 100);
  
  const netPayable = subtractMoney(
    addMoney(gross, vatAmount),
    addMoney(retentionAmount, aitAmount)
  );

  return {
    grossAmount: gross,
    retentionPct,
    retentionAmount,
    aitPct,
    aitAmount,
    vatPct,
    vatAmount,
    netPayable,
  };
}

/**
 * Bangladesh NBR Income Tax (AIT / TDS) Withholding Matrix (IT Rules 2023)
 */
export function getBDAitWithholdingRate(vendorType: string, hasTin: boolean): number {
  switch (vendorType) {
    case 'Material Supplier':
      return hasTin ? 3.0 : 5.0; // 3% with TIN, 5% without TIN
    case 'Subcontractor':
      return hasTin ? 5.0 : 7.5; // 5% with TIN, 7.5% without TIN
    case 'Equipment Vendor':
      return hasTin ? 5.0 : 7.0;
    case 'Service Provider':
      return hasTin ? 10.0 : 15.0;
    default:
      return 5.0;
  }
}
