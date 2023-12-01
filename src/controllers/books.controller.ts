import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import prisma from "../config/prisma";
import { logger } from "../utils/logger";

/**
 * @desc    Get all books
 * @route   GET /api/books
 * @access  Public
 * @returns {object} { message: string }
 */
export const getBooks = async (
	_req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const sections = await prisma.section.findMany({
			select: {
				type: true,
				_count: true,
				books: {
					orderBy: {
						title: "asc",
					},
					select: {
						id: true,
						title: true,
						author: true,
						description: true,
						available: true,
						buyable: true,
						borrowed: true,
						BookPrice: {
							select: {
								sellingPrice: true,
							},
						},
					},
				},
			},
			orderBy: {
				type: "asc",
			},
		});
		res.status(200).json(sections);
	} catch (error) {
		logger.error(error);
		console.error(error);
		return next(createHttpError.InternalServerError("Unable to get books"));
	}
};

/**
 * @desc    Get a book
 * @route   GET /api/books/:id
 * @access  Public
 * @returns {object} { message: string }
 */
export const getBook = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = req.params.id;
		const book = await prisma.book.findUnique({
			where: {
				id,
			},
			select: {
				id: true,
				title: true,
				author: true,
				description: true,
				available: true,
				buyable: true,
				borrowed: true,
				count: true,
				section: {
					select: {
						type: true,
					},
				},
				BookPrice: {
					select: {
						sellingPrice: true,
					},
				},
			},
		});

		if (!book) {
			return next(createHttpError.NotFound("Book not found"));
		}
		res.status(200).json(book);
	} catch (error) {
		logger.error(error);
		console.error(error);
		return next(createHttpError.InternalServerError("Unable to get book"));
	}
};

/**
 * @desc    Get book suggestions
 * @route   GET /api/books/suggestions?author=author&section=section
 * @access  Public
 * @returns {object} { message: string }
 */

export const getSuggestions = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const author = req.query.author as string;
		const section = req.query.section as string;
		const limit = parseInt(req.query.limit as string);
		const id = req.query.id as string;

		const suggestions = await prisma.book.findMany({
			where: {
				OR: [
					{
						section: {
							type: section,
						},
					},
					{
						author,
					},
				],
				AND: [
					{
						NOT: {
							id: {
								equals: id,
							},
						},
					},
					{
						NOT: {
							available: {
								equals: false,
							},
						},
					},
				],
			},
			select: {
				id: true,
				title: true,
				author: true,
				description: true,
				available: true,
				buyable: true,
				borrowed: true,
				count: true,
				section: {
					select: {
						type: true,
					},
				},
				BookPrice: {
					select: {
						sellingPrice: true,
					},
				},
			},
			take: limit,
		});

		res.status(200).json(suggestions);
	} catch (error) {
		logger.error(error);
		console.error(error);
		return next(
			createHttpError.InternalServerError("Unable to get suggestions")
		);
	}
};

/**
 * @desc    Get searched book
 * @route   GET /api/books/search/:search
 * @access  Public
 * @returns {object} { message: string }
 */

export const getSearchedBooks = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { search } = req.params;
		const books = await prisma.book.findMany({
			where: {
				OR: [
					{
						title: {
							contains: search,
							mode: "insensitive",
						},
					},
					{
						author: {
							contains: search,
							mode: "insensitive",
						},
					},
				],
			},
			select: {
				id: true,
				title: true,
				author: true,
				description: true,
				available: true,
				buyable: true,
				borrowed: true,
				count: true,
				section: {
					select: {
						type: true,
					},
				},
				BookPrice: {
					select: {
						sellingPrice: true,
					},
				},
			},
		});

		if (!books) {
			return next(
				createHttpError.InternalServerError("Unable to get books")
			);
		}
		console.log(books);
		res.status(200).json(books);
	} catch (error) {
		logger.error(error);
		console.error(error);
		return next(
			createHttpError.InternalServerError("Unable to get suggestions")
		);
	}
};
