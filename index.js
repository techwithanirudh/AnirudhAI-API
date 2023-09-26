import http from 'http';
import https from 'https';
import { SSL_CERT, SSL_KEY, SSL_ENABLED } from './config/index.js';

import fs from 'fs';

import express, { json, urlencoded } from 'express';
import { forwardRequest, getKey, handleWhitelist, keyLimiter } from './utils/index.js';
import { updateCurrentProxy } from './utils/proxyTester.js';

import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { RATE_LIMIT, SERVER_PORT, WINDOW_MS, IP_BLACKLIST, ENABLE_KEY_SYSTEM } from './config/index.js';
import { event } from "./utils/index.js";

import { IpFilter as ipfilter } from 'express-ipfilter';

console.event = event;

// Create express app
let app = express();
app.disable('x-powered-by');

process.on("uncaughtException", function (err) {
	console.error(`Caught exception: ${err}`);
});

// Middleware
const limiter = rateLimit({
	windowMs: WINDOW_MS,
	max: RATE_LIMIT,
	keyGenerator: function (req) {
		const whitelisted = handleWhitelist(req);
		if (whitelisted.whitelisted) return whitelisted.key;
		if (ENABLE_KEY_SYSTEM) return req.headers.authorization;
		return req.ip;
	},
	standardHeaders: true,
	legacyHeaders: false
});

app.set('trust proxy', 1);
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(ipfilter({
	filter: IP_BLACKLIST,
	forbidden: 'A internal server error occurred. Error code: getwrekt',
	logLevel: 'deny',
}));
app.use(limiter);
if (ENABLE_KEY_SYSTEM) app.use('/v1', keyLimiter);

app.use(async (req, res, next) => {
	if (getKey(req.headers)) {
		console.event(req.method, `${req.path} - ${getKey(req.headers)} - ${req.ip}`);
	} else {
		console.event(req.method, `${req.path} - ${req.ip}`);
	}
	next();
});

// Register routes
app.all("/", async function (req, res) {
	const message = {
		'status': 'ok',
		'message': 'You have reached the OpenAI API. To get started, visit https://platform.openai.com'
	};
	return res.status(200).send(message);
});
app.all("/v1/*", forwardRequest);

if (SSL_ENABLED) {
	const privateKey = fs.readFileSync(SSL_KEY, 'utf8');
	const certificate = fs.readFileSync(SSL_CERT, 'utf8');
	const credentials = { key: privateKey, cert: certificate };
	const httpsServer = https.createServer(credentials, app);

	httpsServer.listen(SERVER_PORT, () => {
		// Update proxy to best proxy
		updateCurrentProxy();

		console.event('SRV_START', `HTTPS Server is listening on port ${SERVER_PORT}`);
	});
} else {
	const httpServer = http.createServer(app);

	httpServer.listen(SERVER_PORT, () => {
		// Update proxy to best proxy
		updateCurrentProxy();

		console.event('SRV_START', `HTTP Server is listening on port ${SERVER_PORT}`);
	});
}
