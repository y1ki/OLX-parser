const parser = require('./parser');
const filters = require('./filters');
const { getText, getAvailableLanguages } = require('./translations');
const { getAvailableDomains, getDomainConfig } = require('./domains');
const userSettings = require('./userSettings');
const { validateSearchQuery } = require('./utils');

// User session storage
const userSessions = new Map();
const searchResults = new Map(); // Store search results for detail view

function initBot(bot) {
    // Start command - show main menu
    bot.start((ctx) => {
        const userId = ctx.from.id;
        const lang = userSettings.getUserLanguage(userId);
        
        const keyboard = createMainMenu(lang);
        const welcomeText = getText(lang, 'welcome_title') + '\n\n' + getText(lang, 'welcome_text');
        
        ctx.replyWithMarkdown(welcomeText, keyboard);
    });

    // Help command
    bot.help((ctx) => {
        const userId = ctx.from.id;
        const lang = userSettings.getUserLanguage(userId);
        
        const helpText = getText(lang, 'help_title') + '\n\n' + getText(lang, 'help_text');
        
        ctx.replyWithMarkdown(helpText, {
            reply_markup: {
                inline_keyboard: [[
                    { text: getText(lang, 'btn_back'), callback_data: 'main_menu' }
                ]]
            }
        });
    });

    // Handle all callback queries
    bot.on('callback_query', async (ctx) => {
        const userId = ctx.from.id;
        const callbackData = ctx.callbackQuery.data;
        const lang = userSettings.getUserLanguage(userId);

        try {
            await ctx.answerCbQuery();
            
            // Main menu actions
            if (callbackData === 'main_menu') {
                await showMainMenu(ctx, lang);
            }
            else if (callbackData === 'search') {
                await startSearch(ctx, lang);
            }
            else if (callbackData === 'settings') {
                await showSettings(ctx, lang);
            }
            else if (callbackData === 'help') {
                await showHelp(ctx, lang);
            }
            
            // Settings actions
            else if (callbackData === 'settings_language') {
                await showLanguageSelection(ctx, lang);
            }
            else if (callbackData === 'settings_domain') {
                await showDomainSelection(ctx, lang);
            }
            else if (callbackData.startsWith('lang_')) {
                await handleLanguageSelection(ctx, callbackData);
            }
            else if (callbackData.startsWith('domain_')) {
                await handleDomainSelection(ctx, callbackData);
            }
            
            // Search flow actions
            else if (callbackData === 'show_filters') {
                const session = userSessions.get(userId);
                if (session && session.query) {
                    await showFilters(ctx, session, lang);
                }
            }
            else if (callbackData === 'search_now') {
                const session = userSessions.get(userId);
                if (session && session.query) {
                    await handleSearch(ctx, session, lang);
                }
            }
            else if (callbackData === 'reset_filters') {
                const session = userSessions.get(userId);
                if (session) {
                    session.filters = {};
                    await showFilters(ctx, session, lang);
                }
            }
            
            // Filter actions
            else if (callbackData.startsWith('filter_') || callbackData.startsWith('category_') || 
                     callbackData.startsWith('city_') || callbackData.startsWith('price_') ||
                     callbackData === 'back_to_filters') {
                await handleFilterCallback(ctx, callbackData, lang);
            }
            
            // Result detail view
            else if (callbackData.startsWith('detail_')) {
                await showResultDetail(ctx, callbackData, lang);
            }
            // Back to results
            else if (callbackData.startsWith('results_')) {
                await showResultsFromKey(ctx, callbackData, lang);
            }
            // Pagination
            else if (callbackData.startsWith('page_')) {
                await handlePagination(ctx, callbackData, lang);
            }
            // Page info (just answer the callback)
            else if (callbackData === 'page_info') {
                // Just acknowledge the callback, no action needed
                return;
            }
            
        } catch (error) {
            console.error('Callback query error:', error);
            ctx.reply('❌ Произошла ошибка. Попробуйте снова.');
        }
    });

    // Handle text messages (search queries)
    bot.on('text', async (ctx) => {
        const userId = ctx.from.id;
        const session = userSessions.get(userId);
        const lang = userSettings.getUserLanguage(userId);

        if (!session || session.step !== 'awaiting_query') {
            // Show main menu if no active session
            const keyboard = createMainMenu(lang);
            const welcomeText = getText(lang, 'welcome_title') + '\n\n' + getText(lang, 'welcome_text');
            ctx.replyWithMarkdown(welcomeText, keyboard);
            return;
        }

        const query = ctx.message.text.trim();
        
        if (!validateSearchQuery(query)) {
            ctx.reply(getText(lang, 'invalid_query'));
            return;
        }

        session.query = query;
        session.step = 'show_filters';
        
        await showFiltersNewMessage(ctx, session, lang);
    });
}

