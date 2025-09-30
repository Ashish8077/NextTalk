import { catchAsync } from "../utils/catchAsync.js";
import {
  loginService,
  requestPasswordResetService,
  resendVerificationEmailService,
  resendVerificationOtpService,
  sendWelcomeEmailService,
  signupService,
  verifyEmailService,
  verifyOtpService,
} from "../services/auth.service.js";
import { generateTokenAndSetCookie } from "../utils/token.js";

export const signup = catchAsync(async (req, res) => {
  const data = await signupService(req.body);
  return res.status(201).json({
    success: true,
    message:
      "Signup successful. Please check your email to verify your account.",
    data,
  });
});

export const verifyEmail = catchAsync(async (req, res) => {
  const data = await verifyEmailService(req.body);
  await generateTokenAndSetCookie(res, data.id);

  // Send welcome email (non-critical, failure won't block response)
  if (data.isVerified) {
    sendWelcomeEmailService(data.username, data.email);
  }

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data,
  });
});

export const resendVerificationEmail = catchAsync(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  await resendVerificationEmailService(email);

  return res.status(200).json({
    success: true,
    message:
      "If an account exists with this email, a verification link has been sent.",
  });
});

export const login = catchAsync(async (req, res) => {
  const data = await loginService(req.body);
  return res.status(200).json({
    success: true,
    message: "OTP has been sent to your email for verification",
    data,
  });
});

export const verifyOtp = catchAsync(async (req, res) => {
  const data = await verifyOtpService(req.body);
  await generateTokenAndSetCookie(res, data.id);
  return res.status(200).json({
    success: true,
    message: "Login successfully",
    data,
  });
});

export const resendVerificationOtp = catchAsync(async (req, res) => {
  await resendVerificationOtpService(req.body);
  return res.status(200).json({
    success: true,
    message: "Success. Please check your inbox for the OTP.",
  });
});

export const requestPasswordReset = catchAsync(async (req, res) => {
  const data = await requestPasswordResetService(req.body);
  return res.status(200).json({
    success: true,
    message: "Password reset successfully",
  });
});

export const logout = async (req, res) => {
  res.send("You hit the logout controller");
};
