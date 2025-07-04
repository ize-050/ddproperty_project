/**
 * Utility functions for currency conversion and formatting
 */
import { getCookie } from 'cookies-next';

// Map locale to currency code (fallback if no currency cookie is set)
const localeToCurrency = {
  'th': 'THB',
  'en': 'USD',
  'zh': 'CNY',
  'ru': 'RUB'
};

// Default exchange rates (fallback if API fails)
const defaultRates = {
  'THB': 1,
  'USD': 0.030640,
  'CNY': 0.20,
  'RUB': 2.50,
  'GBP': 0.023,
  'EUR': 0.027
};

// Currency symbols
export const currencySymbols = {
  'THB': '฿',
  'USD': '$',
  'CNY': '¥',
  'RUB': '₽',
  'GBP': '£',
  'EUR': '€'
};

/**
 * Get selected currency code
 * @param {string} locale - Current locale (th, en, zh, ru) as fallback
 * @returns {string} Currency code
 */
export const getSelectedCurrency = (locale) => {
  // First check if user has selected a specific currency
  const cookieCurrency = typeof window !== 'undefined' ? getCookie('currency') : null;

  // If cookie exists and is a valid currency, use it
  if (cookieCurrency && currencySymbols[cookieCurrency]) {
    return cookieCurrency;
  }

  // Otherwise fall back to locale-based currency
  return localeToCurrency[locale] || 'THB';
};

/**
 * Get currency symbol for a locale or selected currency
 * @param {string} locale - Current locale (th, en, zh, ru) as fallback
 * @returns {string} Currency symbol
 */
export const localeToCurrencySymbol = (locale) => {
  const currency = getSelectedCurrency(locale);
  return currencySymbols[currency] || '฿';
};

// Cache for currency rates to avoid multiple API calls
let currencyRatesCache = null;
let lastFetchTime = null;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Fetch currency rates from API
 * @returns {Promise<Object>} Object with currency codes as keys and rates as values
 */
export const fetchCurrencyRates = async () => {
  // Check if we have cached rates that are still valid
  const now = Date.now();
  if (currencyRatesCache && lastFetchTime && (now - lastFetchTime < CACHE_DURATION)) {
    return currencyRatesCache;
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/currencies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.NEXT_PUBLIC_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch currency rates');
    }

    const data = await response.json();

    // Format the rates into a more usable object
    const rates = {};
    data.data.forEach(curr => {
      rates[curr.currency] = parseFloat(curr.rate);
    });

    // Update cache
    currencyRatesCache = rates;
    lastFetchTime = now;

    return rates;
  } catch (error) {
    console.error('Error fetching currency rates:', error);
    // Fallback to default rates if API fails
    return defaultRates;
  }
};

/**
 * Convert price from THB to target currency
 * @param {number} priceInTHB - Original price in THB
 * @param {string} locale - Current locale (th, en, zh, ru) as fallback
 * @param {Object} rates - Object with currency rates
 * @returns {number} Converted price
 */
export const convertPrice = (priceInTHB, locale, rates = defaultRates) => {
  const targetCurrency = getSelectedCurrency(locale);

  // If target is THB, no conversion needed
  if (targetCurrency === 'THB') {
    return priceInTHB;
  }

  const rate = rates[targetCurrency] || defaultRates[targetCurrency];

  return priceInTHB * rate;
};

/**
 * Format price with locale-specific formatting and currency symbol
 * @param {number} price - Price to format
 * @param {string} locale - Current locale (th, en, zh, ru)
 * @param {boolean} showCurrencySymbol - Whether to include currency symbol
 * @returns {string} Formatted price
 */
export const formatPrice = (price, locale = 'th', showCurrencySymbol = true) => {
  if (price === null || price === undefined || isNaN(price)) {
    return '-';
  }

  const targetCurrency = getSelectedCurrency(locale);
  const symbol = showCurrencySymbol ? currencySymbols[targetCurrency] : '';

  // Format number with thousands separator and no decimal places
  let formattedPrice;

  // Select number formatting based on currency
  const formatLocale =
    targetCurrency === 'THB' ? 'th-TH' :
      targetCurrency === 'USD' ? 'en-US' :
        targetCurrency === 'CNY' ? 'zh-CN' :
          targetCurrency === 'RUB' ? 'ru-RU' :
            targetCurrency === 'GBP' ? 'en-GB' :
              targetCurrency === 'EUR' ? 'de-DE' : 'th-TH';

  formattedPrice = new Intl.NumberFormat(formatLocale, {
    maximumFractionDigits: 0
  }).format(price);

  return `${symbol}${formattedPrice}`;
};

/**
 * Convert and format price from THB to target currency based on locale
 * @param {number} priceInTHB - Original price in THB
 * @param {string} locale - Current locale (th, en, zh, ru)
 * @param {boolean} showCurrencySymbol - Whether to include currency symbol
 * @returns {string} Formatted price in target currency
 */
export const convertAndFormatPrice = async (priceInTHB, locale = 'th', showCurrencySymbol = true) => {
  if (priceInTHB === null || priceInTHB === undefined || isNaN(priceInTHB)) {
    return '-';
  }

  // Get latest rates
  const rates = await fetchCurrencyRates();

  // Convert price
  const convertedPrice = convertPrice(priceInTHB, locale, rates);

  // Format and return
  return formatPrice(convertedPrice, locale, showCurrencySymbol);
};

/**
 * Non-async version that uses default rates (for SSR and places where async isn't suitable)
 */
export const convertAndFormatPriceSync = (priceInTHB, locale = 'th', showCurrencySymbol = true) => {
  if (priceInTHB === null || priceInTHB === undefined || isNaN(priceInTHB)) {
    return '-';
  }

  // Convert price using default rates
  const convertedPrice = convertPrice(priceInTHB, locale, defaultRates);

  // Format and return
  return formatPrice(convertedPrice, locale, showCurrencySymbol);
};
