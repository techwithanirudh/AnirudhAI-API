import OpenAI from "openai";
import { event } from "./logging.js";
import { PROXIES, OPENAI_CONFIG, TIMEOUT_DURATION, UPDATE_INTERVAL, RETRY_INTERVAL } from "../config/index.js";

console.event = event;

async function testProxy(proxy) {
	const openai = new OpenAI({
		apiKey: proxy.key,
		baseURL: proxy.baseURL + '/v1/',
		timeout: TIMEOUT_DURATION,
	});

	const startTime = Date.now(); // Start the timer

	try {
		const chatCompletion = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages: [
				{ role: "system", content: "You are a helpful assistant." },
				{ role: "user", content: "Who won the world cup in 2018?" }
			]
		});

		// Check if the chatCompletion response is valid
		if (!chatCompletion || !chatCompletion.choices || !chatCompletion.choices[0] || !chatCompletion.choices[0].message || !chatCompletion.choices[0].message.content) {
			return { isValid: false };
		}

		// Check for non-200 status codes
		if (chatCompletion.status_code && chatCompletion.status_code !== 200) {
			console.event('NON_200_STATUS', chatCompletion.status_code, proxy.baseURL);
			return { isValid: false };
		}

		const duration = Date.now() - startTime; // Calculate the duration
		return { isValid: true, duration }; // Return the duration along with validity
	} catch (error) {
		console.event('PROXY_ERR', proxy.baseURL);
		return { isValid: false };
	}
}

export async function updateCurrentProxy() {
	let fastestProxy = null;
	let minDuration = Infinity;

	for (const proxy of PROXIES) {
		const { isValid, duration } = await testProxy(proxy);
		if (isValid) {
			console.event('PROXY_TESTED', proxy.baseURL, duration);
			if (duration < minDuration) {
				minDuration = duration;
				fastestProxy = proxy;
			}
		}
	}

	if (fastestProxy) {
		OPENAI_CONFIG.BASE_URL = fastestProxy.baseURL;
		OPENAI_CONFIG.KEY = fastestProxy.key;
		console.event('PROXY_UPDATED', OPENAI_CONFIG.BASE_URL);
	} else {
		OPENAI_CONFIG.BASE_URL = '';
		OPENAI_CONFIG.KEY = '';
		
		console.event('REFETCHING_IN', `${RETRY_INTERVAL / (60 * 1000)}m`)
		setTimeout(updateCurrentProxy, RETRY_INTERVAL); 
	}
}

// Schedule the Proxy Update using the interval from the config file
setInterval(updateCurrentProxy, UPDATE_INTERVAL);
