import { catchAsync } from "../utils/catchAsync.js";
import {
  resendVerificationEmailService,
  sendWelcomeEmailService,
  signupService,
  verifyEmailService,
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
  const data = await verifyEmailService(req.query);
  await generateTokenAndSetCookie(res, data.id);

  // Send welcome email (non-critical, failure won't block response)
  if (data.isVerified) {
    sendWelcomeEmailService(data.fullname, data.email);
  }

  return res.status(200).json({
    success: true,
    message: "Email verified successfully",
    data,
  });
});

export const resendVerificationEmail = catchAsync(async (req, res) => {
  const { email } = req.body;

  console.log(email);

  if (!email) {
    throw new AppError("Email is required", 400);
  }

  await resendVerificationEmailService(email);

  return res.status(200).json({
    success: true,
    message: "Verification email has been resent. Please check your inbox.",
  });
});

export const login = catchAsync(async (req, res) => {
  console.log("Checking if login branch is created")
  // const data = await loginService(req.body);
  // return res.status(200).json({
  //   success: true,
  //   message: "Login successfully",
  //   data,
  // });
});

export const logout = async (req, res) => {
  res.send("You hit the logout controller");
};
