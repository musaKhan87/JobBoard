import { useState } from "react";
import {
  Search,
  MapPin,
  X,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Calendar,
  Briefcase,
} from "lucide-react";
import { useJobs } from "../../context/JobContext";

function SearchBar() {
  const {
    searchTerm,
    locationFilter,
    salaryRange,
    jobType,
    datePosted,
    filterJobs,
  } = useJobs();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [localLocationFilter, setLocalLocationFilter] =
    useState(locationFilter);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    salaryRange,
    jobType,
    datePosted,
  });

  const jobTypes = ["Full-time", "Part-time", "Contract", "Remote"];
  const dateOptions = [
    { value: "", label: "Any time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This week" },
    { value: "month", label: "This month" },
  ];

  const popularSearches = [
    "Frontend Developer",
    "Backend Developer",
    "Full Stack Developer",
    "UI/UX Designer",
    "Product Manager",
    "DevOps Engineer",
  ];

  const popularLocations = [
    "San Francisco, CA",
    "New York, NY",
    "Austin, TX",
    "Seattle, WA",
    "Remote",
    "Los Angeles, CA",
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    filterJobs({
      searchTerm: localSearchTerm,
      locationFilter: localLocationFilter,
      ...localFilters,
    });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const clearAllFilters = () => {
    setLocalSearchTerm("");
    setLocalLocationFilter("");
    const clearedFilters = {
      salaryRange: [0, 200000],
      jobType: "",
      datePosted: "",
    };
    setLocalFilters(clearedFilters);
    filterJobs({
      searchTerm: "",
      locationFilter: "",
      ...clearedFilters,
    });
  };

  const hasActiveFilters =
    localSearchTerm ||
    localLocationFilter ||
    localFilters.jobType ||
    localFilters.datePosted ||
    localFilters.salaryRange[1] < 200000;

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Main Search Form */}
      <form
        onSubmit={handleSearch}
        className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
      >
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Job title, keywords, or company"
              value={localSearchTerm}
              onChange={(e) => setLocalSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-lg"
            />
            {localSearchTerm && (
              <button
                type="button"
                onClick={() => setLocalSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Location Input */}
          <div className="flex-1 relative">
            <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Location"
              value={localLocationFilter}
              onChange={(e) => setLocalLocationFilter(e.target.value)}
              className="w-full pl-12 pr-10 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 text-lg"
            />
            {localLocationFilter && (
              <button
                type="button"
                onClick={() => setLocalLocationFilter("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg whitespace-nowrap"
          >
            <span className="hidden sm:inline">Search Jobs</span>
            <Search className="h-5 w-5 sm:hidden" />
          </button>
        </div>

        {/* Advanced Filters Toggle and Clear */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                showAdvancedFilters
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {showAdvancedFilters ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
              <span>Advanced Filters</span>
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-sm text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Popular Searches */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 mr-2">Popular:</span>
            {popularSearches.slice(0, 3).map((search) => (
              <button
                key={search}
                type="button"
                onClick={() => setLocalSearchTerm(search)}
                className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <div className="mt-4 bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Job Type Filter */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Briefcase className="h-4 w-4 mr-2 text-blue-600" />
                Job Type
              </label>
              <div className="space-y-2">
                {jobTypes.map((type) => (
                  <label
                    key={type}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="jobType"
                      value={type}
                      checked={localFilters.jobType === type}
                      onChange={(e) =>
                        handleFilterChange("jobType", e.target.value)
                      }
                      className="mr-3 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-600 hover:text-gray-800">
                      {type}
                    </span>
                  </label>
                ))}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="jobType"
                    value=""
                    checked={localFilters.jobType === ""}
                    onChange={(e) =>
                      handleFilterChange("jobType", e.target.value)
                    }
                    className="mr-3 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="text-sm text-gray-600 hover:text-gray-800">
                    All types
                  </span>
                </label>
              </div>
            </div>

            {/* Salary Range Filter */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                Salary Range
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="5000"
                  value={localFilters.salaryRange[1]}
                  onChange={(e) =>
                    handleFilterChange("salaryRange", [
                      localFilters.salaryRange[0],
                      Number.parseInt(e.target.value),
                    ])
                  }
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span className="font-medium text-green-600">
                    ${localFilters.salaryRange[1].toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Date Posted Filter */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                Date Posted
              </label>
              <div className="space-y-2">
                {dateOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="datePosted"
                      value={option.value}
                      checked={localFilters.datePosted === option.value}
                      onChange={(e) =>
                        handleFilterChange("datePosted", e.target.value)
                      }
                      className="mr-3 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="text-sm text-gray-600 hover:text-gray-800">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Popular Locations */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                <MapPin className="h-4 w-4 mr-2 text-red-600" />
                Popular Locations
              </label>
              <div className="space-y-2">
                {popularLocations.slice(0, 5).map((location) => (
                  <button
                    key={location}
                    type="button"
                    onClick={() => setLocalLocationFilter(location)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      localLocationFilter === location
                        ? "bg-blue-100 text-blue-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                    }`}
                  >
                    {location}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Apply Filters Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={handleSearch}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
