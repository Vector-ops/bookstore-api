import fs from "fs";
import morgan from "morgan";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logDirectory = "logs";

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
	fs.mkdirSync(logDirectory);
}

// Define log format
const logFormat = format.printf(({ level, message, timestamp }) => {
	return `${timestamp} ${level}: ${message}`;
});
const morganLogFormat = format.printf(({ level, message, timestamp }) => {
	return `${timestamp} ${level}: ${message.status} ${message.method} ${message.url}`;
});

// Create a daily rotate file transport for general logging
const dailyRotateTransport = new DailyRotateFile({
	dirname: logDirectory,
	filename: "application-%DATE%.log",
	datePattern: "YYYY-MM-DD",
	maxSize: "100k",
	maxFiles: "7d",
});

// Create a daily rotate file transport for morgan logs
const morganRotateTransport = new DailyRotateFile({
	dirname: logDirectory,
	filename: "morgan-%DATE%.log",
	datePattern: "YYYY-MM-DD",
	maxSize: "1m",
	maxFiles: "7d",
});

// Create a logger for general logging
const logger = createLogger({
	level: "info",
	format: format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		logFormat
	),
	transports: [
		dailyRotateTransport,
		// new transports.Console(), // Add console transport for logging to console
	],
});

// Create a logger for morgan logs
const morganLogger = createLogger({
	level: "info",
	format: format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		logFormat // Adjust the format as needed
	),
	transports: [
		morganRotateTransport,
		new transports.Console(), // Add console transport for logging to console
	],
});

// Create a writable stream for morgan that forwards logs to morgan logger
const morganStream = {
	write: function (message: string) {
		morganLogger.info(message.trim());
	},
};

// Use morgan with the created stream
const morganMiddleware = morgan("tiny", { stream: morganStream });

export { logger, morganMiddleware };
