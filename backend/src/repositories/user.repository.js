import User from "../models/user.model.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email: email.toLowerCase() });
};

export const createUser = async ({
  fullname,
  email,
  password,
  verificationToken,
  verificationTokenExpiry,
}) => {
  return await User.create({
    fullname: fullname.trim(),
    email: email.toLowerCase(),
    password,
    verificationToken,
    verificationTokenExpiry,
  });
};

export const findVerificationToken = async (email, hashedToken) => {
  return await User.findOne({
    email: email,
    verificationToken: hashedToken,
    verificationTokenExpiry: { $gt: Date.now() },
  });
};

export const deleteUserById = async (userId) => {
  return await User.findByIdAndDelete(userId);
};