// Create main menu keyboard
function createMainMenu(lang) {
    return {
        reply_markup: {
            inline_keyboard: [
                [{ text: getText(lang, 'btn_search'), callback_data: 'search' }],
                [
                    { text: getText(lang, 'btn_settings'), callback_data: 'settings' },
                    { text: getText(lang, 'btn_help'), callback_data: 'help' }
                ]
            ]
        }
    };
}

// Show main menu
async function showMainMenu(ctx, lang) {
    const keyboard = createMainMenu(lang);
    const welcomeText = getText(lang, 'welcome_title') + '\n\n' + getText(lang, 'welcome_text');
    
    await ctx.editMessageText(welcomeText, {
        parse_mode: 'Markdown',
        ...keyboard
    });
}

// Start search process
async function startSearch(ctx, lang) {
    const userId = ctx.from.id;
    
    userSessions.set(userId, {
        step: 'awaiting_query',
        query: '',
        filters: {}
    });

    const searchText = getText(lang, 'search_title') + '\n\n' + getText(lang, 'search_input');
    
    await ctx.editMessageText(searchText, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [[
                { text: getText(lang, 'btn_back'), callback_data: 'main_menu' }
            ]]
        }
    });
}

// Show settings menu
async function showSettings(ctx, lang) {
    const settingsText = getText(lang, 'settings_title') + '\n\n' + getText(lang, 'settings_text');
    
    const keyboard = {
        reply_markup: {
            inline_keyboard: [
                [{ text: getText(lang, 'btn_language'), callback_data: 'settings_language' }],
                [{ text: getText(lang, 'btn_domain'), callback_data: 'settings_domain' }],
                [{ text: getText(lang, 'btn_back'), callback_data: 'main_menu' }]
            ]
        }
    };
    
    await ctx.editMessageText(settingsText, {
        parse_mode: 'Markdown',
        ...keyboard
    });
}

// Show help
async function showHelp(ctx, lang) {
    const helpText = getText(lang, 'help_title') + '\n\n' + getText(lang, 'help_text');
    
    await ctx.editMessageText(helpText, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [[
                { text: getText(lang, 'btn_back'), callback_data: 'main_menu' }
            ]]
        }
    });
}

// Show language selection
async function showLanguageSelection(ctx, lang) {
    const languages = getAvailableLanguages();
    const keyboard = [];
    
    for (const [langCode, langName] of Object.entries(languages)) {
        keyboard.push([{ text: langName, callback_data: `lang_${langCode}` }]);
    }
    
    keyboard.push([{ text: getText(lang, 'btn_back'), callback_data: 'settings' }]);
    
    const languageText = getText(lang, 'language_title') + '\n\n' + getText(lang, 'language_text');
    
    await ctx.editMessageText(languageText, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: keyboard }
    });
}

// Show domain selection
async function showDomainSelection(ctx, lang) {
    const domains = getAvailableDomains();
    const keyboard = [];
    
    for (const [domainCode, domainName] of Object.entries(domains)) {
        keyboard.push([{ text: domainName, callback_data: `domain_${domainCode}` }]);
    }
    
    keyboard.push([{ text: getText(lang, 'btn_back'), callback_data: 'settings' }]);
    
    const domainText = getText(lang, 'domain_title') + '\n\n' + getText(lang, 'domain_text');
    
    await ctx.editMessageText(domainText, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: keyboard }
    });
}

// Handle language selection
async function handleLanguageSelection(ctx, callbackData) {
    const userId = ctx.from.id;
    const newLang = callbackData.replace('lang_', '');
    
    userSettings.setUserLanguage(userId, newLang);
    
    const confirmText = getText(newLang, 'language_selected');
    
    await ctx.editMessageText(confirmText, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [[
                { text: getText(newLang, 'btn_back'), callback_data: 'settings' }
            ]]
        }
    });
}

