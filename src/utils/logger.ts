import fs from "fs";
import morgan from "morgan";
import { createLogger, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logDirectory = "logs"; // Define the logs directory

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
	fs.mkdirSync(logDirectory);
}

// Define log format
const logFormat = format.printf(({ level, message, timestamp }) => {
	return `${timestamp} ${level}: ${message}`;
});

// Create a daily rotate file transport
const dailyRotateTransport = new DailyRotateFile({
	dirname: logDirectory,
	filename: "application-%DATE%.log",
	datePattern: "YYYY-MM-DD",
	maxSize: "30k",
	maxFiles: "30d",
});

// Create a logger
const logger = createLogger({
	level: "info", // Set the log level
	format: format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		logFormat
	),
	transports: [dailyRotateTransport],
});

// export default logger;

const morganLogger = createLogger({
	level: "info", // Set the log level for morgan logs
	format: format.combine(
		format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
		format.json() // You can adjust the format as needed
	),
	transports: [
		new DailyRotateFile({
			dirname: logDirectory,
			filename: "morgan-%DATE%.log",
			datePattern: "YYYY-MM-DD",
			maxSize: "30k",
			maxFiles: "30d",
		}),
	],
});

// Create a writable stream for morgan that forwards logs to morgan logger
const morganStream = {
	write: function (message: string) {
		morganLogger.info(message.trim());
	},
};

// Use morgan with the created stream
const morganMiddleware = morgan("combined", { stream: morganStream });

export { logger, morganMiddleware };
