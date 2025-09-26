import User from "../models/user.model.js";
import { existingUser } from "../services/auth.service.js";
import bcrypt from "bcrypt";

export const signup = async (req, res) => {
  const { fullname, email, password } = req.body;
  console.log(fullname, email, password);
  const user = await existingUser(email);
  if (user) {
    return res.status(409).json({
      success: false,
      message: "Email already in use",
    });
  }

  

  const newUser = new User({
    fullname,
    email,
    password: hashedPassword,
  });

  console.log(newUser);

  return res.status(201).json({
    success: true,
    data: {
      id: newUser._id,
      fullname: newUser.fullname,
      email: newUser.email,
    },
  });
};

export const login = async (req, res) => {
  res.send("You hit the login controller");
};

export const logout = async (req, res) => {
  res.send("You hit the logout controller");
};
