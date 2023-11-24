import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../config/prisma";
import { logger } from "../utils/logger";
import { registerSchema } from "../utils/validation";

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 * @returns {object} { message: string }
 */
export const registerUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, email, username, password } =
			await registerSchema.validateAsync(req.body);

		const user = await prisma.user.create({
			data: {
				name,
				email,
				username,
				password,
			},
		});

		if (!user) {
			return next(createHttpError.BadRequest("Unable to register user"));
		}

		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		console.log(error);
		logger.error(error);
		return next(
			createHttpError.InternalServerError("Unable to register user")
		);
	}
};

/**
 * @desc    Logout a user
 * @route   GET /api/auth/logout
 * @access  Private
 * @returns {object} { message: string }
 */
export const logoutUser = async (
	req: Request,
	_res: Response,
	next: NextFunction
) => {
	req.logOut({}, (err) => {
		console.error(err);
		logger.error(err);
		return next(createHttpError.BadRequest("Unable to logout user"));
	});
};
