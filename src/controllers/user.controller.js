const userModel = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getDataUri = require("../utils/dataUri.js");
const cloudinary = require("../utils/cloudinary.js");

const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/appError");



const register = asyncHandler(async (req, res) => {
  const { fullname, email, phoneNumber, password, role } = req.body;

  if (!fullname || !email || !phoneNumber || !password || !role) {
    throw new AppError("All fields are required", 400);
  }

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    throw new AppError("User already exists", 400);
  }

  let profilePhoto = "";
  const file = req.file;

  if (file) {
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    profilePhoto = cloudResponse.secure_url;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await userModel.create({
    fullname,
    email,
    phoneNumber,
    password: hashedPassword,
    role,
    profile: {
      profilePhoto,
    },
  });

  res.status(201).json({
    message: "User registered successfully",
    success: true,
  });
});


const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    throw new AppError("All fields are required", 400);
  }

  let user = await userModel.findOne({ email });

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    throw new AppError("Invalid email or password", 401);
  }

  if (role !== user.role) {
    throw new AppError("Invalid role", 401);
  }

  const tokenData = {
    userId: user._id,
  };

  const token = jwt.sign(tokenData, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  user = {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    profile: user.profile,
  };

  res
    .status(200)
    .cookie("token", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
    })
    .json({
      message: `Welcome back ${user.fullname}`,
      user,
      success: true,
    });
});


const logout = asyncHandler(async (req, res) => {
  res.status(200).cookie("token", "", { maxAge: 0 }).json({
    message: "Logout successfully",
    success: true,
  });
});


const updateProfile = asyncHandler(async (req, res) => {
  const { fullname, email, phoneNumber, bio, skills } = req.body;

  const userId = req.id;

  let user = await userModel.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (fullname) user.fullname = fullname;
  if (email) user.email = email;
  if (phoneNumber) user.phoneNumber = phoneNumber;
  if (bio) user.profile.bio = bio;

  if (skills) {
    user.profile.skills = skills.split(",");
  }

  const file = req.file;

  if (file) {
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

    user.profile.resume = cloudResponse.secure_url;
    user.profile.resumeOriginalName = file.originalname;
  }

  await user.save();

  user = {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role,
    profile: user.profile,
  };

  res.status(200).json({
    message: "Profile updated successfully",
    user,
    success: true,
  });
});

module.exports = {
  register,
  login,
  logout,
  updateProfile,
};