// Handle domain selection
async function handleDomainSelection(ctx, callbackData) {
    const userId = ctx.from.id;
    const newDomain = callbackData.replace('domain_', '');
    const lang = userSettings.getUserLanguage(userId);
    
    userSettings.setUserDomain(userId, newDomain);
    
    const domainConfig = getDomainConfig(newDomain);
    const confirmText = getText(lang, 'domain_selected', { domain: domainConfig.name });
    
    await ctx.editMessageText(confirmText, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [[
                { text: getText(lang, 'btn_back'), callback_data: 'settings' }
            ]]
        }
    });
}

// Show filters
async function showFilters(ctx, session, lang) {
    const userId = ctx.from.id;
    const domain = userSettings.getUserDomain(userId);
    
    const filterKeyboard = filters.createFilterKeyboard(session.filters, lang, domain);
    const filtersText = `✅ ${getText(lang, 'search_results', { query: session.query, count: '' }).split('\n')[0].replace('🔍 **', '').replace('**', '')}\n\n🎛️ ${getText(lang, 'filters_title')}`;
    
    await ctx.editMessageText(filtersText, {
        parse_mode: 'Markdown',
        ...filterKeyboard
    });
}

// Show filters as new message (for text input)
async function showFiltersNewMessage(ctx, session, lang) {
    const userId = ctx.from.id;
    const domain = userSettings.getUserDomain(userId);
    
    const filterKeyboard = filters.createFilterKeyboard(session.filters, lang, domain);
    const filtersText = `✅ ${getText(lang, 'search_results', { query: session.query, count: '' }).split('\n')[0].replace('🔍 **', '').replace('**', '')}\n\n🎛️ ${getText(lang, 'filters_title')}`;
    
    await ctx.replyWithMarkdown(filtersText, filterKeyboard);
}

// Handle filter callbacks
async function handleFilterCallback(ctx, callbackData, lang) {
    const userId = ctx.from.id;
    const session = userSessions.get(userId);
    const domain = userSettings.getUserDomain(userId);
    
    if (!session) {
        ctx.reply(getText(lang, 'session_expired'));
        return;
    }
    
    const result = filters.handleFilterCallback(callbackData, session.filters, lang, domain);
    
    if (result.keyboard) {
        await ctx.editMessageText(result.message, {
            parse_mode: 'Markdown',
            ...result.keyboard
        });
    } else if (result.backToMain) {
        await showFilters(ctx, session, lang);
    }
}

// Handle search execution
async function handleSearch(ctx, session, lang) {
    const userId = ctx.from.id;
    const domain = userSettings.getUserDomain(userId);
    
    const loadingText = getText(lang, 'loading');
    await ctx.editMessageText(loadingText);
    
    try {
        console.log(`🔍 Starting search for user ${userId}: "${session.query}" on domain ${domain}`);
        console.log('📋 Filters:', session.filters);
        
        const results = await parser.searchOLX(session.query, session.filters, domain);
        
        if (results.length === 0) {
            const noResultsText = getText(lang, 'search_no_results', { query: session.query });
            
            await ctx.editMessageText(noResultsText, {
                parse_mode: 'Markdown',
                reply_markup: {
                    inline_keyboard: [
                        [{ text: getText(lang, 'btn_search'), callback_data: 'search' }],
                        [{ text: getText(lang, 'btn_back'), callback_data: 'main_menu' }]
                    ]
                }
            });
        } else {
            // Store results for detail view
            const resultKey = `${userId}_${Date.now()}`;
            searchResults.set(resultKey, results);
            
            await showSearchResults(ctx, results, session.query, lang, resultKey, 0);
        }
    } catch (error) {
        console.error('Search error:', error);
        
        let errorText = getText(lang, 'search_error');
        
        // Special message for blocked proxies
        if (error.message.includes('Request failed with status code 403')) {
            errorText = `❌ **Доступ заблокирован**\n\n🚫 OLX блокирует все прокси. Возможные решения:\n• Смените прокси в файле proxies.txt\n• Попробуйте другую страну OLX\n• Повторите попытку позже\n\n⚠️ Сайт может блокировать автоматические запросы.`;
        }
        
        await ctx.editMessageText(errorText, {
            parse_mode: 'Markdown',
            reply_markup: {
                inline_keyboard: [
                    [{ text: getText(lang, 'btn_search'), callback_data: 'search' }],
                    [{ text: getText(lang, 'btn_back'), callback_data: 'main_menu' }]
                ]
            }
        });
    }
    
    // Clear session
    userSessions.delete(userId);
}

