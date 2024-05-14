import { errorHandler } from "./middleware/errorHandler";
import { notFound } from "./middleware/notFound";

import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import expressSession from "express-session";
// import morgan from "morgan";
import passport from "passport";
import prisma from "./config/prisma";
import authRouter from "./routes/auth.routes";
import { booksRouter } from "./routes/books.routes";
import { profileRouter } from "./routes/profile.routes";
import { logger, morganMiddleware } from "./utils/logger";
require("./config/auth");

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(
	cors({
		origin: [process.env.CLIENT_URL!],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE"],
		allowedHeaders: [
			"X-CSRF-Token",
			"X-Requested-With",
			"Accept",
			"Accept-Version",
			"Content-Length",
			"Content-MD5",
			"Content-Type",
			"Date",
			"X-Api-Version",
		],
	})
);
app.use(bodyParser.json());
app.use(morganMiddleware);

const sessionStore = new PrismaSessionStore(prisma, {
	checkPeriod: 2 * 60 * 1000, // 2 mins
	dbRecordIdIsSessionId: true,
	dbRecordIdFunction: undefined,
});

app.use(
	expressSession({
		name: "sid",
		cookie: {
			maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
		},
		secret: process.env.SESSION_SECRET!,
		resave: true, // don't save session if unmodified
		saveUninitialized: false, // don't create session until something stored
		// @ts-ignore
		store: sessionStore,
	})
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/books", booksRouter);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
	logger.info(`Server started on port ${PORT}`);
});

process.on("SIGINT", async () => {
	await prisma.$disconnect();
	logger.info("SIGINT signal received. Stopping server.");
	process.exit();
});
