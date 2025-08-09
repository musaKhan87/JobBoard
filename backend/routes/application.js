const express = require("express");
const router = express.Router();
const {
  submitJob,
  getApplications,
  getAllApplications,
  updateApplicationStatus,
  getApplicationByEmail,
  deleteApplication,
} = require("../controller/application-controller");

// POST /api/apply/:jobId - Submit job application
router.post("/:jobId", submitJob);

// GET /api/apply/job/:jobId - Get applications for a specific job (admin only)
router.get("/job/:jobId", getApplications);

// GET /api/apply - Get all applications (admin only)
router.get("/", getAllApplications);

// PUT /api/apply/:id/status - Update application status (admin only)
router.put("/:id/status", updateApplicationStatus);

// GET /api/apply/user/:email - Get applications by user email
router.get("/user/:email", getApplicationByEmail);

// DELETE /api/apply/:id - Delete application (admin only)
router.delete("/:id", deleteApplication);

module.exports = router;
