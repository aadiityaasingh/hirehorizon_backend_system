const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated");
const {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
} = require("../controllers/job.controller");

const router = express.Router();

router.post("/post", isAuthenticated, postJob);
router.get("/get", isAuthenticated, getAllJobs);
router.get("/getAdminJobs", isAuthenticated, getAdminJobs);
router.get("/get/:id", isAuthenticated, getJobById);

module.exports = router;