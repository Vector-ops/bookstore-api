import express from "express";
import passport from "passport";
import { logoutUser, registerUser } from "../controllers/auth.controller";

const authRouter = express.Router();

authRouter.route("/login").post(
	passport.authenticate("local", {
		failureRedirect: "/login-failure",
		successRedirect: "login-success",
	})
);

authRouter
	.route("/google")
	.get(passport.authenticate("google", { scope: ["email", "profile"] }));

authRouter.route("/auth/google/callback").get(
	passport.authenticate("google", {
		successRedirect: "/protected",
		failureRedirect: "/auth/google/failure",
	})
);

authRouter.route("/logout").get(logoutUser);

authRouter.route("/signup").post(registerUser);

export default authRouter;
