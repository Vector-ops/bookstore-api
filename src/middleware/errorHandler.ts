import { NextFunction, Request, Response } from "express";

export const errorHandler = (
	err: any,
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	const status = err.status ? err.status : 500;
	const message = err.message ? err.message : "Internal Server Error";
	res.status(status);
	return res.json({
		error: {
			status: status,
			message: message,
		},
	});
};
