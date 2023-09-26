import axios from "axios";
import { event } from "./logging.js";
import {
  OPENAI_CONFIG,
  ERROR_MESSAGE_ALL_PROXIES_DOWN,
  ERROR_MESSAGE_GENERIC,
  ERROR_DURATION,
  ERROR_COUNT_THRESHOLD,
} from "../config/index.js";
import { updateCurrentProxy } from "./proxyTester.js";

console.event = event;

let errorTimestamps = [];

async function forwardRequest(req, res) {
  const path = req.path.replace("/v1/v1", "/v1");

  if (!OPENAI_CONFIG.BASE_URL && !OPENAI_CONFIG.KEY) {
    return sendServerError(res, ERROR_MESSAGE_ALL_PROXIES_DOWN);
  }

  if (req.body.prompt) {
    console.event("QUESTION", req.body.prompt);
  } else if (req.body.messages) {
    const messages = req.body.messages;
    console.event("QUESTION", messages[messages.length - 1].content);
  }

  try {
    const axiosConfig = {
      method: req.method,
      url: `${OPENAI_CONFIG.BASE_URL}${path}`,
      responseType: req.body.stream ? "stream" : "",
      cookies: req.cookies,
      headers: {
        authorization: `Bearer ${OPENAI_CONFIG.KEY}`,
        host: new URL(OPENAI_CONFIG.BASE_URL).host,
      },
    };

    if (req.body) {
      axiosConfig.data = req.body;
    }

    const response = await axios(axiosConfig);

    if (req.body.stream) {
      res.setHeader("content-type", "text/event-stream");
      response.data.pipe(res);
    } else {
      res.status(response.status).send(response.data);
    }
  } catch (error) {
    console.event("API_ERR", error);
    addErrorTimestamp();
    await handleOpenAIError(error, req, res);
  }
}

function addErrorTimestamp() {
  const now = Date.now();
  errorTimestamps.push(now);

  // Remove timestamps that are older than ERROR_DURATION
  errorTimestamps = errorTimestamps.filter(
    (timestamp) => now - timestamp <= ERROR_DURATION,
  );

  if (errorTimestamps.length > ERROR_COUNT_THRESHOLD) {
    console.event(
      "REFETCHING_IN",
      `1s as API Error was triggered more than ${ERROR_COUNT_THRESHOLD} times within ${
        ERROR_DURATION / 1000
      } seconds, refetching`,
    );
    updateCurrentProxy();
    errorTimestamps = []; // Reset the error timestamps
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
        console.event(
          "PARSE_ERR",
          "Could not JSON parse stream message",
          error,
        );
        sendServerError(res);
      }
    } catch (e) {
      console.event("UNKNOWN_ERR", e);
      sendServerError(res);
    }
  }
}

function sendServerError(res, message = ERROR_MESSAGE_GENERIC) {
  res.status(500).send({
    status: false,
    error: message,
  });
}

export { forwardRequest };
