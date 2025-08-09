const express = require('express');
const { getAllJobs, getSingleJob, createJob, updateJob, deleteJob } = require('../controller/jobs-controller');
const jobRouter = express.Router();

// GET /api/jobs - Get all jobs
jobRouter.get("/", getAllJobs);

// GET /api/jobs/:id - Get single job
jobRouter.get("/:id", getSingleJob)

// POST /api/jobs - Create new job (admin only)
jobRouter.post("/", createJob);

// PUT /api/jobs/:id - Update job (admin only)
jobRouter.put("/:id", updateJob);

// DELETE /api/jobs/:id - Delete job (admin only)
jobRouter.delete("/:id",deleteJob)

module.exports = jobRouter;