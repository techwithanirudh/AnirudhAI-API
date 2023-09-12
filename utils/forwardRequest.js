import axios from 'axios';
import { event } from "./logging.js";
import { OPENAI_CONFIG } from "../config/index.js";

console.event = event;


async function forwardRequest(req, res) {
		const path = req.path.replace('/v1/v1', '/v1');
	
		if (!OPENAI_CONFIG.BASE_URL && !OPENAI_CONFIG.KEY) {
			return sendServerError(res, 'All proxies are down, please try again later.');
		}
	
    if (req?.body?.prompt) {
        console.event('QUESTION', req?.body?.prompt);
    } else if (req?.body?.messages) {
        const messages = req?.body?.messages;
        console.event('QUESTION', messages[messages.length - 1]?.content);
    }

    try {
        const axiosConfig = {
            method: req.method,
            url: `${OPENAI_CONFIG.BASE_URL}${path}`,
            responseType: req?.body?.stream ? 'stream' : ''
        };

        if (['POST', 'PUT', 'PATCH'].includes(req.method.toUpperCase())) {
            axiosConfig.data = req.body;
            axiosConfig.headers = {
                authorization: `Bearer ${OPENAI_CONFIG.KEY}`,
                host: new URL(OPENAI_CONFIG.BASE_URL).host
            };
        }

        const response = await axios(axiosConfig);

        if (req.body.stream) {
            res.setHeader("content-type", "text/event-stream");
            response.data.pipe(res);
        } else {
            res.status(response.status).send(response.data);
        }
    } catch (error) {
        await handleOpenAIError(error, req, res);
    }
}

async function handleOpenAIError(error, req, res) {
	if (!req.body.stream) {
		if (error.response) {
			res.status(error.response.status).send(error.response.data);
		} else {
			res.sendStatus(500);
		}
	} else {
		try {
			if (error.response && error.response.data) {
				let errorResponseStr = "";

				for await (const message of error.response.data) {
					errorResponseStr += message;
				}

				const errorResponseJson = JSON.parse(errorResponseStr);
				return res.status(error.response.status).send(errorResponseJson);
			} else {
				console.event("PARSE_ERR", "Could not JSON parse stream message", error);
				sendServerError(res);
			}
		} catch (e) {	
			console.event('UNKNOWN_ERR', e);
			sendServerError(res);
		}
	}
}

function sendServerError(res, message) {
	res.status(500).send({
		status: false,
		error: message | "Something Went Wrong!"
	});
}

export { forwardRequest };
