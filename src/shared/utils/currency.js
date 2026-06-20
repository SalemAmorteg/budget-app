// shared/utils/currency.ts
export const CURRENCY_SYMBOLS = {
    'COP': '$',
    'USD': 'US$',
    'EUR': '€',
};
export function formatCurrency(amount, currency = 'COP', showSymbol = true) {
    const symbol = showSymbol ? CURRENCY_SYMBOLS[currency] : '';
    const locale = currency === 'COP' ? 'es-CO' : 'en-US';
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        maximumFractionDigits: 0,
    }).format(amount).replace(currency, symbol).trim();
}
export function parseCurrency(value) {
    return parseFloat(value.replace(/[^\d.-]/g, ''));
}
export function getCurrencySymbol(currency) {
    return CURRENCY_SYMBOLS[currency];
}
