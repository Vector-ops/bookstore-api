import { NextFunction, Request, Response } from "express";

const logger = (req: Request, _res: Response, next: NextFunction) => {
	const method = req.method;
	const url = req.url;
	const time = new Date().getFullYear();
	console.log(method, url, time);
	next();
};

module.exports = logger;
