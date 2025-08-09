import { Link } from "react-router-dom";
import {
  MapPin,
  Clock,
  DollarSign,
  Building,
  Heart,
  Eye,
  CheckCircle,
} from "lucide-react";
import { useJobs } from "../../context/JobContext";


function JobCard({ job, viewMode = "grid" }) {
  const {
    favoriteJobs,
    addToFavorites,
    removeFromFavorites,
    addToRecentlyViewed,
    hasUserApplied,
  } = useJobs();
  const isFavorite = favoriteJobs.includes(job._id);
  const isApplied = hasUserApplied(job._id);

  const formatSalary = (salary) => {
    if (!salary) return "Competitive";
    return `$${salary.toLocaleString()}`;
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

  const handleFavoriteClick = (e) => {
    e.preventDefault();
    if (isFavorite) {
      removeFromFavorites(job._id);
    } else {
      addToFavorites(job._id);
    }
  };

  const handleViewJob = () => {
    addToRecentlyViewed(job._id);
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 group">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-4 flex-1 min-w-0">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
              {job.company.charAt(0)}
            </div>

            <div className="flex-1 min-w-0">
              <Link
                to={`/job/${job._id}`}
                onClick={handleViewJob}
                className="block hover:text-blue-600 transition-colors"
              >
                <h3 className="font-semibold text-gray-800 text-lg truncate">
                  {job.title}
                </h3>
                <div className="flex items-center text-gray-600 text-sm mt-1">
                  <Building className="h-4 w-4 mr-1 flex-shrink-0" />
                  <span className="truncate">{job.company}</span>
                </div>
              </Link>

              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="truncate">{job.location}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-1" />
                  {formatSalary(job.salary)}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {getTimeAgo(job.createdAt)}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full whitespace-nowrap">
              {job.type || "Full-time"}
            </span>

            <button
              onClick={handleFavoriteClick}
              className={`p-2 transition-colors ${
                isFavorite
                  ? "text-red-500 hover:text-red-600"
                  : "text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`}
              />
            </button>

            {isApplied ? (
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Applied</span>
              </div>
            ) : (
              <Link
                to={`/apply/${job._id}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              >
                Apply Now
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group hover:-translate-y-1">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {job.company.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <Link
              to={`/job/${job._id}`}
              onClick={handleViewJob}
              className="font-semibold text-gray-800 text-lg hover:text-blue-600 transition-colors block truncate"
            >
              {job.title}
            </Link>
            <div className="flex items-center text-gray-600 text-sm">
              <Building className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{job.company}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleFavoriteClick}
          className={`p-1.5 transition-colors flex-shrink-0 ${
            isFavorite
              ? "text-red-500 hover:text-red-600"
              : "text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100"
          }`}
        >
          <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
          {job.type || "Full-time"}
        </span>
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-1" />
          {getTimeAgo(job.createdAt)}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {job.description}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center min-w-0 flex-1">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>
        <div className="flex items-center text-green-600 font-medium ml-2">
          <DollarSign className="h-4 w-4 mr-1" />
          {formatSalary(job.salary)}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Link
          to={`/job/${job._id}`}
          onClick={handleViewJob}
          className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Link>

        {isApplied ? (
          <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-2 rounded-lg">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Applied</span>
          </div>
        ) : (
          <Link
            to={`/apply/${job._id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Apply Now
          </Link>
        )}
      </div>
    </div>
  );
}

export default JobCard;
