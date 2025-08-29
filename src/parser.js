const axios = require('axios');
const cheerio = require('cheerio');
const { HttpsProxyAgent } = require('https-proxy-agent');
const proxyManager = require('./proxy');
const { getDomainConfig } = require('./domains');

class OLXParser {
    constructor() {
        this.maxRetries = 3;
        this.timeout = 10000;
    }

    /**
     * Search OLX with given query, filters and domain
     */
    async searchOLX(query, filters = {}, domainKey = 'pl') {
        console.log(`🔍 Starting OLX search for: "${query}" on domain: ${domainKey}`);
        
        const domainConfig = getDomainConfig(domainKey);
        const searchUrl = this.buildSearchUrl(query, filters, domainConfig);
        console.log(`🌐 Search URL: ${searchUrl}`);
        
        let lastError;
        const maxProxyRetries = Math.max(proxyManager.getProxyCount(), 1);
        
        for (let attempt = 1; attempt <= maxProxyRetries; attempt++) {
            try {
                console.log(`🔄 Attempt ${attempt}/${maxProxyRetries}`);
                
                const proxy = proxyManager.getNextProxy();
                const response = await this.makeRequest(searchUrl, proxy);
                
                if (response && response.data) {
                    const results = this.parseSearchResults(response.data, domainConfig);
                    console.log(`✅ Successfully parsed ${results.length} results`);
                    return results;
                }
            } catch (error) {
                lastError = error;
                console.error(`❌ Attempt ${attempt} failed:`, error.message);
                
                // Mark proxy as failed if it's a connection error
                if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED' || 
                    error.code === 'ETIMEDOUT' || error.response?.status === 403) {
                    proxyManager.markProxyAsFailed();
                    console.log('🚫 Marked current proxy as failed');
                }
            }
        }
        
        // Try direct connection as last resort if all proxies failed with 403
        if (lastError?.response?.status === 403) {
            console.log('🌐 All proxies blocked, trying direct connection...');
            try {
                const response = await this.makeRequest(searchUrl, null);
                if (response && response.data) {
                    const results = this.parseSearchResults(response.data, domainConfig);
                    console.log(`✅ Successfully parsed ${results.length} results via direct connection`);
                    return results;
                }
            } catch (directError) {
                console.error('❌ Direct connection also failed:', directError.message);
            }
        }
        
