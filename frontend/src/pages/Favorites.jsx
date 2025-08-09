import { Heart, Grid, List } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

import { useJobs } from "../context/JobContext";
import JobCard from "../components/Ui/JobCard";

const Favorites = () => {
  const { jobs, favoriteJobs } = useJobs();
  const [viewMode, setViewMode] = useState("grid");

  const favoriteJobsList = jobs.filter((job) => favoriteJobs.includes(job._id));

  if (favoriteJobs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-16">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            No Favorite Jobs Yet
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start browsing jobs and save the ones you're interested in by
            clicking the heart icon.
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
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          My Favorite Jobs
        </h1>
        <p className="text-gray-600">Jobs you've saved for later</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            {favoriteJobsList.length} favorite job
            {favoriteJobsList.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Favorite Jobs List */}
      <div
        className={
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }
      >
        {favoriteJobsList.map((job) => (
          <JobCard key={job._id} job={job} viewMode={viewMode} />
        ))}
      </div>
    </div>
  );
};

export default Favorites;
