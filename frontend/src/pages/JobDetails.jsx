import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Clock,
  Building,
  Heart,
  Calendar,
  CheckCircle,
  Briefcase,
  Award,
  Target,
} from "lucide-react";
import { useJobs } from "../context/JobContext";
import LoadingSpinner from "../components/Ui/LoadingSpinner";

function JobDetails() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const {
    jobs,
    favoriteJobs,
    addToFavorites,
    removeFromFavorites,
    addToRecentlyViewed,
    hasUserApplied,
  } = useJobs();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("job"); // job or company

  const isFavorite = favoriteJobs.includes(jobId);
  const isApplied = hasUserApplied(jobId);

  useEffect(() => {
    const foundJob = jobs.find((j) => j._id === jobId);
    if (foundJob) {
      setJob(foundJob);
      addToRecentlyViewed(jobId);
      setLoading(false);
    } else {
      fetchJob();
    }
  }, [jobId, jobs]);

  const fetchJob = async () => {
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      if (response.ok) {
        const jobData = await response.json();
        setJob(jobData);
        addToRecentlyViewed(jobId);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error fetching job:", error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFromFavorites(jobId);
    } else {
      addToFavorites(jobId);
    }
  };

  const getTimeAgo = (date) => {
    const now = new Date();
    const jobDate = new Date(date);
    const diffTime = Math.abs(now - jobDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  if (loading) return <LoadingSpinner />;

  if (!job) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Job Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors group"
      >
        <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back</span>
      </button>

      {/* Job Header */}
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex items-start space-x-4 flex-1">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
              {job.company.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 leading-tight">
                {job.title}
              </h1>
              <div className="flex items-center text-gray-600 text-lg mb-4">
                <Building className="h-5 w-5 mr-2" />
                <span className="font-medium">{job.company}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex items-center text-green-600 font-semibold">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>${job.salary.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{getTimeAgo(job.createdAt)}</span>
                </div>
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                  {job.type || "Full-time"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={handleFavoriteClick}
              className={`flex items-center space-x-2 px-4 py-3 border rounded-xl transition-all duration-200 ${
                isFavorite
                  ? "text-red-600 border-red-300 bg-red-50 hover:bg-red-100"
                  : "text-gray-600 border-gray-300 hover:text-red-600 hover:border-red-300 hover:bg-red-50"
              }`}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? "fill-current" : ""}`}
              />
              <span className="font-medium">
                {isFavorite ? "Saved" : "Save Job"}
              </span>
            </button>

            {isApplied ? (
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-6 py-3 rounded-xl border border-green-200">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Applied</span>
              </div>
            ) : (
              <Link
                to={`/apply/${job._id}`}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Apply Now
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8">
            <button
              onClick={() => setActiveTab("job")}
              className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "job"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Job Details
            </button>
            
          </nav>
        </div>

        <div className="p-8">
         
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Job Description */}
                <div className="bg-gray-50 rounded-2xl p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Job Description
                    </h2>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed text-lg">
                      {job.description}
                    </p>
                  </div>
                </div>

                {/* Requirements */}
                {job.requirements && job.requirements.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                        <Target className="h-5 w-5 text-purple-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Requirements
                      </h2>
                    </div>
                    <ul className="space-y-4">
                      {job.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-0.5 flex-shrink-0">
                            <span className="text-blue-600 text-sm font-bold">
                              {index + 1}
                            </span>
                          </div>
                          <span className="text-gray-700 leading-relaxed">
                            {requirement}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Benefits */}
                {job.benefits && job.benefits.length > 0 && (
                  <div className="bg-gray-50 rounded-2xl p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                        <Award className="h-5 w-5 text-green-600" />
                      </div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Benefits & Perks
                      </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {job.benefits.map((benefit, index) => (
                        <div
                          key={index}
                          className="flex items-center p-4 bg-white rounded-xl border border-green-100"
                        >
                          <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 font-medium">
                            {benefit}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Apply Card */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-6 border border-blue-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Quick Apply
                  </h3>
                  {isApplied ? (
                    <div className="text-center py-4">
                      <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                      <p className="text-green-800 font-semibold mb-2">
                        Application Submitted!
                      </p>
                      <p className="text-sm text-green-600">
                        We'll review your application and get back to you soon.
                      </p>
                      <Link
                        to="/my-applications"
                        className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        View My Applications →
                      </Link>
                    </div>
                  ) : (
                    <>
                      <Link
                        to={`/apply/${job._id}`}
                        className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-center py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg mb-4"
                      >
                        Apply for this Job
                      </Link>
                      <p className="text-sm text-gray-600 text-center">
                        <Clock className="h-4 w-4 inline mr-1" />
                        Takes less than 5 minutes
                      </p>
                    </>
                  )}
                </div>

                {/* Job Information */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">
                    Job Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="h-5 w-5 mr-3" />
                        <span>Job Type</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {job.type || "Full-time"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-3" />
                        <span>Location</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {job.location}
                      </span>
                    </div>
                    {job.salary && (
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="h-5 w-5 mr-3" />
                          <span>Salary</span>
                        </div>
                        <span className="font-semibold text-green-600">
                          ${job.salary.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 mr-3" />
                        <span>Posted</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {getTimeAgo(job.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
         
           
        </div>
      </div>
    </div>
  );
}
export default JobDetails;
