/**
 * Utility functions for OLX Bot
 */

/**
 * Validate search query
 */
function validateSearchQuery(query) {
    return query && 
           typeof query === 'string' && 
           query.trim().length >= 2 && 
           query.trim().length <= 100;
}

/**
 * Format search results for button display
 */
function formatResultsForButtons(results, lang = 'en') {
    if (!results || results.length === 0) {
        return [];
    }

    return results.map((result, index) => {
        const number = index + 1;
        const title = truncateText(result.title, 30);
        return {
            text: `${number}. ${title}`,
            callback_data: `detail_${index}`
        };
    });
}

/**
 * Format single result for detailed view
 */
function formatResultDetail(result, lang = 'en', domainConfig) {
    const noPrice = getTranslatedText(lang, 'no_price');
    const noLocation = getTranslatedText(lang, 'no_location');
    
    return `
**${result.title}**

💰 **Price:** ${result.price || noPrice}
📍 **Location:** ${result.location || noLocation}

🔗 **Link:** [View Details](${result.url})
    `.trim();
}

/**
 * Truncate text to specified length
 */
function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) {
        return text;
    }
    
    return text.substring(0, maxLength - 3) + '...';
}

/**
 * Format price string with currency
 */
function formatPrice(price, currency = 'zł') {
    if (!price || price === 'Brak ceny' || price === 'No price') {
        return null;
    }
    
    // Remove extra whitespace and normalize
    price = price.trim();
    
    // If price already contains currency symbol, return as is
    if (price.includes(currency) || price.includes('PLN') || price.includes('€') || 
        price.includes('$') || price.includes('₴') || price.includes('Kč') || 
        price.includes('лв') || price.includes('lei')) {
        return price;
    }
    
    // Try to extract numeric value
    const numericPrice = price.match(/[\d\s,\.]+/);
    if (numericPrice) {
        return `${numericPrice[0].trim()} ${currency}`;
    }
    
    return price;
}

/**
 * Clean and validate URL
 */
function validateUrl(url, baseUrl = 'https://www.olx.pl') {
    if (!url) return null;
    
    try {
        const urlObj = new URL(url);
        return urlObj.href;
    } catch (error) {
        // If URL is relative, try to make it absolute
        if (url.startsWith('/')) {
            try {
                return new URL(url, baseUrl).href;
            } catch (e) {
                return null;
            }
        }
        return null;
    }
}

/**
 * Sanitize text for Telegram markdown
 */
function sanitizeMarkdown(text) {
    if (!text) return '';
    
    // Escape special markdown characters
    const specialChars = ['*', '_', '[', ']', '(', ')', '~', '`', '>', '#', '+', '-', '=', '|', '{', '}', '.', '!'];
    let sanitized = text;
    
    for (const char of specialChars) {
        sanitized = sanitized.replace(new RegExp('\\' + char, 'g'), '\\' + char);
    }
    
    return sanitized;
}

/**
 * Generate user-friendly error messages based on language
 */
function getErrorMessage(error, lang = 'en') {
    if (!error) {
        return getTranslatedText(lang, 'unknown_error');
    }
    
    const message = error.message || error.toString();
    
    // Network errors
    if (message.includes('ECONNRESET') || message.includes('ECONNREFUSED') || 
        message.includes('ETIMEDOUT') || message.includes('timeout')) {
        return getTranslatedText(lang, 'network_error');
    }
    
    // Proxy errors
    if (message.includes('proxy') || message.includes('403') || message.includes('blocked')) {
        return getTranslatedText(lang, 'proxy_error');
    }
    
    // Parsing errors
    if (message.includes('parse') || message.includes('selector')) {
        return getTranslatedText(lang, 'parse_error');
    }
    
    return getTranslatedText(lang, 'general_error');
}

/**
 * Get translated text for common phrases
 */
function getTranslatedText(lang, key) {
    const translations = {
        'en': {
            'no_price': 'No price',
            'no_location': 'No location',
            'unknown_error': 'Unknown error',
            'network_error': 'Network connection error',
            'proxy_error': 'Proxy connection error',
            'parse_error': 'Data parsing error',
            'general_error': 'General error occurred'
        },
        'pl': {
            'no_price': 'Brak ceny',
            'no_location': 'Brak lokalizacji',
            'unknown_error': 'Nieznany błąd',
            'network_error': 'Błąd połączenia sieciowego',
            'proxy_error': 'Błąd połączenia proxy',
            'parse_error': 'Błąd parsowania danych',
            'general_error': 'Wystąpił błąd'
        },
        'uk': {
            'no_price': 'Без ціни',
            'no_location': 'Без місцезнаходження',
            'unknown_error': 'Невідома помилка',
            'network_error': 'Помилка мережевого з\'єднання',
            'proxy_error': 'Помилка підключення проксі',
            'parse_error': 'Помилка парсингу даних',
            'general_error': 'Сталася помилка'
        }
    };
    
    return translations[lang]?.[key] || translations['en'][key] || key;
}

/**
 * Convert relative time to readable format
 */
function formatRelativeTime(timeStr, lang = 'en') {
    if (!timeStr) return '';
    
    // This would need more sophisticated implementation based on actual OLX time formats
    // For now, return as-is
    return timeStr;
}

/**
 * Extract and clean phone numbers
 */
function extractPhoneNumber(text) {
    if (!text) return null;
    
    // Basic phone number extraction (can be improved)
    const phoneRegex = /[\+]?[\d\s\-\(\)]{9,}/g;
    const matches = text.match(phoneRegex);
    
    return matches ? matches[0].trim() : null;
}

/**
 * Chunk array into smaller arrays
 */
function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

/**
 * Debounce function for rate limiting
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Sleep function for delays
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Log function with timestamp
 */
function log(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const prefix = level.toUpperCase();
    
    let logMessage = `[${timestamp}] ${prefix}: ${message}`;
    
    if (data) {
        logMessage += ` | Data: ${JSON.stringify(data)}`;
    }
    
    console.log(logMessage);
}

/**
 * Get random user agent
 */
function getRandomUserAgent() {
    const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.101 Safari/537.36'
    ];
    
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}

module.exports = {
    validateSearchQuery,
    formatResultsForButtons,
    formatResultDetail,
    truncateText,
    formatPrice,
    validateUrl,
    sanitizeMarkdown,
    getErrorMessage,
    getTranslatedText,
    formatRelativeTime,
    extractPhoneNumber,
    chunkArray,
    debounce,
    sleep,
    log,
    getRandomUserAgent
};