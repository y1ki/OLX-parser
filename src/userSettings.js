/**
 * User settings management
 */

// Storage for user settings
const userSettings = new Map();

/**
 * Default user settings
 */
const DEFAULT_SETTINGS = {
    language: 'en',
    domain: 'pl'
};

/**
 * Get user settings
 */
function getUserSettings(userId) {
    return userSettings.get(userId) || { ...DEFAULT_SETTINGS };
}

/**
 * Update user setting
 */
function updateUserSetting(userId, key, value) {
    const settings = getUserSettings(userId);
    settings[key] = value;
    userSettings.set(userId, settings);
}

/**
 * Get user language
 */
function getUserLanguage(userId) {
    const settings = getUserSettings(userId);
    return settings.language;
}

/**
 * Get user domain
 */
function getUserDomain(userId) {
    const settings = getUserSettings(userId);
    return settings.domain;
}

/**
 * Set user language
 */
function setUserLanguage(userId, language) {
    updateUserSetting(userId, 'language', language);
}

/**
 * Set user domain
 */
function setUserDomain(userId, domain) {
    updateUserSetting(userId, 'domain', domain);
}

module.exports = {
    getUserSettings,
    updateUserSetting,
    getUserLanguage,
    getUserDomain,
    setUserLanguage,
    setUserDomain
};