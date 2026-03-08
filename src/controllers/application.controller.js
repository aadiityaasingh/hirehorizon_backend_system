const applicationModel = require("../models/application.model.js");
const jobModel = require("../models/job.model.js");

const asyncHandler = require("../middlewares/asyncHandler.js");
const AppError = require("../utils/appError.js");
const mongoose = require("mongoose");
const getPagination = require("../utils/pagination.js");


const applyJob = asyncHandler(async (req, res) => {
  const userId = req.id;
  const jobId = req.params.id;

  if (!jobId) {
    throw new AppError("Job id is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(jobId)) {
    throw new AppError("Invalid job id", 400);
  }

  const existingApplication = await applicationModel.findOne({
    job: jobId,
    applicant: userId
  });

  if (existingApplication) {
    throw new AppError("You have already applied for this job", 400);
  }

  const job = await jobModel.findById(jobId);

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const newApplication = await applicationModel.create({
    job: jobId,
    applicant: userId
  });

  job.applications.push(newApplication._id);
  await job.save();

  res.status(201).json({
    message: "Job applied successfully",
    success: true
  });
});


const getAppliedJobs = asyncHandler(async (req, res) => {

  const { page, limit, skip } = getPagination(req);
  const userId = req.id;

  const totalApplications = await applicationModel.countDocuments({
    applicant: userId
  });

  const applications = await applicationModel
    .find({ applicant: userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "job",
      populate: {
        path: "company"
      }
    })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    page,
    totalPages: Math.ceil(totalApplications / limit),
    totalApplications,
    applications
  });

});


const getApplicants = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req);
  const jobId = req.params.id;

  const job = await jobModel.findById(jobId)
    .populate({
      path: "applications",
      options: {
        sort: { createdAt: -1 },
        skip,
        limit
      },
      populate: {
        path: "applicant"
      }
    });

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  const totalApplicants = job.applications.length;

  res.status(200).json({
    success: true,
    page,
    totalApplicants,
    applicants: job.applications
  });
});


const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const applicationId = req.params.id;

  if (!status) {
    throw new AppError("Status is required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(applicationId)) {
    throw new AppError("Invalid application id", 400);
  }

  const application = await applicationModel.findById(applicationId);

  if (!application) {
    throw new AppError("Application not found", 404);
  }

  application.status = status.toLowerCase();
  await application.save();

  res.status(200).json({
    message: "Status updated successfully",
    success: true
  });
});

module.exports = {
  applyJob,
  getAppliedJobs,
  getApplicants,
  updateStatus
};