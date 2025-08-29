/**
 * Multi-language support for OLX Bot
 */

const TRANSLATIONS = {
    en: {
        // Main menu
        welcome_title: '🏪 **Welcome to OLX Parser Bot!**',
        welcome_text: '🔍 Search products on OLX with advanced filters\n🎯 Get formatted results directly in Telegram\n🔄 Automatic proxy rotation for stable operation\n🌍 Support for multiple OLX countries\n\nChoose an option:',
        
        // Buttons
        btn_search: '🔍 Search',
        btn_settings: '⚙️ Settings',
        btn_help: '❓ Help',
        btn_back: '◀️ Back',
        
        // Search
        search_title: '🔍 **Start searching**',
        search_input: 'Enter keywords for search:\n\n**Examples:**\n• iPhone 12 Pro\n• apartment Warsaw\n• mountain bike\n• gaming laptop\n• BMW car\n\nWrite your search phrase:',
        search_results: '🔍 **Search results for:** {query}\n\n📊 Found {count} results:',
        search_no_results: '❌ No results found for: **{query}**\n\n💡 **Tips:**\n• Try different keywords\n• Change search filters\n• Check spelling',
        search_error: '❌ **Search error occurred**\n\n🔧 **Possible causes:**\n• Internet connection problems\n• OLX service unavailable\n• All proxies blocked\n\n⏰ Try again in a few minutes.',
        
        // Settings
        settings_title: '⚙️ **Settings**',
        settings_text: 'Choose what to configure:',
        btn_language: '🌍 Language',
        btn_domain: '🌐 OLX Domain',
        
        // Language selection
        language_title: '🌍 **Language Selection**',
        language_text: 'Choose your language:',
        language_selected: '✅ Language changed to: **English**',
        
        // Domain selection
        domain_title: '🌐 **OLX Domain Selection**',
        domain_text: 'Choose OLX country:',
        domain_selected: '✅ Domain changed to: **{domain}**',
        
        // Filters
        filters_title: 'Set filters (optional) or start search:',
        btn_category: '🏷️ Category',
        btn_price: '💰 Price',
        btn_city: '🏙️ City',
        btn_search_now: '🔍 Search now',
        btn_reset_filters: '🗑️ Reset filters',
        filters_reset: 'Filters reset.',
        
        // Categories
        category_title: '🏷️ **Choose category:**',
        category_text: 'Select product category:',
        category_selected: '✅ Selected category: **{category}**',
        
        // Cities
        city_title: '🏙️ **Choose city:**',
        city_text: 'Select city or region:',
        city_selected: '✅ Selected city: **{city}**',
        
        // Price
        price_title: '💰 **Set price range:**',
        price_text: 'Select price range:',
        price_selected: '✅ Set price range: **{range}**',
        price_custom: '✏️ Custom range',
        price_custom_text: '📝 **Custom price range**\n\n⚠️ This feature will be available in future version.\nFor now, choose one of predefined ranges.',
        
        // Results
        view_details: '👀 View Details',
        loading: '🔄 Searching... This may take a moment.',
        
        // Help
        help_title: '📖 **Usage Instructions**',
        help_text: '**How to use:**\n\n1️⃣ Use 🔍 Search to start\n2️⃣ Enter keywords\n3️⃣ Set filters (optional)\n4️⃣ Get results!\n\n**Settings:**\n🌍 Language - change interface language\n🌐 Domain - choose OLX country\n\n**Tips:**\n• Use specific keywords\n• Bot automatically rotates proxies\n• Maximum 20 results per query\n• Results show title, price, location\n\nNeed help? Contact administrator!',
        
        // Common
        unknown_option: 'Unknown option.',
        session_expired: '❌ Session expired. Use 🔍 Search to start again.',
        invalid_query: '❌ Invalid search phrase. Enter at least 2 characters.',
        no_price: 'No price',
        no_location: 'No location'
    },
    
    pl: {
        // Main menu
        welcome_title: '🏪 **Witaj w OLX Parser Bot!**',
        welcome_text: '🔍 Wyszukuj produkty na OLX z zaawansowanymi filtrami\n🎯 Otrzymuj sformatowane wyniki bezpośrednio w Telegram\n🔄 Automatyczna rotacja proxy dla stabilnej pracy\n🌍 Wsparcie dla wielu krajów OLX\n\nWybierz opcję:',
        
        // Buttons
        btn_search: '🔍 Szukaj',
        btn_settings: '⚙️ Ustawienia',
        btn_help: '❓ Pomoc',
        btn_back: '◀️ Powrót',
        
        // Search
        search_title: '🔍 **Rozpocznij wyszukiwanie**',
        search_input: 'Wprowadź słowa kluczowe dla wyszukiwania:\n\n**Przykłady:**\n• iPhone 12 Pro\n• mieszkanie Warszawa\n• rower górski\n• laptop gaming\n• samochód BMW\n\nNapisz swoją frazę wyszukiwania:',
        search_results: '🔍 **Wyniki wyszukiwania dla:** {query}\n\n📊 Znaleziono {count} wyników:',
        search_no_results: '❌ Nie znaleziono żadnych wyników dla: **{query}**\n\n💡 **Wskazówki:**\n• Spróbuj innych słów kluczowych\n• Zmień filtry wyszukiwania\n• Sprawdź pisownię',
        search_error: '❌ **Wystąpił błąd podczas wyszukiwania**\n\n🔧 **Możliwe przyczyny:**\n• Problemy z połączeniem internetowym\n• Serwis OLX jest niedostępny\n• Wszystkie proxy są zablokowane\n\n⏰ Spróbuj ponownie za kilka minut.',
        
        // Settings
        settings_title: '⚙️ **Ustawienia**',
        settings_text: 'Wybierz co chcesz skonfigurować:',
        btn_language: '🌍 Język',
        btn_domain: '🌐 Domena OLX',
        
        // Language selection
        language_title: '🌍 **Wybór języka**',
        language_text: 'Wybierz swój język:',
        language_selected: '✅ Język zmieniony na: **Polski**',
        
        // Domain selection
        domain_title: '🌐 **Wybór domeny OLX**',
        domain_text: 'Wybierz kraj OLX:',
        domain_selected: '✅ Domena zmieniona na: **{domain}**',
        
        // Filters
        filters_title: 'Ustaw filtry (opcjonalnie) lub rozpocznij wyszukiwanie:',
        btn_category: '🏷️ Kategoria',
        btn_price: '💰 Cena',
        btn_city: '🏙️ Miasto',
        btn_search_now: '🔍 Wyszukaj teraz',
        btn_reset_filters: '🗑️ Resetuj filtry',
        filters_reset: 'Filtry zresetowane.',
        
        // Categories
        category_title: '🏷️ **Wybierz kategorię:**',
        category_text: 'Wybierz kategorię produktu:',
        category_selected: '✅ Wybrano kategorię: **{category}**',
        
        // Cities
        city_title: '🏙️ **Wybierz miasto:**',
        city_text: 'Wybierz miasto lub region:',
        city_selected: '✅ Wybrano miasto: **{city}**',
        
        // Price
        price_title: '💰 **Ustaw zakres cenowy:**',
        price_text: 'Wybierz zakres cenowy:',
        price_selected: '✅ Ustawiono zakres cenowy: **{range}**',
        price_custom: '✏️ Własny zakres',
        price_custom_text: '📝 **Własny zakres cenowy**\n\n⚠️ Ta funkcja będzie dostępna w przyszłej wersji.\nNa razie wybierz jeden z predefiniowanych zakresów.',
        
        // Results
        view_details: '👀 Zobacz szczegóły',
        loading: '🔄 Wyszukuję... To może chwilę potrwać.',
        
        // Help
        help_title: '📖 **Instrukcja użytkowania**',
        help_text: '**Jak używać:**\n\n1️⃣ Użyj 🔍 Szukaj aby rozpocząć\n2️⃣ Wprowadź słowa kluczowe\n3️⃣ Ustaw filtry (opcjonalnie)\n4️⃣ Otrzymaj wyniki!\n\n**Ustawienia:**\n🌍 Język - zmień język interfejsu\n🌐 Domena - wybierz kraj OLX\n\n**Wskazówki:**\n• Używaj konkretnych słów kluczowych\n• Bot automatycznie obróci proxy\n• Maksymalnie 20 wyników na zapytanie\n• Wyniki zawierają tytuł, cenę, lokalizację\n\nPotrzebujesz pomocy? Napisz do administratora!',
        
        // Common
        unknown_option: 'Nieznana opcja.',
        session_expired: '❌ Sesja wygasła. Użyj 🔍 Szukaj aby rozpocząć ponownie.',
        invalid_query: '❌ Nieprawidłowa fraza wyszukiwania. Wprowadź co najmniej 2 znaki.',
        no_price: 'Brak ceny',
        no_location: 'Brak lokalizacji'
    },

    uk: {
        // Main menu
        welcome_title: '🏪 **Ласкаво просимо до OLX Parser Bot!**',
        welcome_text: '🔍 Шукайте товари на OLX з розширеними фільтрами\n🎯 Отримуйте відформатовані результати прямо в Telegram\n🔄 Автоматична ротація проксі для стабільної роботи\n🌍 Підтримка багатьох країн OLX\n\nОберіть опцію:',
        
        // Buttons
        btn_search: '🔍 Пошук',
        btn_settings: '⚙️ Налаштування',
        btn_help: '❓ Допомога',
        btn_back: '◀️ Назад',
        
        // Search
        search_title: '🔍 **Почати пошук**',
        search_input: 'Введіть ключові слова для пошуку:\n\n**Приклади:**\n• iPhone 12 Pro\n• квартира Київ\n• гірський велосипед\n• ігровий ноутбук\n• автомобіль BMW\n\nНапишіть вашу пошукову фразу:',
        search_results: '🔍 **Результати пошуку для:** {query}\n\n📊 Знайдено {count} результатів:',
        search_no_results: '❌ Не знайдено результатів для: **{query}**\n\n💡 **Поради:**\n• Спробуйте інші ключові слова\n• Змініть фільтри пошуку\n• Перевірте правопис',
        search_error: '❌ **Сталася помилка пошуку**\n\n🔧 **Можливі причини:**\n• Проблеми з інтернет-з\'єднанням\n• Сервіс OLX недоступний\n• Всі проксі заблоковані\n\n⏰ Спробуйте знову через кілька хвилин.',
        
        // Settings
        settings_title: '⚙️ **Налаштування**',
        settings_text: 'Оберіть що налаштувати:',
        btn_language: '🌍 Мова',
        btn_domain: '🌐 Домен OLX',
        
        // Language selection
        language_title: '🌍 **Вибір мови**',
        language_text: 'Оберіть вашу мову:',
        language_selected: '✅ Мову змінено на: **Українська**',
        
        // Domain selection
        domain_title: '🌐 **Вибір домену OLX**',
        domain_text: 'Оберіть країну OLX:',
        domain_selected: '✅ Домен змінено на: **{domain}**',
        
        // Filters
        filters_title: 'Встановіть фільтри (за бажанням) або почніть пошук:',
        btn_category: '🏷️ Категорія',
        btn_price: '💰 Ціна',
        btn_city: '🏙️ Місто',
        btn_search_now: '🔍 Шукати зараз',
        btn_reset_filters: '🗑️ Скинути фільтри',
        filters_reset: 'Фільтри скинуто.',
        
        // Categories
        category_title: '🏷️ **Оберіть категорію:**',
        category_text: 'Виберіть категорію товару:',
        category_selected: '✅ Обрано категорію: **{category}**',
        
        // Cities
        city_title: '🏙️ **Оберіть місто:**',
        city_text: 'Виберіть місто або регіон:',
        city_selected: '✅ Обрано місто: **{city}**',
        
        // Price
        price_title: '💰 **Встановіть ціновий діапазон:**',
        price_text: 'Виберіть ціновий діапазон:',
        price_selected: '✅ Встановлено ціновий діапазон: **{range}**',
        price_custom: '✏️ Власний діапазон',
        price_custom_text: '📝 **Власний ціновий діапазон**\n\n⚠️ Ця функція буде доступна в майбутній версії.\nПоки що оберіть один з визначених діапазонів.',
        
        // Results
        view_details: '👀 Переглянути деталі',
        loading: '🔄 Шукаю... Це може зайняти деякий час.',
        
        // Help
        help_title: '📖 **Інструкція з використання**',
        help_text: '**Як користуватися:**\n\n1️⃣ Використайте 🔍 Пошук для початку\n2️⃣ Введіть ключові слова\n3️⃣ Встановіть фільтри (за бажанням)\n4️⃣ Отримайте результати!\n\n**Налаштування:**\n🌍 Мова - зміна мови інтерфейсу\n🌐 Домен - вибір країни OLX\n\n**Поради:**\n• Використовуйте конкретні ключові слова\n• Бот автоматично ротує проксі\n• Максимум 20 результатів на запит\n• Результати містять назву, ціну, місцезнаходження\n\nПотрібна допомога? Зверніться до адміністратора!',
        
        // Common
        unknown_option: 'Невідома опція.',
        session_expired: '❌ Сесія закінчилася. Використайте 🔍 Пошук для початку.',
        invalid_query: '❌ Неправильна пошукова фраза. Введіть принаймні 2 символи.',
        no_price: 'Без ціни',
        no_location: 'Без місцезнаходження'
    }
};

/**
 * Get text by key and language
 */
function getText(lang, key, replacements = {}) {
    const langTexts = TRANSLATIONS[lang] || TRANSLATIONS.en;
    let text = langTexts[key] || TRANSLATIONS.en[key] || key;
    
    // Replace placeholders
    for (const [placeholder, value] of Object.entries(replacements)) {
        text = text.replace(`{${placeholder}}`, value);
    }
    
    return text;
}

/**
 * Get available languages
 */
function getAvailableLanguages() {
    return {
        'en': '🇬🇧 English',
        'pl': '🇵🇱 Polski',
        'uk': '🇺🇦 Українська'
    };
}

module.exports = {
    TRANSLATIONS,
    getText,
    getAvailableLanguages
};