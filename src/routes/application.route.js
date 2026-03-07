const express = require("express");
const isAuthenticated = require("../middlewares/isAuthenticated.js");
const {
  applyJob,
  getApplicants,
  getAppliedJobs,
  updateStatus,
} = require("../controllers/application.controller.js");

const router = express.Router();

router.get("/get", isAuthenticated, getAppliedJobs);
router.get("/apply/:id", isAuthenticated, applyJob);
router.get("/:id/applicants", isAuthenticated, getApplicants);
router.post("/status/:id/update", isAuthenticated, updateStatus);   

module.exports = router;