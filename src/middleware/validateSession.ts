import { NextFunction, Request, RequestHandler, Response } from "express";
import createHttpError from "http-errors";

export const validateSession: RequestHandler = (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	if (req.session.passport?.user) {
		next();
	} else {
		return next(createHttpError.Unauthorized("You are not logged in."));
	}
};
