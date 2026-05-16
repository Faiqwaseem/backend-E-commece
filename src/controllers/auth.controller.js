const userModel = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const generateAuthToken = require("../utils/generateAuthToken");

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role = "user" } = req.body;

  const userExists = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    return res
      .status(409)
      .json({ success: false, message: "User already exists" });
  }

  const newUser = await userModel.create({
    username,
    email,
    password,
    role,
  });

  const token = await generateAuthToken(newUser._id, newUser.role);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
    },
  });
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = await generateAuthToken(user._id, user.role);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({
    success: true,
    message: "User logged in successfully",
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  return res.status(200).json({
    message: "User logged out successfully",
    success: true,
    data: null,
  });
});

module.exports = {
  registerUser,
  userLogin,
  logoutUser,
};
