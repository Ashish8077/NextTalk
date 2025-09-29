import { Router } from "express";
import {
  signup,
  login,
  logout,
  verifyEmail,
  resendVerificationEmail,
  verifyOtp,
} from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import {
  loginSchema,
  signupSchema,
  verifyOtpSchema,
} from "../validation/auth.validation.js";
import { sanitizeRequest } from "../middlewares/sanitizeRequest.js";

const router = Router();

router.post("/signup", validate(signupSchema), sanitizeRequest, signup);
router.get("/verify-email", sanitizeRequest, verifyEmail);
router.post("/reverify-email", sanitizeRequest, resendVerificationEmail);

router.post("/login", validate(loginSchema), sanitizeRequest, login);
router.post(
  "/verify-otp",
  validate(verifyOtpSchema),
  sanitizeRequest,
  verifyOtp
);

router.post("/logout", logout);

export default router;
