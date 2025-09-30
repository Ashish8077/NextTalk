import crypto from "crypto";
import bcrypt from "bcrypt";

export const createOtpHashAndExpiryTime = async (otpValidityMinutes) => {
  const otpCode = crypto.randomInt(100000, 999999).toString();
  const saltRounds = 10;
  const otpHash = await bcrypt.hash(otpCode, saltRounds);

  const expiresAt = new Date(Date.now() + otpValidityMinutes * 60 * 1000);

  return { otpCode, otpHash, expiresAt };
};
