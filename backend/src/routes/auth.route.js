import { Router } from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  resendVerificationEmail,
  verifyOtp,
  resendVerificationOtp,
  requestPasswordReset,
  verifyAndrestPassword,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  loginSchema,
  resendVerificationOtpSchema,
  resetPasswordSchema,
  signupSchema,
  verificationEmailSchema,
  verifyOtpSchema,
  verifyRestPasswordSchema,
} from "../validation/auth.validation.js";
import { sanitizeRequest } from "../middlewares/sanitizeRequest.js";

const router = Router();

router.post("/signup", validate(signupSchema), sanitizeRequest, signup);
router.post(
  "/verify-email",
  sanitizeRequest,
  validate(verificationEmailSchema),
  verifyEmail
);
router.post("/reverify-email", sanitizeRequest, resendVerificationEmail);

router.post("/login", validate(loginSchema), sanitizeRequest, login);
router.post(
  "/verify-otp",
  validate(verifyOtpSchema),
  sanitizeRequest,
  verifyOtp
);

router.post(
  "/resend-verification-Otp",
  validate(resendVerificationOtpSchema),
  sanitizeRequest,
  resendVerificationOtp
);

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  sanitizeRequest,
  requestPasswordReset
);

router.post(
  "/verify-reset-password",
  validate(verifyRestPasswordSchema),
  sanitizeRequest,
  verifyAndrestPassword
);

router.post("/logout", logout);

export default router;
