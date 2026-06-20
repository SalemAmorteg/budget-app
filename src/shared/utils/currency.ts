// shared/utils/currency.ts
export const CURRENCY_SYMBOLS = {
  'COP': '$',
  'USD': 'US$',
  'EUR': '€',
} as const;

export function formatCurrency(
  amount: number,
  currency: 'COP' | 'USD' | 'EUR' = 'COP',
  showSymbol = true
): string {
  const symbol = showSymbol ? CURRENCY_SYMBOLS[currency] : '';
  const locale = currency === 'COP' ? 'es-CO' : 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 0,
  }).format(amount).replace(currency, symbol).trim();
}

export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[^\d.-]/g, ''));
}

export function getCurrencySymbol(currency: 'COP' | 'USD' | 'EUR'): string {
  return CURRENCY_SYMBOLS[currency];
}