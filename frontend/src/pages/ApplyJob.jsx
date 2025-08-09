import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, User, Mail, FileText } from "lucide-react";
import { useJobs } from "../context/JobContext";

function ApplyJob() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { jobs, applyToJob } = useJobs();
  const [job, setJob] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    resumeUrl: "",
    coverLetter: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const foundJob = jobs.find((j) => j._id === jobId);
    setJob(foundJob);
  }, [jobId, jobs]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await applyToJob(jobId, formData);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!job) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Job not found</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Application Submitted!</h2>
          <p className="mb-6">
            Thank you for applying to {job.title} at {job.company}. We'll review
            your application and get back to you soon.
          </p>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Jobs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Job Details */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                {job.company.charAt(0)}
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-800">{job.title}</h2>
                <p className="text-gray-600">{job.company}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center text-gray-600">
                <span className="font-medium">Location:</span>
                <span className="ml-2">{job.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <span className="font-medium">Type:</span>
                <span className="ml-2">{job.type || "Full-time"}</span>
              </div>
              {job.salary && (
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Salary:</span>
                  <span className="ml-2">${job.salary.toLocaleString()}</span>
                </div>
              )}
            </div>

            <div className="mt-6">
              <h3 className="font-semibold text-gray-800 mb-2">
                Job Description
              </h3>
              <p className="text-gray-600 text-sm">{job.description}</p>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Apply for {job.title}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4 mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email address"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Upload className="h-4 w-4 mr-2" />
                  Resume URL *
                </label>
                <input
                  type="url"
                  name="resumeUrl"
                  required
                  value={formData.resumeUrl}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com/your-resume.pdf"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Please provide a link to your resume (Google Drive, Dropbox,
                  etc.)
                </p>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4 mr-2" />
                  Cover Letter (Optional)
                </label>
                <textarea
                  name="coverLetter"
                  rows={6}
                  value={formData.coverLetter}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Tell us why you're interested in this position..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors"
              >
                {isSubmitting
                  ? "Submitting Application..."
                  : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyJob;
