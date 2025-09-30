import Joi from "joi";

export const signupSchema = Joi.object({
  username: Joi.string().min(3).max(50).required().messages({
    "string.base": "Username must be a string.",
    "string.empty": "Full name is required",
    "string.min": "Full name must be at least 3 characters",
    "string.max": "Full name must not exceed 50 characters",
    "any.required": "Username is required.",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string.",
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),
  password: Joi.string()
    .min(8)
    .max(64)
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*()_\\-+=[\\]{};':\"\\\\|,.<>/?`~])"
      )
    )

    .messages({
      "string.base": "Password must be a string.",
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "string.max": "Password must not exceed 64 characters",
      "string.pattern.base":
        "Password must contain uppercase, lowercase, number, and special character",
      "any.required": "Password is required.",
    }),
});

export const verificationEmailSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string.",
    "string.empty": "Email is required",
    "string.email": "Please enter a valid email address.",
    "any.required": "Email is required.",
  }),
  token: Joi.string() .length(64).required().messages({
    "string.base": "Token must be a string.",
    "string.empty": "Token is required.",
    "string.length": "Token is invalid.", // Use a
    "any.required": "Token is required.",
  }),
});

export const verifyOtpSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
  }),
  otpCode: Joi.string().length(6).pattern(/^\d+$/).required().messages({
    "string.empty": "OTP code is required",
    "string.length": "OTP code must be exactly 6 digits",
    "string.pattern.base": "OTP code must contain only digits",
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be valid",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});
