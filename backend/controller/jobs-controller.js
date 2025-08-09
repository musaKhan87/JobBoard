const Job = require("../models/Job");

const getAllJobs = async (req, res) => {
  try {
    const { search, location, type } = req.query;
    const query = { isActive: true };

    // Add search filters
    if (search) {
      query.$text = { $search: search };
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    if (type) {
      query.type = type;
    }

    const jobs = await Job.find(query).sort({ createdAt: -1 }).limit(50);
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getSingleJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }
    res.json(job);
  } catch (error) {
    console.error("Error fetching job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      description,
      salary,
      type,
      requirements,
      benefits,
    } = req.body;

    // Validation
    if (!title || !company || !location || !description) {
      return res.status(400).json({
        message: "Title, company, location, and description are required",
      });
    }

    const job = new Job({
      title,
      company,
      location,
      description,
      salary,
      type,
      requirements,
      benefits,
    });

    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const updateJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      description,
      salary,
      type,
      requirements,
      benefits,
    } = req.body;

    const job = await Job.findById(req.params.id);

    // Update fields
    job.title = title || job.title;
    job.company = company || job.company;
    job.location = location || job.location;
    job.description = description || job.description;
    job.salary = salary !== undefined ? salary : job.salary;
    job.type = type || job.type;
    job.requirements = requirements || job.requirements;
    job.benefits = benefits || job.benefits;

    const updatedJob = await job.save();
    res.json(updatedJob);
  } catch (error) {
    console.error("Error updating job:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteJob=async (req,res) => {
     try {
       const job = await Job.findById(req.params.id);
       if (!job) {
         return res.status(404).json({ message: "Job not found" });
       }

       await Job.findByIdAndDelete(req.params.id);
       res.json({ message: "Job deleted successfully" });
     } catch (error) {
       console.error("Error deleting job:", error);
       res.status(500).json({ message: "Server error" });
     }
}

module.exports = { getAllJobs, getSingleJob, createJob,updateJob,deleteJob };
