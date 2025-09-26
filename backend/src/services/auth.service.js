import User from "../models/user.model.js";

export const existingUser = async (email) => {
  return await User.findOne({ email });
};
