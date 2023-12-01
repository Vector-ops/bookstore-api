import express from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller";
import { validateSession } from "../middleware/validateSession";

export const profileRouter = express.Router();

profileRouter
	.route("/")
	.get(validateSession, getProfile)
	.put(validateSession, updateProfile);
