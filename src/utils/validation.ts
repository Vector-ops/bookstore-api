import Joi from "joi";

export const registerSchema = Joi.object({
	name: Joi.string().min(3),
	username: Joi.string().alphanum().min(3).max(30).lowercase(),
	email: Joi.string().email({
		minDomainSegments: 2,
		tlds: { allow: ["com", "net"] },
	}),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{5,30}$"))
		.required()
		.min(8),
});

export const loginSchema = Joi.object({
	username: Joi.string().alphanum().min(3).max(30).lowercase(),
	email: Joi.string().email({
		minDomainSegments: 2,
		tlds: { allow: ["com", "net"] },
	}),
	password: Joi.string()
		.pattern(new RegExp("^[a-zA-Z0-9]{5,30}$"))
		.required()
		.min(8),
})
	.xor("username", "email")
	.with("email", "password")
	.with("username", "password");
