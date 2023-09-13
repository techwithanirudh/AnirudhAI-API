import express, { json, urlencoded } from 'express';
import { forwardRequest } from './utils/index.js';

import { updateCurrentProxy } from './utils/proxyTester.js';

import cors from 'cors';
import rateLimit from 'express-rate-limit'

import { RATE_LIMIT, SERVER_PORT, WINDOW_MS, IP_BLACKLIST } from './config/index.js';
import { event } from "./utils/index.js";

import { IpFilter as ipfilter } from 'express-ipfilter';

console.event = event;

let app = express();
app.set("trust proxy", 1);

process.on("uncaughtException", function(err) {
	console.error(`Caught exception: ${err}`);
});

// Middlewares
const limiter = rateLimit({
	windowMs: WINDOW_MS, // 15 seconds
	max: RATE_LIMIT,
	standardHeaders: true,
	legacyHeaders: false
})

// Create the server
app.set('trust proxy', 1); // trust first proxy
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(
	ipfilter({
		filter: IP_BLACKLIST,
		forbidden: 'A internal server error occured. Error code: getwrekt',
		logLevel: 'deny',
	}),
);
app.use(limiter);

app.use(async (req, res, next) => {
	console.event('PATH', `${req.path} - ${req.ip}`);
	next();
});

// Register routes
app.all("/", async function(req, res) {
	return res.sendStatus(200);
});
app.all("/update", async function (req, res) {
	await updateCurrentProxy();
	return res.status(200).send('Update successful, AnirudhGPT API should be stable now.')
});
app.all("/v1/*", forwardRequest);

// Start the Express server
app.listen(SERVER_PORT, () => {
	// Update proxy to best proxy
	updateCurrentProxy();

	// Listening
	console.event('SRV_START', `Server is listening on port ${SERVER_PORT}`);
});
