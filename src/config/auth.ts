import { User } from "@prisma/client";
import argon2 from "argon2";
import passport, { Profile } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import prisma from "./prisma";

const verifyLocal = async (
	username: string,
	password: string,
	done: (error: any, user?: any) => void
) => {
	try {
		const user = await prisma.user.findUnique({
			where: {
				username,
			},
		});
		if (!user) {
			return done(null, false);
		}

		const validPassword = await argon2.verify(user.password, password);

		if (!validPassword) {
			return done(null, false);
		}

		return done(null, user);
	} catch (error) {
		return done(error);
	}
};

// Configure Google Strategy
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID || "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
			callbackURL: "/auth/google/callback",
		},
		(
			_accessToken: string,
			_refreshToken: string,
			profile: Profile,
			done: (error: any, user?: any) => void
		) => {
			// Handle user data or authentication here
			// 'profile' contains user details returned by Google
			console.log(profile);
			return done(null, profile);
		}
	)
);

// Configure Local Strategy
passport.use(new LocalStrategy(verifyLocal));

passport.serializeUser<User, any>(
	(user: User, done: (error: any, user?: any) => void) => {
		done(null, user.id);
	}
);

passport.deserializeUser<any, any>(async (id, done) => {
	try {
		const user = await prisma.user.findFirst({ where: { id } });

		done(null, user);
	} catch (error) {
		done(error);
	}
});
