const userModel = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const generateAuthToken = require("../utils/generateAuthToken");
const crypto = require("crypto");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

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
    role: "user",
  });

  const token = await generateAuthToken(newUser._id, newUser.role);

  res.cookie("jwt", token, {
    cookieOptions,
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

  res.cookie("jwt", token, cookieOptions);

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

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user,
  });
});

const logoutUser = asyncHandler(async (req, res) => {
  res.clearCookie("jwt", cookieOptions);

  return res.status(200).json({
    message: "User logged out successfully",
    success: true,
    data: null,
  });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  /*
    |--------------------------------------------------------------------------
    | FIND USER
    |--------------------------------------------------------------------------
    */

  const user = await userModel.findOne({
    email,
  });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  /*
    |--------------------------------------------------------------------------
    | GENERATE TOKEN
    |--------------------------------------------------------------------------
    */

  const resetToken = user.generatePasswordResetToken();

  await user.save({
    validateBeforeSave: false,
  });

  /*
    |--------------------------------------------------------------------------
    | RESET URL
    |--------------------------------------------------------------------------
    */

  const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

  /*
    |--------------------------------------------------------------------------
    | EMAIL MESSAGE
    |--------------------------------------------------------------------------
    */

  const message = `
Password Reset Request

Click the link below to reset your password:

${resetUrl}

This link expires in 10 minutes.
`;

  console.log(message);

  /*
    |--------------------------------------------------------------------------
    | TODO: SEND EMAIL
    |--------------------------------------------------------------------------
    */

  return res.status(200).json({
    success: true,
    message: "Reset link sent",
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  /*
    |--------------------------------------------------------------------------
    | HASH TOKEN
    |--------------------------------------------------------------------------
    */

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  /*
    |--------------------------------------------------------------------------
    | FIND USER
    |--------------------------------------------------------------------------
    */

  const user = await userModel.findOne({
    passwordResetToken: hashedToken,

    passwordResetExpires: {
      $gt: Date.now(),
    },
  });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired token",
    });
  }

  /*
    |--------------------------------------------------------------------------
    | UPDATE PASSWORD
    |--------------------------------------------------------------------------
    */

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  
  return res.status(200).json({
    success: true,
    message: "Password reset successful",
  });
});

module.exports = {
  registerUser,
  userLogin,
  logoutUser,
  getCurrentUser,
};
