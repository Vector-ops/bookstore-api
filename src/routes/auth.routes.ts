import express from "express";
import passport from "passport";
import { logoutUser, registerUser } from "../controllers/auth.controller";

const CLIENT_URL = "http://localhost:5173";

const authRouter = express.Router();

authRouter.route("/login").post(
	passport.authenticate("local", {
		successReturnToOrRedirect: "/api/auth/redirect",
		failureMessage: "Unable to login",
	})
);

authRouter.route("/redirect").get((_req, res) => {
	res.status(200).send("Logged in");
});

authRouter
	.route("/google")
	.get(passport.authenticate("google", { scope: ["email", "profile"] }));

authRouter.route("/google/callback").get(
	passport.authenticate("google", {
		successRedirect: CLIENT_URL,
		failureMessage: "Unable to login with Google",
	})
);

authRouter.route("/signup").post(registerUser);

authRouter.route("/logout").get(logoutUser);

export default authRouter;