        throw new Error(`Failed to fetch results after ${maxProxyRetries} attempts. Last error: ${lastError?.message}`);
    }

    /**
     * Build search URL with query, filters and domain config
     */
    buildSearchUrl(query, filters, domainConfig) {
        let url = `${domainConfig.searchUrl}${encodeURIComponent(query)}/`;
        const params = new URLSearchParams();
        
        // Add category filter - different structure per domain
        if (filters.category) {
            if (domainConfig.baseUrl.includes('olx.pl')) {
                url = `${domainConfig.baseUrl}/d/${filters.category}/q-${encodeURIComponent(query)}/`;
            } else if (domainConfig.baseUrl.includes('olx.ua')) {
                url = `${domainConfig.baseUrl}/d/${filters.category}/q-${encodeURIComponent(query)}/`;
            } else if (domainConfig.baseUrl.includes('olx.cz')) {
                url = `${domainConfig.baseUrl}/${filters.category}/q-${encodeURIComponent(query)}/`;
            } else {
                // Generic approach for other domains
                params.append('category', filters.category);
            }
        }
        
        // Add price filters
        if (filters.priceFrom) {
            if (domainConfig.baseUrl.includes('olx.pl')) {
                params.append('search[filter_float_price:from]', filters.priceFrom);
            } else {
                params.append('priceFrom', filters.priceFrom);
            }
        }
        if (filters.priceTo) {
            if (domainConfig.baseUrl.includes('olx.pl')) {
                params.append('search[filter_float_price:to]', filters.priceTo);
            } else {
                params.append('priceTo', filters.priceTo);
            }
        }
        
        // Add city filter
        if (filters.city) {
            if (domainConfig.baseUrl.includes('olx.pl')) {
                params.append('search[city_id]', filters.city);
            } else {
                params.append('cityId', filters.city);
            }
        }
        
        // Add sorting - newest first
        if (domainConfig.baseUrl.includes('olx.pl')) {
            params.append('search[order]', 'created_at:desc');
        } else {
            params.append('order', 'newest');
        }
        
        const queryString = params.toString();
        return queryString ? `${url}?${queryString}` : url;
    }

    /**
     * Make HTTP request with proxy
     */
    async makeRequest(url, proxy) {
        const config = {
            timeout: this.timeout,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9,pl;q=0.8,uk;q=0.7',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Upgrade-Insecure-Requests': '1',
            }
        };

        if (proxy) {
            config.httpsAgent = new HttpsProxyAgent(proxy.url);
            config.httpAgent = new HttpsProxyAgent(proxy.url);
            console.log(`🌐 Using proxy: ${proxy.host}:${proxy.port}`);
        } else {
            console.log('🌐 Using direct connection (no proxy)');
        }

        return await axios.get(url, config);
    }

    /**
     * Parse search results from HTML
     */
    parseSearchResults(html, domainConfig) {
        const $ = cheerio.load(html);
        const results = [];

        // Different selectors for different domains
        let itemSelectors = [];
        
        if (domainConfig.baseUrl.includes('olx.pl')) {
            itemSelectors = [
                '[data-cy="l-card"]',
                '.css-1sw7q4x',
                '[data-testid="l-card"]'
            ];
        } else if (domainConfig.baseUrl.includes('olx.ua')) {
            itemSelectors = [
                '[data-cy="l-card"]',
                '.css-1sw7q4x',
                '[data-testid="l-card"]',
                '.wrap'
            ];
        } else {
            // Generic selectors for other domains
            itemSelectors = [
                '[data-cy="l-card"]',
                '.css-1sw7q4x',
                '[data-testid="l-card"]',
                'div[class*="card"]',
                'article[class*="card"]'
            ];
        }

        let items = $();
        for (const selector of itemSelectors) {
            items = $(selector);
            if (items.length > 0) {
                console.log(`📦 Found items with selector: ${selector} (${items.length} items)`);
                break;
            }
        }

        if (items.length === 0) {
            console.log('⚠️ No items found with any selector, trying generic approach');
            // Fallback: look for common patterns
            items = $('div[class*="card"], article[class*="card"], div[data-cy*="card"], .wrap');
        }

        items.each((index, element) => {
            if (results.length >= 20) return false; // Limit results
            
            try {
                const $item = $(element);
                const result = this.extractItemData($item, $, domainConfig);
                
                if (result && result.title && result.url) {
                    results.push(result);
                }
            } catch (error) {
                console.error(`Error parsing item ${index}:`, error.message);
            }
        });

        return results;
    }

    /**
     * Extract data from individual item
     */
    extractItemData($item, $, domainConfig) {
        // Title selectors - domain specific
        let titleSelectors = [];
        if (domainConfig.baseUrl.includes('olx.pl')) {
            titleSelectors = [
                'h6', 'h4', 'h3', '[data-cy="ad-card-title"]', 
                '.css-16v5mdi h6', '.css-u2ayx7 h6', 
                'a[class*="title"]', '[class*="title"]'
            ];
        } else {
            titleSelectors = [
                'h2', 'h3', 'h4', 'h5', 'h6',
                '[data-cy="ad-card-title"]',
                '.title', '[class*="title"]',
                'a[class*="title"]'
            ];
        }

        const title = this.extractText($item, titleSelectors);

        // Price selectors
        let priceSelectors = [];
        if (domainConfig.baseUrl.includes('olx.pl')) {
            priceSelectors = [
                '[data-testid="ad-price"]', '.css-10b0gli p', '.css-tyui9s',
                '[class*="price"]', 'p[class*="price"]', '.price'
            ];
        } else {
            priceSelectors = [
                '[data-testid="ad-price"]',
                '.price', '[class*="price"]',
                'p[class*="price"]', 'span[class*="price"]'
            ];
        }

        const price = this.extractText($item, priceSelectors);

        // Location selectors
        let locationSelectors = [];
        if (domainConfig.baseUrl.includes('olx.pl')) {
            locationSelectors = [
                '[data-testid="location-date"]', '.css-veheph span',
                '[class*="location"]', '.location', '[data-cy="ad-card-location"]'
            ];
        } else {
            locationSelectors = [
                '[data-testid="location-date"]',
                '.location', '[class*="location"]',
                '[data-cy="ad-card-location"]', 'span[class*="location"]'
            ];
        }

        const location = this.extractText($item, locationSelectors);

        // Extract URL
        let url = '';
        const linkSelectors = ['a[href*="/d/"]', 'a[href*="/oferta/"]', 'a[href*="/oferty/"]', 'a[href]'];
        
        for (const selector of linkSelectors) {
            const link = $item.find(selector).first();
            if (link.length > 0) {
                const href = link.attr('href');
                if (href) {
                    url = href.startsWith('http') ? href : domainConfig.baseUrl + href;
                    break;
                }
            }
        }

        // Extract image URL
        let imageUrl = '';
        const imgSelectors = ['img[src]', 'img[data-src]'];
        
        for (const selector of imgSelectors) {
            const img = $item.find(selector).first();
            if (img.length > 0) {
                imageUrl = img.attr('src') || img.attr('data-src') || '';
                if (imageUrl && !imageUrl.startsWith('http')) {
                    imageUrl = domainConfig.baseUrl + imageUrl;
                }
                break;
            }
        }

        // Only return if we have at least title and URL
        if (!title || !url) {
            return null;
        }

        return {
            title: title.trim(),
            price: this.formatPrice(price?.trim(), domainConfig.currency),
            location: location?.trim() || this.getNoLocationText(domainConfig),
            url: url,
            imageUrl: imageUrl
        };
    }

    /**
     * Extract text using multiple selectors
     */
    extractText($element, selectors) {
        for (const selector of selectors) {
            const text = $element.find(selector).first().text().trim();
            if (text) {
                return text;
            }
        }
        return '';
    }

    /**
     * Format price with currency
     */
    formatPrice(price, currency) {
        if (!price || price === 'Brak ceny') {
            return null;
        }
        
        // Remove extra whitespace and normalize
        price = price.trim();
        
        // If price already contains currency symbol, return as is
        if (price.includes(currency) || price.includes('PLN') || price.includes('€') || price.includes('$') || price.includes('₴')) {
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
     * Get "no location" text based on domain language
     */
    getNoLocationText(domainConfig) {
        const texts = {
            'pl': 'Brak lokalizacji',
            'uk': 'Без місцезнаходження',
            'en': 'No location',
            'cs': 'Bez lokace',
            'bg': 'Без локация',
            'ro': 'Fără locație'
        };
        
        return texts[domainConfig.language] || texts['en'];
    }
}

// Export singleton instance
const parser = new OLXParser();

module.exports = {
    searchOLX: (query, filters, domain) => parser.searchOLX(query, filters, domain)
};