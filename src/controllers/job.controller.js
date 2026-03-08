const jobModel = require("../models/job.model.js");

const asyncHandler = require("../middlewares/asyncHandler.js");
const AppError = require("../utils/appError.js");
const getPagination = require("../utils/pagination.js");


const postJob = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    requirements,
    salary,
    location,
    jobType,
    experience,
    position,
    companyId,
  } = req.body;

  const userId = req.id;

  if (
    !title ||
    !description ||
    !requirements ||
    !salary ||
    !location ||
    !jobType ||
    !experience ||
    !position ||
    !companyId
  ) {
    throw new AppError("Something is missing", 400);
  }

  const job = await jobModel.create({
    title,
    description,
    requirements: requirements.split(","),
    salary: Number(salary),
    location,
    jobType,
    experienceLevel: experience,
    position,
    company: companyId,
    created_by: userId,
  });

  res.status(201).json({
    message: "New job created successfully",
    job,
    success: true,
  });
});


const getAllJobs = asyncHandler(async (req, res) => {

  const { page, limit, skip } = getPagination(req);

  const keyword = req.query.keyword || "";
  const location = req.query.location;
  const jobType = req.query.jobType;

  const filter = {
    $and: [
      {
        $or: [
          { title: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } }
        ]
      }
    ]
  };

  if (location) {
    filter.$and.push({ location: { $regex: location, $options: "i" } });
  }

  if (jobType) {
    filter.$and.push({ jobType });
  }

  const totalJobs = await jobModel.countDocuments(filter);

  const jobs = await jobModel
    .find(filter)
    .populate("company")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    page,
    totalPages: Math.ceil(totalJobs / limit),
    totalJobs,
    jobs
  });

});


const getJobById = asyncHandler(async (req, res) => {
  const jobId = req.params.id;

  const job = await jobModel.findById(jobId).populate("applications");

  if (!job) {
    throw new AppError("Job not found", 404);
  }

  res.status(200).json({
    job,
    success: true,
  });
});


const getAdminJobs = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req);
  const adminId = req.id;

  const totalJobs = await jobModel.countDocuments({ created_by: adminId });

  const jobs = await jobModel
    .find({ created_by: adminId })
    .populate("company")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  res.status(200).json({
    success: true,
    page,
    totalPages: Math.ceil(totalJobs / limit),
    totalJobs,
    jobs
  });
});

module.exports = {
  postJob,
  getAllJobs,
  getJobById,
  getAdminJobs,
};