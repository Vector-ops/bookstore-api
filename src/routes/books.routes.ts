import { Router } from "express";
import {
	addOrRemoveBookmark,
	addOrRemoveCart,
	buyBooks,
	getBook,
	getBookmarks,
	getBooks,
	getCarouselBooks,
	getCart,
	getSearchedBookmarks,
	getSearchedBooks,
	getSuggestions,
} from "../controllers/books.controller";
import { validateSession } from "../middleware/validateSession";

export const booksRouter = Router();

booksRouter.route("/").get(getBooks);
booksRouter.route("/suggestions").get(getSuggestions);
booksRouter.route("/carousel").get(getCarouselBooks);
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
booksRouter.route("/buy").post(validateSession, buyBooks);
booksRouter.route("/:id").get(getBook);
