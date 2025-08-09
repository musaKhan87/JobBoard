import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Users,
  Eye,
  FileText,
  LogOut,
  Check,
  XCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Mail,
  Calendar,
  Building,
  MapPin,
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";
import { useJobs } from "../context/JobContext";

function AdminPanel() {
  const {
    jobs,
    applications,
    addJob,
    updateJob,
    deleteJob,
    fetchApplications,
  } = useJobs();

  const { isAdmin, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [activeTab, setActiveTab] = useState("jobs");
  const [selectedJob, setSelectedJob] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
 const [formData, setFormData] = useState({
   title: "",
   company: "",
   location: "",
   description: "",
   salary: "",
   type: "Full-time",
   requirements: "",
   benefits: "",
 });


  useEffect(() => {
    if (!isAdmin) {
      navigate("/admin/login");
      return;
    }
    fetchApplications();
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  const resetForm = () => {
    setFormData({
      title: "",
      company: "",
      location: "",
      description: "",
      salary: "",
      type: "Full-time",
      requirements: "",
      benefits: "",
    });
    setShowForm(false);
    setEditingJob(null);
  };

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData({
    ...formData,
    [name]: value,
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const jobData = {
    ...formData,
    salary: formData.salary ? Number.parseInt(formData.salary) : null,
    requirements: formData.requirements
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    benefits: formData.benefits
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  };

  if (editingJob) {
    await updateJob(editingJob._id, jobData);
  } else {
    await addJob(jobData);
  }
  resetForm();
};

const handleEdit = (job) => {
  setFormData({
    title: job.title,
    company: job.company,
    location: job.location,
    description: job.description,
    salary: job.salary || "",
    type: job.type || "Full-time",
    requirements: Array.isArray(job.requirements)
      ? job.requirements.join(", ")
      : job.requirements || "",
    benefits: Array.isArray(job.benefits)
      ? job.benefits.join(", ")
      : job.benefits || "",
  });
  setEditingJob(job);
  setShowForm(true);
};



  const handleDelete = async (jobId) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      await deleteJob(jobId);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getJobApplications = (jobId) => {
    return applications.filter(
      (app) => app.jobId === jobId || app.jobId?._id === jobId
    );
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    setUpdatingStatus(applicationId);
    try {
      const response = await fetch(`/api/apply/${applicationId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await fetchApplications();
        showSuccess(`Application ${newStatus} successfully!`);
      } else {
        showError("Failed to update application status");
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      showError("Error updating application status");
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "reviewed":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "shortlisted":
        return "bg-green-50 text-green-700 border-green-200";
      case "rejected":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "reviewed":
        return <Eye className="h-4 w-4 text-blue-600" />;
      case "shortlisted":
        return <Check className="h-4 w-4 text-green-600" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getJobTitle = (application) => {
    if (application.jobId && typeof application.jobId === "object") {
      return application.jobId.title;
    }
    const job = jobs.find((j) => j._id === application.jobId);
    return job ? job.title : "Unknown Job";
  };

  const getJobCompany = (application) => {
    if (application.jobId && typeof application.jobId === "object") {
      return application.jobId.company;
    }
    const job = jobs.find((j) => j._id === application.jobId);
    return job ? job.company : "Unknown Company";
  };

  const getJobLocation = (application) => {
    if (application.jobId && typeof application.jobId === "object") {
      return application.jobId.location;
    }
    const job = jobs.find((j) => j._id === application.jobId);
    return job ? job.location : "Unknown Location";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage jobs and applications</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add New Job</span>
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Jobs</p>
              <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Applications
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Pending Reviews
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {applications.filter((app) => app.status === "pending").length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shortlisted</p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  applications.filter((app) => app.status === "shortlisted")
                    .length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Check className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("jobs")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "jobs"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Manage Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab("applications")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "applications"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Applications ({applications.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "jobs" && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Details
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applications
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {jobs.map((job) => {
                    const jobApplications = getJobApplications(job._id);
                    return (
                      <tr key={job._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {job.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {job.description}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {job.company}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {job.location}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedJob(job._id)}
                            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Users className="h-4 w-4" />
                            <span>{jobApplications.length} applicants</span>
                          </button>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium space-x-2">
                          <button
                            onClick={() => handleEdit(job)}
                            className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(job._id)}
                            className="text-red-600 hover:text-red-900 inline-flex items-center"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "applications" && (
            <div className="space-y-6">
              {applications.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No applications yet</p>
                </div>
              ) : (
                applications.map((application) => (
                  <div
                    key={application._id}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Left Section - Applicant Info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                              {application.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">
                                  {application.name}
                                </h3>
                                <div
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                                    application.status
                                  )}`}
                                >
                                  {getStatusIcon(application.status)}
                                  <span className="ml-2 capitalize">
                                    {application.status}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Mail className="h-4 w-4" />
                                  <span>{application.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    Applied on{" "}
                                    {new Date(
                                      application.createdAt
                                    ).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Job Info */}
                          <div className="bg-gray-50 rounded-xl p-4 mb-4">
                            <h4 className="font-semibold text-gray-900 mb-2">
                              Applied for:
                            </h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span className="font-medium">
                                  {getJobTitle(application)}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Building className="h-4 w-4" />
                                <span>{getJobCompany(application)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{getJobLocation(application)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Cover Letter */}
                          {application.coverLetter && (
                            <div className="bg-blue-50 rounded-xl p-4">
                              <h4 className="font-semibold text-gray-900 mb-2">
                                Cover Letter:
                              </h4>
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {application.coverLetter}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Right Section - Actions */}
                        <div className="lg:w-64 flex flex-col gap-4">
                          {/* Resume Button */}
                          <a
                            href={application.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                            <span>View Resume</span>
                          </a>

                          {/* Status Action Buttons */}
                          <div className="space-y-2">
                            {application.status !== "shortlisted" && (
                              <button
                                onClick={() =>
                                  updateApplicationStatus(
                                    application._id,
                                    "shortlisted"
                                  )
                                }
                                disabled={updatingStatus === application._id}
                                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Check className="h-4 w-4" />
                                <span>
                                  {updatingStatus === application._id
                                    ? "Updating..."
                                    : "Shortlist"}
                                </span>
                              </button>
                            )}

                            {application.status !== "rejected" && (
                              <button
                                onClick={() =>
                                  updateApplicationStatus(
                                    application._id,
                                    "rejected"
                                  )
                                }
                                disabled={updatingStatus === application._id}
                                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <XCircle className="h-4 w-4" />
                                <span>
                                  {updatingStatus === application._id
                                    ? "Updating..."
                                    : "Reject"}
                                </span>
                              </button>
                            )}

                            {(application.status === "shortlisted" ||
                              application.status === "rejected") && (
                              <button
                                onClick={() =>
                                  updateApplicationStatus(
                                    application._id,
                                    "pending"
                                  )
                                }
                                disabled={updatingStatus === application._id}
                                className="w-full flex items-center justify-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Clock className="h-4 w-4" />
                                <span>
                                  {updatingStatus === application._id
                                    ? "Updating..."
                                    : "Reset to Pending"}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Job Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  {editingJob ? "Edit Job" : "Add New Job"}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company *
                  </label>
                  <input
                    type="text"
                    name="company"
                    required
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location *
                  </label>
                  <input
                    type="text"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary (Optional)
                  </label>
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    required
                    rows={6}
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Requirements (comma separated)
                  </label>
                  <input
                    type="text"
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., React, Node.js, CSS"
                  />
                </div>

                {/* Benefits */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Benefits (comma separated)
                  </label>
                  <input
                    type="text"
                    name="benefits"
                    value={formData.benefits}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Health Insurance, Remote Work"
                  />
                </div>

                <div className="flex space-x-4 pt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Save className="h-5 w-5" />
                    <span>{editingJob ? "Update Job" : "Create Job"}</span>
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-6 rounded-lg font-semibold transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Job Applications Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                  Job Applications
                </h2>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {getJobApplications(selectedJob).length === 0 ? (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      No applications for this job yet
                    </p>
                  </div>
                ) : (
                  getJobApplications(selectedJob).map((application) => (
                    <div
                      key={application._id}
                      className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                              {application.name.charAt(0).toUpperCase()}
                            </div>
                            <h3 className="font-semibold text-gray-900">
                              {application.name}
                            </h3>
                            <div
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                application.status
                              )}`}
                            >
                              {getStatusIcon(application.status)}
                              <span className="ml-1 capitalize">
                                {application.status}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">
                            Email: {application.email}
                          </p>
                          <p className="text-sm text-gray-500">
                            Applied:{" "}
                            {new Date(
                              application.createdAt
                            ).toLocaleDateString()}
                          </p>
                          {application.coverLetter && (
                            <div className="mt-3 p-3 bg-white rounded border">
                              <p className="text-sm text-gray-600">
                                {application.coverLetter}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <a
                            href={application.resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors text-center"
                          >
                            View Resume
                          </a>

                          <div className="flex gap-2">
                            {application.status !== "shortlisted" && (
                              <button
                                onClick={() =>
                                  updateApplicationStatus(
                                    application._id,
                                    "shortlisted"
                                  )
                                }
                                disabled={updatingStatus === application._id}
                                className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                              >
                                <Check className="h-3 w-3" />
                                <span>Shortlist</span>
                              </button>
                            )}

                            {application.status !== "rejected" && (
                              <button
                                onClick={() =>
                                  updateApplicationStatus(
                                    application._id,
                                    "rejected"
                                  )
                                }
                                disabled={updatingStatus === application._id}
                                className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium transition-colors disabled:opacity-50"
                              >
                                <XCircle className="h-3 w-3" />
                                <span>Reject</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
