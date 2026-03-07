const companyModel = require("../models/company.model.js");
const getDataUri = require("../utils/dataUri.js");
const cloudinary = require("../utils/cloudinary.js");
const mongoose = require("mongoose");

const registerCompany = async (req, res) => {
  try {
    const { companyName } = req.body;
    if (!companyName) {
      return res.status(400).json({ message: "Company name is required", success: false });
    }

    let company = await companyModel.findOne({ name: companyName });
    if (company) {
      return res.status(400).json({ message: "Company already exists", success: false });
    }

    company = await companyModel.create({
      name: companyName,
      userId: req.id,
    });

    return res.status(201).json({
      message: "Company created successfully",
      success: true,
      company,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

const getCompany = async (req, res) => {
  try {
    const userId = req.id;
    const companies = await companyModel.find({ userId });

    if (!companies || companies.length === 0) {
      return res.status(404).json({ message: "No company found", success: false });
    }

    return res.status(200).json({
      message: "Companies found",
      success: true,
      companies,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

const getCompanyById = async (req, res) => {
  try {
    const companyId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(companyId)) {
      return res.status(400).json({ message: "Invalid company ID", success: false });
    }

    const company = await companyModel.findById(companyId);

    if (!company) {
      return res.status(404).json({ message: "No company found", success: false });
    }

    return res.status(200).json({
      message: "Company found",
      success: true,
      company,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

const updateCompany = async (req, res) => {
  try {
    const { name, description, website, location } = req.body;
    const file = req.file;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid company ID", success: false });
    }

    const updateData = { name, description, website, location };

    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      updateData.logo = cloudResponse.secure_url;
    }

    const company = await companyModel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!company) {
      return res.status(404).json({ message: "No company found", success: false });
    }

    return res.status(200).json({
      message: "Company updated successfully",
      success: true,
      company,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

module.exports = {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany,
};