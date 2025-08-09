import { useJobs } from "../context/JobContext";
import {
  FileText,
  Calendar,
  Building,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyApplications() {
  const { jobs } = useJobs();
  const [userApplications, setUserApplication] = useState([]);
 
  useEffect(() => {
    fetchApplication();
  }, [userApplications]);

  const fetchApplication = async () => {
    const response = await fetch("/api/apply/");
    if (!response.ok) throw new Error("Failed to fetch jobs");
    const application = await response.json();

    let appliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]");

    const filteredApplications = application.filter((app) =>
      appliedJobs.includes(app._id)
    );

    setUserApplication(filteredApplications);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case "reviewed":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      case "shortlisted":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "rejected":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "reviewed":
        return "bg-blue-100 text-blue-800";
      case "shortlisted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (userApplications.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <FileText className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            No Applications Yet
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            You haven't applied to any jobs yet. Start browsing and apply to
            jobs that match your skills and interests.
          </p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Browse Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Applications
        </h1>
        <p className="text-gray-600">
          Track the status of your job applications
        </p>
      </div>

      {/* Applications Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Applications
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {userApplications.length}
              </p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {
                  userApplications.filter((app) => app.status === "pending")
                    .length
                }
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Shortlisted</p>
              <p className="text-2xl font-bold text-green-600">
                {
                  userApplications.filter((app) => app.status === "shortlisted")
                    .length
                }
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {
                  userApplications.filter((app) => app.status === "rejected")
                    .length
                }
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-6">
        {userApplications.map((application, index) => {
          const job = jobs.find((j) => j._id === application.jobId);
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-100"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    {application.company?.charAt(0) ||
                      job?.company?.charAt(0) ||
                      "?"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {application.jobTitle || job?.title || "Job Title"}
                      </h3>
                      <div className="flex items-center">
                        {getStatusIcon(application.status)}
                      </div>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm mb-3">
                      <Building className="h-4 w-4 mr-1" />
                      <span>
                        {application.company || job?.company || "Company"}
                      </span>
                      {job?.location && (
                        <>
                          <span className="mx-2">•</span>
                          <MapPin className="h-4 w-4 mr-1" />
                          <span>{job.location}</span>
                        </>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>
                          Applied on {formatDate(application.appliedAt)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span>Email: {application.email}</span>
                      </div>
                    </div>

                    {application.coverLetter && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3 flex-shrink-0">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      application.status
                    )}`}
                  >
                    {application.status.charAt(0).toUpperCase() +
                      application.status.slice(1)}
                  </span>

                  <div className="flex gap-2">
                    {job && (
                      <Link
                        to={`/job/${job._id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                      >
                        View Job
                      </Link>
                    )}
                    {application.resumeUrl && (
                      <a
                        href={application.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                      >
                        View Resume
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MyApplications;
