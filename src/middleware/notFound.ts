import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

export const notFound = (_req: Request, _res: Response, next: NextFunction) => {
	next(createHttpError.NotFound("Page does not exist"));
};