// Show search results as buttons with pagination
async function showSearchResults(ctx, results, query, lang, resultKey, page = 0) {
    const resultsPerPage = 10;
    const totalPages = Math.ceil(results.length / resultsPerPage);
    const startIndex = page * resultsPerPage;
    const endIndex = Math.min(startIndex + resultsPerPage, results.length);
    
    const resultsText = getText(lang, 'search_results', { query: query, count: results.length }) + 
                       `\n\n📄 Страница ${page + 1} из ${totalPages}`;
    
    // Create result buttons for current page
    const keyboard = [];
    
    for (let i = startIndex; i < endIndex; i++) {
        const result = results[i];
        const buttonText = `${i + 1}. ${truncateText(result.title, 30)}`;
        keyboard.push([{ 
            text: buttonText, 
            callback_data: `detail_${resultKey}_${i}_${page}` 
        }]);
    }
    
    // Navigation buttons for pagination
    const navButtons = [];
    if (page > 0) {
        navButtons.push({ text: '⬅️ Назад', callback_data: `page_${resultKey}_${page - 1}` });
    }
    if (page < totalPages - 1) {
        navButtons.push({ text: 'Вперёд ➡️', callback_data: `page_${resultKey}_${page + 1}` });
    }
    
    if (navButtons.length > 0) {
        keyboard.push(navButtons);
    }
    
    // Add page info if there are multiple pages
    if (totalPages > 1) {
        keyboard.push([{ text: `📄 ${page + 1}/${totalPages}`, callback_data: 'page_info' }]);
    }
    
    // Main navigation buttons
    keyboard.push([
        { text: getText(lang, 'btn_search'), callback_data: 'search' },
        { text: getText(lang, 'btn_back'), callback_data: 'main_menu' }
    ]);
    
    await ctx.editMessageText(resultsText, {
        parse_mode: 'Markdown',
        reply_markup: { inline_keyboard: keyboard }
    });
}

// Show result detail
async function showResultDetail(ctx, callbackData, lang) {
    const parts = callbackData.split('_');
    const resultKey = parts[1];
    const index = parseInt(parts[2]);
    const page = parts[3] ? parseInt(parts[3]) : 0;
    
    const results = searchResults.get(resultKey);
    if (!results || !results[index]) {
        ctx.reply(getText(lang, 'session_expired') || 'Сессия истекла. Начните новый поиск.');
        return;
    }
    
    const result = results[index];
    const userId = ctx.from.id;
    const domain = userSettings.getUserDomain(userId);
    
    const detailText = `
**${result.title}**

💰 **Цена:** ${result.price || 'Не указана'}
📍 **Город:** ${result.location || 'Не указан'}

🔗 **Ссылка:** [Перейти к объявлению](${result.url})
    `;
    
    await ctx.editMessageText(detailText, {
        parse_mode: 'Markdown',
        reply_markup: {
            inline_keyboard: [
                [{ text: '⬅️ К результатам', callback_data: `results_${resultKey}_${page}` }],
                [{ text: '🔍 Новый поиск', callback_data: 'search' }]
            ]
        },
        disable_web_page_preview: true
    });
}

// Show results from stored key
async function showResultsFromKey(ctx, callbackData, lang) {
    const parts = callbackData.split('_');
    const resultKey = parts[1];
    const page = parts[2] ? parseInt(parts[2]) : 0;
    
    const results = searchResults.get(resultKey);
    
    if (!results) {
        ctx.reply(getText(lang, 'session_expired') || 'Сессия истекла. Начните новый поиск.');
        return;
    }
    
    // Extract query from first result or use generic text
    const query = 'Результаты поиска';
    await showSearchResults(ctx, results, query, lang, resultKey, page);
}

// Handle pagination
async function handlePagination(ctx, callbackData, lang) {
    const parts = callbackData.split('_');
    const resultKey = parts[1];
    const page = parseInt(parts[2]);
    
    const results = searchResults.get(resultKey);
    
    if (!results) {
        ctx.reply(getText(lang, 'session_expired') || 'Сессия истекла. Начните новый поиск.');
        return;
    }
    
    const query = 'Результаты поиска';
    await showSearchResults(ctx, results, query, lang, resultKey, page);
}

// Helper function to truncate text
function truncateText(text, maxLength) {
    if (!text || text.length <= maxLength) {
        return text;
    }
    return text.substring(0, maxLength - 3) + '...';
}

module.exports = { initBot };