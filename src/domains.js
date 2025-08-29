/**
 * Multiple OLX domains support
 */

const OLX_DOMAINS = {
    'pl': {
        name: '🇵🇱 Poland (OLX.pl)',
        baseUrl: 'https://www.olx.pl',
        searchUrl: 'https://www.olx.pl/d/oferty/q-',
        currency: 'zł',
        language: 'pl',
        categories: {
            'nieruchomosci': 'Nieruchomości',
            'praca': 'Praca',
            'motoryzacja': 'Motoryzacja',
            'dom-ogrod': 'Dom i Ogród',
            'elektronika': 'Elektronika',
            'moda': 'Moda',
            'rolnictwo': 'Rolnictwo',
            'zwierzeta': 'Zwierzęta',
            'dla-dzieci': 'Dla dzieci',
            'sport-hobby': 'Sport i hobby',
            'muzyka-edukacja': 'Muzyka i edukacja',
            'uslugi': 'Usługi i firmy'
        },
        cities: {
            '17935': 'Warszawa',
            '8959': 'Kraków',
            '7786': 'Łódź',
            '8738': 'Wrocław',
            '7531': 'Poznań',
            '8409': 'Gdańsk',
            '8511': 'Szczecin',
            '7855': 'Bydgoszcz',
            '8583': 'Lublin',
            '8406': 'Białystok',
            '7894': 'Katowice',
            '8084': 'Gdynia',
            '7618': 'Częstochowa',
            '7673': 'Radom',
            '8240': 'Sosnowiec',
            '8497': 'Toruń'
        }
    },
    
    'ua': {
        name: '🇺🇦 Ukraine (OLX.ua)',
        baseUrl: 'https://www.olx.ua',
        searchUrl: 'https://www.olx.ua/d/list/q-',
        currency: '₴',
        language: 'uk',
        categories: {
            'nedvizhimost': 'Нерухомість',
            'transport': 'Транспорт',
            'rabota': 'Робота',
            'elektronika': 'Електроніка',
            'dom-sad': 'Дім і сад',
            'moda-stil': 'Мода і стиль',
            'detskiy-mir': 'Дитячий світ',
            'hobbi-otdyh': 'Хобі, відпочинок і спорт',
            'zhivotnye': 'Тварини',
            'uslugi': 'Послуги',
            'biznes': 'Бізнес та послуги'
        },
        cities: {
            '1': 'Київ',
            '4': 'Харків',
            '3': 'Одеса',
            '5': 'Дніпро',
            '18': 'Донецьк',
            '16': 'Запоріжжя',
            '15': 'Львів',
            '2': 'Кривий Ріг',
            '21': 'Миколаїв',
            '17': 'Маріуполь',
            '22': 'Луганськ',
            '14': 'Вінниця',
            '6': 'Макіївка',
            '25': 'Сімферополь',
            '26': 'Херсон',
            '28': 'Полтава'
        }
    },
    
    'cz': {
        name: '🇨🇿 Czech Republic (OLX.cz)',
        baseUrl: 'https://www.olx.cz',
        searchUrl: 'https://www.olx.cz/hledani/q-',
        currency: 'Kč',
        language: 'cs',
        categories: {
            'nemovitosti': 'Nemovitosti',
            'automobily': 'Automobily',
            'elektronika': 'Elektronika',
            'dum-zahrada': 'Dům a zahrada',
            'moda': 'Móda',
            'sport-hobby': 'Sport a hobby',
            'deti': 'Děti',
            'zvirata': 'Zvířata',
            'sluzby': 'Služby',
            'prace': 'Práce'
        },
        cities: {
            '1': 'Praha',
            '2': 'Brno',
            '3': 'Ostrava',
            '4': 'Plzeň',
            '5': 'Liberec',
            '6': 'Olomouc',
            '7': 'České Budějovice',
            '8': 'Hradec Králové',
            '9': 'Ústí nad Labem',
            '10': 'Pardubice'
        }
    },
    
    'bg': {
        name: '🇧🇬 Bulgaria (OLX.bg)',
        baseUrl: 'https://www.olx.bg',
        searchUrl: 'https://www.olx.bg/ads/q-',
        currency: 'лв',
        language: 'bg',
        categories: {
            'nedvizhimi-imoti': 'Недвижими имоти',
            'avtomobili': 'Автомобили',
            'elektronika': 'Електроника',
            'dom-gradina': 'Дом и градина',
            'moda': 'Мода',
            'sport-hobi': 'Спорт и хоби',
            'deca': 'Деца',
            'zhivotni': 'Животни',
            'uslugi': 'Услуги',
            'rabota': 'Работа'
        },
        cities: {
            '1': 'София',
            '2': 'Пловдив',
            '3': 'Варна',
            '4': 'Бургас',
            '5': 'Русе',
            '6': 'Стара Загора',
            '7': 'Плевен',
            '8': 'Сливен',
            '9': 'Добрич',
            '10': 'Шумен'
        }
    },
    
    'ro': {
        name: '🇷🇴 Romania (OLX.ro)',
        baseUrl: 'https://www.olx.ro',
        searchUrl: 'https://www.olx.ro/anunturi/q-',
        currency: 'lei',
        language: 'ro',
        categories: {
            'imobiliare': 'Imobiliare',
            'autoturisme': 'Autoturisme',
            'electronice': 'Electronice si IT',
            'casa-gradina': 'Casa si gradina',
            'moda': 'Moda si frumusete',
            'sport-hobby': 'Sport, timp liber',
            'mama-copilul': 'Mama si copilul',
            'animale': 'Animale de companie',
            'servicii': 'Servicii, afaceri',
            'locuri-munca': 'Locuri de munca'
        },
        cities: {
            '1': 'București',
            '2': 'Cluj-Napoca',
            '3': 'Timișoara',
            '4': 'Iași',
            '5': 'Constanța',
            '6': 'Craiova',
            '7': 'Brașov',
            '8': 'Galați',
            '9': 'Ploiești',
            '10': 'Oradea'
        }
    }
};

/**
 * Get domain configuration
 */
function getDomainConfig(domainKey) {
    return OLX_DOMAINS[domainKey] || OLX_DOMAINS.pl;
}

/**
 * Get available domains
 */
function getAvailableDomains() {
    const domains = {};
    for (const [key, config] of Object.entries(OLX_DOMAINS)) {
        domains[key] = config.name;
    }
    return domains;
}

/**
 * Get default domain based on language
 */
function getDefaultDomain(language) {
    const domainMap = {
        'pl': 'pl',
        'uk': 'ua',
        'en': 'pl',
        'cs': 'cz',
        'bg': 'bg',
        'ro': 'ro'
    };
    
    return domainMap[language] || 'pl';
}

module.exports = {
    OLX_DOMAINS,
    getDomainConfig,
    getAvailableDomains,
    getDefaultDomain
};