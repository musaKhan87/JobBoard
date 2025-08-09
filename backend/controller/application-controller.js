const Application = require("../models/Application");
const Job = require("../models/Job");

const submitJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { name, email, resumeUrl, coverLetter } = req.body;

    // Validation
    if (!name || !email || !resumeUrl) {
      return res.status(400).json({
        message: "Name, email, and resume URL are required",
      });
    }

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user already applied
    const existingApplication = await Application.findOne({
      jobId,
      email: email.toLowerCase(),
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this job",
      });
    }

    const application = new Application({
      jobId,
      name,
      email: email.toLowerCase(),
      resumeUrl,
      coverLetter,
    });

    const savedApplication = await application.save();


    // Populate job details for response
    await savedApplication.populate("jobId", "title company location");

   

    res.status(201).json({
      message: "Application submitted successfully",
      application: savedApplication,
      id:savedApplication._id.toString()
    });
  } catch (error) {
    console.error("Error submitting application:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getApplications = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate("jobId", "title company location")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("jobId", "title company location")
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "reviewed", "shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate("jobId", "title company location");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getApplicationByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const applications = await Application.find({
      email: email.toLowerCase(),
    })
      .populate("jobId", "title company location")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    console.error("Error fetching user applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error("Error deleting application:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  submitJob,
  getApplications,
  getAllApplications,
  updateApplicationStatus,
  deleteApplication,
  getApplicationByEmail,
};
