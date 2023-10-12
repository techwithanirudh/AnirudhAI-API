import chalk from "chalk";
import { EVENT_CONF, MAX_ERROR_LENGTH } from "../config/index.js";
import winston from "winston";
import stripAnsi from "strip-ansi";

// Create a logger instance and configure it
const logger = winston.createLogger({
  level: "info", // You can adjust the log level as needed
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      const colorFunc = chalk[EVENT_CONF[level] || "reset"];
      return `${timestamp} ${colorFunc(message)}`;
    }),
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.printf(({ level, message }) => {
        const colorFunc = chalk[EVENT_CONF[level] || "reset"];
        return colorFunc(message);
      }),
    }),
    new winston.transports.File({
      filename: "logs/main.log", // Replace with the actual path
      format: winston.format.printf(({ timestamp, level, message }) => {
        const messageWithoutColors = stripAnsi(message);
        return `${timestamp} ${messageWithoutColors}`;
      }),
    }),
  ],
});

const event = (evtname, ...args) => {
  if (EVENT_CONF?.hidden?.includes(evtname)) {
    return;
  }

  const style = EVENT_CONF[evtname] ? EVENT_CONF[evtname] : "yellow";
  const logMessage = `${chalk[style](`[${evtname}]`)} ${args.join(" ")}`;

  // Log to console and file using the configured logger
  logger.info(logMessage);
};


const truncateError = (error) => {
  if (typeof error !== 'string') {
    error = String(error);
  }
  
  if (error.length > MAX_ERROR_LENGTH) {
    return error.slice(0, MAX_ERROR_LENGTH) + "...";
  }
  
  return error;
}

export { event, truncateError };
