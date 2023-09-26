let config;

// Check if index.local.js exists and use it, otherwise use the template
try {
    config = await import('./index.local.js');
} catch (error) {
    console.warn("Local configuration file (index.local.js) not found. Using default template.");
    config = await import('./index.template.js');
}

// Export all properties from the chosen config
export const {
    SERVER_PORT,
    WINDOW_MS,
    RATE_LIMIT,
    NO_RATELIMIT_IPS,
    SSL_ENABLED,
    SSL_CERT,
    SSL_KEY,
    PROXIES,
    OPENAI_CONFIG,
    TIMEOUT_DURATION,
    UPDATE_INTERVAL,
    RETRY_INTERVAL,
    IP_BLACKLIST,
    EVENT_CONF,
    ENABLE_KEY_SYSTEM,
    ERROR_MESSAGE_ALL_PROXIES_DOWN,
    ERROR_MESSAGE_GENERIC,
    ERROR_DURATION,
    ERROR_COUNT_THRESHOLD
} = config;
