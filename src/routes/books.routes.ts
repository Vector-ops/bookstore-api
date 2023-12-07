import { Router } from "express";
import {
	addOrRemoveBookmark,
	addOrRemoveCart,
	getBook,
	getBookmarks,
	getBooks,
	getCart,
	getSearchedBookmarks,
	getSearchedBooks,
	getSuggestions,
} from "../controllers/books.controller";
import { validateSession } from "../middleware/validateSession";

export const booksRouter = Router();

booksRouter.route("/").get(validateSession, getBooks);
booksRouter.route("/suggestions").get(getSuggestions);
booksRouter
	.route("/bookmarks")
	.get(validateSession, getBookmarks)
	.post(validateSession, addOrRemoveBookmark);
booksRouter
	.route("/bookmarks/:search")
	.get(validateSession, getSearchedBookmarks);
booksRouter.route("/search/:search").get(getSearchedBooks);
booksRouter
	.route("/cart")
	.get(validateSession, getCart)
	.post(validateSession, addOrRemoveCart);
booksRouter.route("/:id").get(getBook);
