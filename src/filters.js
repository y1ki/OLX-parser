/**
 * Multi-domain filters and categories management
 */

const { getDomainConfig } = require('./domains');
const { getText } = require('./translations');

// Price ranges per currency
const PRICE_RANGES = {
    'zł': {
        'low': { from: 0, to: 100, label: 'do 100 zł' },
        'medium_low': { from: 100, to: 500, label: '100-500 zł' },
        'medium': { from: 500, to: 1000, label: '500-1000 zł' },
        'medium_high': { from: 1000, to: 5000, label: '1000-5000 zł' },
        'high': { from: 5000, to: 10000, label: '5000-10000 zł' },
        'very_high': { from: 10000, to: null, label: 'powyżej 10000 zł' }
    },
    '₴': {
        'low': { from: 0, to: 1000, label: 'до 1000 ₴' },
        'medium_low': { from: 1000, to: 5000, label: '1000-5000 ₴' },
        'medium': { from: 5000, to: 10000, label: '5000-10000 ₴' },
        'medium_high': { from: 10000, to: 50000, label: '10000-50000 ₴' },
        'high': { from: 50000, to: 100000, label: '50000-100000 ₴' },
        'very_high': { from: 100000, to: null, label: 'понад 100000 ₴' }
    },
    'Kč': {
        'low': { from: 0, to: 1000, label: 'do 1000 Kč' },
        'medium_low': { from: 1000, to: 5000, label: '1000-5000 Kč' },
        'medium': { from: 5000, to: 10000, label: '5000-10000 Kč' },
        'medium_high': { from: 10000, to: 50000, label: '10000-50000 Kč' },
        'high': { from: 50000, to: 100000, label: '50000-100000 Kč' },
        'very_high': { from: 100000, to: null, label: 'nad 100000 Kč' }
    },
    'лв': {
        'low': { from: 0, to: 100, label: 'до 100 лв' },
        'medium_low': { from: 100, to: 500, label: '100-500 лв' },
        'medium': { from: 500, to: 1000, label: '500-1000 лв' },
        'medium_high': { from: 1000, to: 5000, label: '1000-5000 лв' },
        'high': { from: 5000, to: 10000, label: '5000-10000 лв' },
        'very_high': { from: 10000, to: null, label: 'над 10000 лв' }
    },
    'lei': {
        'low': { from: 0, to: 500, label: 'sub 500 lei' },
        'medium_low': { from: 500, to: 2000, label: '500-2000 lei' },
        'medium': { from: 2000, to: 5000, label: '2000-5000 lei' },
        'medium_high': { from: 5000, to: 20000, label: '5000-20000 lei' },
        'high': { from: 20000, to: 50000, label: '20000-50000 lei' },
        'very_high': { from: 50000, to: null, label: 'peste 50000 lei' }
    }
};

/**
 * Create main filter keyboard
 */
function createFilterKeyboard(currentFilters = {}, lang = 'en', domainKey = 'pl') {
    const domainConfig = getDomainConfig(domainKey);
    const keyboard = [];
    
    // Filter buttons with current state
    const categoryText = currentFilters.category ? 
        `🏷️ ${getText(lang, 'btn_category')}: ${domainConfig.categories[currentFilters.category]}` : 
        `🏷️ ${getText(lang, 'btn_category')}`;
        
    const priceText = currentFilters.priceFrom || currentFilters.priceTo ? 
        `💰 ${getText(lang, 'btn_price')}: ${currentFilters.priceFrom || '0'} - ${currentFilters.priceTo || '∞'} ${domainConfig.currency}` : 
        `💰 ${getText(lang, 'btn_price')}`;
        
    const cityText = currentFilters.city ? 
        `🏙️ ${getText(lang, 'btn_city')}: ${domainConfig.cities[currentFilters.city]}` : 
        `🏙️ ${getText(lang, 'btn_city')}`;
    
    keyboard.push([{ text: categoryText, callback_data: 'filter_category' }]);
    keyboard.push([{ text: priceText, callback_data: 'filter_price' }]);
    keyboard.push([{ text: cityText, callback_data: 'filter_city' }]);
    
    // Control buttons
    keyboard.push([
        { text: getText(lang, 'btn_search_now'), callback_data: 'search_now' },
        { text: getText(lang, 'btn_reset_filters'), callback_data: 'reset_filters' }
    ]);
    
    keyboard.push([{ text: getText(lang, 'btn_back'), callback_data: 'main_menu' }]);
    
    return { reply_markup: { inline_keyboard: keyboard } };
}

/**
 * Create category selection keyboard
 */
