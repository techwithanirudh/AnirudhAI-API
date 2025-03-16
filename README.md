# AnirudhAI-API

> [!WARNING]  
> This project is not actively maintained. It is recommended to use alternatives like [LiteLLM](https://www.litellm.ai/), which provides a similar experience. 

## Overview

AnirudhAI-API is designed to offer a stable and optimized experience when interacting with language models like OpenAI's GPT-3.5 and GPT-4. Built on Express.js, this project aims to provide a reliable interface for OpenAI's API, with the added capability of using reverse proxies for potentially free access. Users are fully responsible for how they use this feature.

🚨 **Compliance and Legal Notice**: This project can be configured for both free and paid access to OpenAI's API. Users are solely responsible for adhering to OpenAI's terms of service. Illegal use is strictly prohibited.

## Main Features

- **Express Server**: The core of the project, efficiently managing incoming requests and routing them to OpenAI's API.

- **Free Access Option**: While the project can be configured to use reverse proxies for potentially free access, users are liable for how they use this feature.

- **Configuration**: A robust configuration file allows users to specify server settings, rate limits, and API parameters.

- **Logging**: Utilizes Winston for comprehensive logging capabilities, capturing events in both the console and external files.

- **Request Forwarding**: Specialized utilities forward requests to OpenAI's API, supporting both streaming and non-streaming request types.

## Getting Started

1. Clone the repository.
2. Install dependencies using `npm install`.
3. Update the configurations in `config/index.js` to match OpenAI's API settings.
4. Launch the server using `node index.js`.

## Note

Ensure you have the required API keys and configurations for OpenAI's API. You are solely responsible for any free or unauthorized usage.
