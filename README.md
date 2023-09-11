# AnirudhGPT-API

## Overview
AnirudhGPT-API is a free implementation of OpenAI's GPT-3.5-turbo model. It leverages multiple reverse proxies to optimize response times and provide a seamless experience. This project is built using Express.js and offers a range of utilities to manage requests, logging, and proxy testing.

🚨 **For Educational Purposes Only**: This project is intended solely for educational and research purposes. Please ensure you adhere to OpenAI's usage policies and guidelines when deploying or using this API.

## Main Features

- **Express Server**: The core of the project, set up using Express.js, which manages incoming requests and routes them appropriately.

- **Multiple Reverse Proxies**: The API is designed to test and utilize various proxies for OpenAI, ensuring optimal response times by selecting the fastest proxy.

- **Configuration**: A comprehensive configuration file allows users to specify server settings, rate limits, OpenAI configurations, and more.

- **Logging**: Integrated with Winston, the project offers robust logging capabilities, capturing events in both the console and external files.

- **Request Forwarding**: A dedicated utility forwards requests to OpenAI, catering to both streaming and non-streaming request types.

## Getting Started

1. Clone the repository.
2. Install dependencies with `npm install`.
3. Adjust the necessary configurations in `config/index.js`.
4. Launch the server using `node index.js`.

## Note
Ensure you have the required API keys and configurations for the proxies you plan to use.
