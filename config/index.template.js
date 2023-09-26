// Server configuration
export const SERVER_PORT = 80;

// SSL Configuration
export const SSL_ENABLED = false; // Enable SSL
export const SSL_CERT = "certs/cf-origin.crt"; // SSL Certificate
export const SSL_KEY = "certs/cf-origin.key"; // SSL Private Key

// Rate limit, strict
// 10 requests per minute per user
export const WINDOW_MS = 60 * 1000; // 1 minute in milliseconds
export const RATE_LIMIT = 20;
export const NO_RATELIMIT_IPS = [];

// OpenAI Configuration
export const PROXIES = [
  // Add your proxies here
];

export const OPENAI_CONFIG = {
  BASE_URL: PROXIES[0]?.baseURL,
  KEY: PROXIES[0]?.key,
};

// Timeout
export const TIMEOUT_DURATION = 45 * 1000;

// Update interval
export const UPDATE_INTERVAL = 15 * 60 * 1000;
export const RETRY_INTERVAL = 5 * 60 * 1000;

// Blacklist
export const IP_BLACKLIST = [];

// Allowed Keys
export const ENABLE_KEY_SYSTEM = true;

// Error handling
export const ERROR_MESSAGE_ALL_PROXIES_DOWN =
  "All proxies are down, please try again later.";
export const ERROR_MESSAGE_GENERIC = "Something Went Wrong!";
export const ERROR_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
export const ERROR_COUNT_THRESHOLD = 5; // Number of errors allowed within ERROR_DURATION

// Logging
export const EVENT_CONF = {
  SRV_START: "blue",
  PATH: "yellow",
  QUESTION: "blue",
  PROXY_TESTED: "yellow",
  PROXY_UPDATED: "blue",
  ANSWERED: "green",
  OPENAI_ERR: "red",
  PROXY_ERR: "red",
  API_ERR: "red",
  REFETCHING_IN: "blue",
  WHITELISTED: "green",
  // GET POST PUT PATCH DELETE
  GET: "blue",
  POST: "yellow",
  PUT: "yellow",
  PATCH: "yellow",
  DELETE: "red",
  // GET POST PUT PATCH DELETE
  hidden: [
    // "PROXY_TESTED",
    // "PROXY_ERR",
    // "PROXY_UPDATED"
  ],
};
