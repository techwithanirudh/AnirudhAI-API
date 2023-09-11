// Server configuration
export const SERVER_PORT = 3000; // Server port

// Rate limit
export const WINDOW_MS = 15 * 1000; // 15 seconds
export const RATE_LIMIT = 50; // 50 requests per 15 seconds

// OpenAI Configuration
const PROXIES = [
	// Add your proxies below.
	// Example:
	{ baseURL: "https://api.openai.com", key: "sk-123" }
]

export const OPENAI_CONFIG = {
	BASE_URL: PROXIES[0].baseURL,
	KEY: PROXIES[0].key
};

// Timeout
export const TIMEOUT_DURATION = 20 * 1000;

// Update interval
export const UPDATE_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds
export const RETRY_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds

// Blacklist
export const IP_BLACKLIST = []

// Logging
export const EVENT_CONF = {
	SRV_START: 'blue',
	PATH: 'yellow',
	QUESTION: 'blue',
	PROXY_TESTED: 'yellow',
	PROXY_UPDATED: 'blue',
	ANSWERED: 'green',
	OPENAI_ERR: 'red',
	PROXY_ERR: 'red',
	REFETCHING_IN: 'blue',
	hidden: [
		// "PROXY_TESTED",
		// "PROXY_ERR",
		// "PROXY_UPDATED"
	]
};
