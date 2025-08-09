import { useState } from "react";
import { Grid, List } from "lucide-react";
import Pagination from "../components/Ui/Pagination";
import JobCard from "../components/Ui/JobCard";
import JobStats from "../components/Ui/JobStats";
import SearchBar from "../components/Ui/Searchbar";
import LoadingSpinner from "../components/Ui/LoadingSpinner";

import { useJobs } from "../context/JobContext";

function JobListings() {
  const { getPaginatedJobs, loading, error, totalJobs } = useJobs();
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const paginatedJobs = getPaginatedJobs();

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-center py-12">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
            Find Your Dream Job
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 animate-slide-up">
            Discover amazing opportunities from top companies worldwide
          </p>
          <div className="max-w-4xl mx-auto">
            <SearchBar />
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-white opacity-5 rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Job Stats */}
      <JobStats />

      {/* Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center space-x-4">
          <span className="text-gray-600">
            {totalJobs} job{totalJobs !== 1 ? "s" : ""} found
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

      {/* Job Listings */}
      <div>
        {paginatedJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              No jobs found matching your criteria
            </div>
            <p className="text-gray-400">Try adjusting your search filters</p>
          </div>
        ) : (
          <>
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {paginatedJobs.map((job) => (
                <JobCard key={job._id} job={job} viewMode={viewMode} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-12">
              <Pagination />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default JobListings;
