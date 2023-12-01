import argon2 from "argon2";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../config/prisma";
import { logger } from "../utils/logger";
import { registerSchema } from "../utils/validation";

declare module "express-session" {
	export interface SessionData {
		passport: {
			user: string;
		};
	}
}

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

		const emailExists = await prisma.user.findFirst({
			where: {
				email,
			},
		});
		const usernameExists = await prisma.user.findFirst({
			where: {
				username,
			},
		});

		if (emailExists) {
			return next(
				createHttpError.Conflict("User with that email already exists")
			);
		}
		if (usernameExists) {
			return next(
				createHttpError.Conflict(
					"User with that username already exists"
				)
			);
		}

		const hashedPassword = await argon2.hash(password);

		const user = await prisma.user.create({
			data: {
				name,
				email,
				username,
				password: hashedPassword,
			},
		});

		if (!user) {
			return next(createHttpError.BadRequest("Unable to register user"));
		}

		res.status(201).json({ message: "User registered successfully" });
	} catch (error) {
		console.log(error);
		logger.error(error);

		if (error.isJoi === true) {
			if (error.details[0].message.includes("email")) {
				return next(createHttpError.BadRequest("Email is invalid"));
			} else if (error.details[0].message.includes("username")) {
				return next(createHttpError.BadRequest("Username is invalid"));
			} else if (error.details[0].message.includes("password")) {
				return next(
					createHttpError.BadRequest(
						"Password must be atleast 8 characters long."
					)
				);
			}
			return next(createHttpError.BadRequest(error.details[0].message));
		}
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
