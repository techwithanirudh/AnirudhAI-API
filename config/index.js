let config;

// Check if index.local.js exists and use it, otherwise use the template
try {
    config = await import('./index.local.js');
} catch (error) {
    console.warn("Local configuration file (index.local.js) not found. Using default template.");
    config = await import('./index.template.js');
}

// TESTING: Sensitive Data
// config = { baseURL: 'https://api.openai.com', key: 'sk-123' }

// Export all properties from the chosen config
export const { 
    SERVER_PORT, 
    WINDOW_MS, 
    RATE_LIMIT, 
    PROXIES, 
    OPENAI_CONFIG, 
    TIMEOUT_DURATION, 
    UPDATE_INTERVAL, 
    RETRY_INTERVAL, 
    IP_BLACKLIST, 
    EVENT_CONF 
} = config;
