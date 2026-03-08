const companyModel = require("../models/company.model.js");
const getDataUri = require("../utils/dataUri.js");
const cloudinary = require("../utils/cloudinary.js");
const mongoose = require("mongoose");

const asyncHandler = require("../middlewares/asyncHandler.js");
const AppError = require("../utils/appError.js");


const registerCompany = asyncHandler(async (req, res) => {
  const { companyName } = req.body;

  if (!companyName) {
    throw new AppError("Company name is required", 400);
  }

  let company = await companyModel.findOne({ name: companyName });

  if (company) {
    throw new AppError("Company already exists", 400);
  }

  company = await companyModel.create({
    name: companyName,
    userId: req.id,
  });

  res.status(201).json({
    message: "Company created successfully",
    success: true,
    company,
  });
});


const getCompany = asyncHandler(async (req, res) => {
  const userId = req.id;

  const companies = await companyModel.find({ userId });

  if (!companies || companies.length === 0) {
    throw new AppError("No company found", 404);
  }

  res.status(200).json({
    message: "Companies found",
    success: true,
    companies,
  });
});


const getCompanyById = asyncHandler(async (req, res) => {
  const companyId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    throw new AppError("Invalid company ID", 400);
  }

  const company = await companyModel.findById(companyId);

  if (!company) {
    throw new AppError("No company found", 404);
  }

  res.status(200).json({
    message: "Company found",
    success: true,
    company,
  });
});


const updateCompany = asyncHandler(async (req, res) => {
  const { name, description, website, location } = req.body;

  const companyId = req.params.id;
  const file = req.file;

  if (!mongoose.Types.ObjectId.isValid(companyId)) {
    throw new AppError("Invalid company ID", 400);
  }

  const updateData = { name, description, website, location };

  if (file) {
    const fileUri = getDataUri(file);
    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    updateData.logo = cloudResponse.secure_url;
  }

  const company = await companyModel.findByIdAndUpdate(companyId, updateData, {
    new: true,
  });

  if (!company) {
    throw new AppError("No company found", 404);
  }

  res.status(200).json({
    message: "Company updated successfully",
    success: true,
    company,
  });
});

module.exports = {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
};