import { Router } from "express";
import {
	getBook,
	getBooks,
	getSearchedBooks,
	getSuggestions,
} from "../controllers/books.controller";

export const booksRouter = Router();

booksRouter.route("/").get(getBooks);
booksRouter.route("/suggestions").get(getSuggestions);
booksRouter.route("/search/:search").get(getSearchedBooks);
booksRouter.route("/:id").get(getBook);
