import argon2 from "argon2";
import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../config/prisma";
import { UpdateData } from "../types/types";
import { logger } from "../utils/logger";

/**
 * @desc    Get a profile
 * @route   GET /api/profile
 * @access  Private
 * @returns {object} { message: string }
 */
export const getProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				id: req.session.passport?.user,
			},
		});

		if (!user) {
			return next(createHttpError.NotFound("User not found"));
		}

		res.status(200).json({
			name: user.name,
			email: user.email,
			username: user.username,
		});
	} catch (error) {
		logger.error(error);
		return next(createHttpError.InternalServerError("Unable to get user"));
	}
};

/**
 * @desc    Update a profile
 * @route   PUT /api/profile
 * @access  Private
 * @returns {object} { message: string }
 */
export const updateProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, email, username, password }: UpdateData = req.body;

		let updateData = {};

		const userExists = await prisma.user.findUnique({
			where: {
				id: req.session.passport?.user,
			},
		});

		if (!userExists) {
			return next(createHttpError.NotFound("User not found"));
		}

		if (userExists.sub) {
			updateData = {
				name: name || userExists.name,
				username: username || userExists.username,
			};
		} else {
			const hashedPassword = password
				? await argon2.hash(password)
				: userExists.password;
			updateData = {
				name: name || userExists.name,
				email: email || userExists.email,
				username: username || userExists.username,
				password: hashedPassword,
			};
		}

		await prisma.user.update({
			where: {
				id: req.session.passport?.user,
			},
			data: updateData,
		});

		res.status(200).json({ message: "User updated successfully" });
	} catch (error) {
		console.error(error);
		logger.error(error);
		return next(
			createHttpError.InternalServerError("Unable to update user")
		);
	}
};
