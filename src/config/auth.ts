import { User } from "@prisma/client";
import argon2 from "argon2";
import passport, { Profile } from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { logger } from "../utils/logger";
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
			callbackURL: "http://localhost:3000/api/auth/google/callback",
		},
		async (
			_accessToken: string,
			_refreshToken: string,
			profile: Profile,
			done: (error: any, user?: any) => void
		) => {
			try {
				const user = await prisma.user.findUnique({
					where: {
						email: profile.emails![0].value,
					},
				});
				if (user) {
					return done(null, user);
				}

				await prisma.user.create({
					data: {
						name: profile.displayName,
						email: profile.emails![0].value,
						username: profile.name!.givenName,
						password: profile.id,
						sub: profile.id,
					},
				});

				return done(null, profile);
			} catch (error) {
				logger.error(error);
				return done(error);
			}
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
		logger.error(error);
		done(error);
	}
});