function createCategoryKeyboard(lang = 'en', domainKey = 'pl') {
    const domainConfig = getDomainConfig(domainKey);
    const keyboard = [];
    const categories = Object.entries(domainConfig.categories);
    
    // Create rows of 2 categories each
    for (let i = 0; i < categories.length; i += 2) {
        const row = [];
        
        row.push({ 
            text: categories[i][1], 
            callback_data: `category_${categories[i][0]}` 
        });
        
        if (categories[i + 1]) {
            row.push({ 
                text: categories[i + 1][1], 
                callback_data: `category_${categories[i + 1][0]}` 
            });
        }
        
        keyboard.push(row);
    }
    
    // Back button
    keyboard.push([{ text: getText(lang, 'btn_back'), callback_data: 'back_to_filters' }]);
    
    return { reply_markup: { inline_keyboard: keyboard } };
}

/**
 * Create city selection keyboard
 */
function createCityKeyboard(lang = 'en', domainKey = 'pl') {
    const domainConfig = getDomainConfig(domainKey);
    const keyboard = [];
    const cities = Object.entries(domainConfig.cities);
    
    // Create rows of 2 cities each
    for (let i = 0; i < cities.length; i += 2) {
        const row = [];
        
        row.push({ 
            text: cities[i][1], 
            callback_data: `city_${cities[i][0]}` 
        });
        
        if (cities[i + 1]) {
            row.push({ 
                text: cities[i + 1][1], 
                callback_data: `city_${cities[i + 1][0]}` 
            });
        }
        
        keyboard.push(row);
    }
    
    // Back button
    keyboard.push([{ text: getText(lang, 'btn_back'), callback_data: 'back_to_filters' }]);
    
    return { reply_markup: { inline_keyboard: keyboard } };
}

/**
 * Create price range keyboard
 */
function createPriceKeyboard(lang = 'en', domainKey = 'pl') {
    const domainConfig = getDomainConfig(domainKey);
    const currency = domainConfig.currency;
    const ranges = PRICE_RANGES[currency] || PRICE_RANGES['zł'];
    
    const keyboard = [];
    
    // Create rows of price ranges
    for (const [key, range] of Object.entries(ranges)) {
        keyboard.push([{ 
            text: `💰 ${range.label}`, 
            callback_data: `price_${key}` 
        }]);
    }
    
    // Custom price option
    keyboard.push([{ 
        text: getText(lang, 'price_custom'), 
        callback_data: 'price_custom' 
    }]);
    
    // Back button
    keyboard.push([{ text: getText(lang, 'btn_back'), callback_data: 'back_to_filters' }]);
    
    return { reply_markup: { inline_keyboard: keyboard } };
}

/**
 * Handle filter callback queries
 */
function handleFilterCallback(callbackData, filters, lang = 'en', domainKey = 'pl') {
    const domainConfig = getDomainConfig(domainKey);
    
    if (callbackData === 'filter_category') {
        return {
            message: getText(lang, 'category_title') + '\n\n' + getText(lang, 'category_text'),
            keyboard: createCategoryKeyboard(lang, domainKey)
        };
    }
    
    if (callbackData === 'filter_city') {
        return {
            message: getText(lang, 'city_title') + '\n\n' + getText(lang, 'city_text'),
            keyboard: createCityKeyboard(lang, domainKey)
        };
    }
    
    if (callbackData === 'filter_price') {
        return {
            message: getText(lang, 'price_title') + '\n\n' + getText(lang, 'price_text'),
            keyboard: createPriceKeyboard(lang, domainKey)
        };
    }
    
    if (callbackData === 'back_to_filters') {
        return {
            message: getText(lang, 'filters_reset'),
            backToMain: true
        };
    }
    
    // Handle category selection
    if (callbackData.startsWith('category_')) {
        const categoryKey = callbackData.replace('category_', '');
        filters.category = categoryKey;
        
        return {
            message: getText(lang, 'category_selected', { category: domainConfig.categories[categoryKey] }),
            backToMain: true
        };
    }
    
    // Handle city selection
    if (callbackData.startsWith('city_')) {
        const cityKey = callbackData.replace('city_', '');
        filters.city = cityKey;
        
        return {
            message: getText(lang, 'city_selected', { city: domainConfig.cities[cityKey] }),
            backToMain: true
        };
    }
    
    // Handle price selection
    if (callbackData.startsWith('price_')) {
        const priceKey = callbackData.replace('price_', '');
        
        if (priceKey === 'custom') {
            return {
                message: getText(lang, 'price_custom_text'),
                keyboard: createPriceKeyboard(lang, domainKey)
            };
        }
        
        const currency = domainConfig.currency;
        const ranges = PRICE_RANGES[currency] || PRICE_RANGES['zł'];
        const range = ranges[priceKey];
        
        if (range) {
            filters.priceFrom = range.from;
            filters.priceTo = range.to;
            
            return {
                message: getText(lang, 'price_selected', { range: range.label }),
                backToMain: true
            };
        }
    }
    
    return {
        message: getText(lang, 'unknown_option'),
        backToMain: true
    };
}

module.exports = {
    createFilterKeyboard,
    createCategoryKeyboard,
    createCityKeyboard,
    createPriceKeyboard,
    handleFilterCallback,
    PRICE_RANGES
};