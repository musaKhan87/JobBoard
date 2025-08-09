const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    salary: {
      type: Number,
      min: 0,
    },
    type: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Remote"],
      default: "Full-time",
    },
    requirements: [
      {
        type: String,
      },
    ],
    benefits: [
      {
        type: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
jobSchema.index({ title: "text", company: "text", description: "text" });

module.exports = mongoose.model("Job", jobSchema);
