import { createContext, useContext, useReducer, useEffect } from "react";
import { useToast } from "./ToastContext";

const JobContext = createContext();

const initialState = {
  jobs: [],
  filteredJobs: [],
  favoriteJobs: JSON.parse(localStorage.getItem("favoriteJobs") || "[]"),
  recentlyViewed: JSON.parse(localStorage.getItem("recentlyViewed") || "[]"),
  userApplications: [],
  loading: false,
  error: null,
  searchTerm: "",
  locationFilter: "",
  salaryRange: [0, 200000],
  jobType: "",
  datePosted: "",
  currentPage: 1,
  jobsPerPage: 9,
  totalJobs: 0,
  applications: [],
};

function jobReducer(state, action) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_JOBS":
      return {
        ...state,
        jobs: action.payload,
        filteredJobs: action.payload,
        totalJobs: action.payload.length,
        loading: false,
      };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "FILTER_JOBS":
      const { searchTerm, locationFilter, salaryRange, jobType, datePosted } =
        action.payload;
      const filtered = state.jobs.filter((job) => {
        const matchesSearch =
          !searchTerm ||
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesLocation =
          !locationFilter ||
          job.location.toLowerCase().includes(locationFilter.toLowerCase());

        const matchesSalary =
          !job.salary ||
          (job.salary >= salaryRange[0] && job.salary <= salaryRange[1]);

        const matchesType = !jobType || job.type === jobType;

        const matchesDate =
          !datePosted || isWithinDateRange(job.createdAt, datePosted);

        return (
          matchesSearch &&
          matchesLocation &&
          matchesSalary &&
          matchesType &&
          matchesDate
        );
      });

      return {
        ...state,
        filteredJobs: filtered,
        searchTerm,
        locationFilter,
        salaryRange,
        jobType,
        datePosted,
        totalJobs: filtered.length,
        currentPage: 1,
      };
    case "SET_PAGE":
      return { ...state, currentPage: action.payload };
    case "ADD_FAVORITE":
      const newFavorites = [...state.favoriteJobs, action.payload];
      localStorage.setItem("favoriteJobs", JSON.stringify(newFavorites));
      return { ...state, favoriteJobs: newFavorites };
    case "REMOVE_FAVORITE":
      const updatedFavorites = state.favoriteJobs.filter(
        (id) => id !== action.payload
      );
      localStorage.setItem("favoriteJobs", JSON.stringify(updatedFavorites));
      return { ...state, favoriteJobs: updatedFavorites };
    case "ADD_RECENTLY_VIEWED":
      const recentlyViewed = [
        action.payload,
        ...state.recentlyViewed.filter((id) => id !== action.payload),
      ].slice(0, 10);
      localStorage.setItem("recentlyViewed", JSON.stringify(recentlyViewed));
      return { ...state, recentlyViewed };
    case "SET_USER_APPLICATIONS":
      return { ...state, userApplications: action.payload };
    case "ADD_USER_APPLICATION":
      const newUserApplications = [...state.userApplications, action.payload];
      return { ...state, userApplications: newUserApplications };
    case "UPDATE_USER_APPLICATION":
      const updatedUserApplications = state.userApplications.map((app) =>
        app._id === action.payload._id ? action.payload : app
      );
      return { ...state, userApplications: updatedUserApplications };
    case "SET_APPLICATIONS":
      return { ...state, applications: action.payload };
    case "ADD_JOB":
      const newJobs = [...state.jobs, action.payload];
      return {
        ...state,
        jobs: newJobs,
        filteredJobs: newJobs,
        totalJobs: newJobs.length,
      };
    case "UPDATE_JOB":
      const updatedJobs = state.jobs.map((job) =>
        job._id === action.payload._id ? action.payload : job
      );
      return {
        ...state,
        jobs: updatedJobs,
        filteredJobs: updatedJobs,
      };
    case "DELETE_JOB":
      const remainingJobs = state.jobs.filter(
        (job) => job._id !== action.payload
      );
      return {
        ...state,
        jobs: remainingJobs,
        filteredJobs: remainingJobs,
        totalJobs: remainingJobs.length,
      };
    default:
      return state;
  }
}

function isWithinDateRange(jobDate, filter) {
  const now = new Date();
  const jobCreated = new Date(jobDate);
  const diffTime = Math.abs(now - jobCreated);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  switch (filter) {
    case "today":
      return diffDays <= 1;
    case "week":
      return diffDays <= 7;
    case "month":
      return diffDays <= 30;
    default:
      return true;
  }
}

export function JobProvider({ children }) {
  const [state, dispatch] = useReducer(jobReducer, initialState);
  const { showSuccess, showError } = useToast();

  const fetchJobs = async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const response = await fetch("/api/jobs");
      if (!response.ok) throw new Error("Failed to fetch jobs");
      const jobs = await response.json();
      dispatch({ type: "SET_JOBS", payload: jobs });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
      showError("Failed to load jobs");
    }
  };

  const fetchApplications = async () => {
    try {
      const response = await fetch("/api/apply");
      if (response.ok) {
        const applications = await response.json();
        dispatch({ type: "SET_APPLICATIONS", payload: applications });
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    }
  };

  const fetchUserApplications = async (userEmail) => {
    if (!userEmail) return;
    try {
      const response = await fetch(
        `/api/apply/user/${encodeURIComponent(userEmail)}`
      );
      if (response.ok) {
        const userApplications = await response.json();
        dispatch({ type: "SET_USER_APPLICATIONS", payload: userApplications });
      }
    } catch (error) {
      console.error("Error fetching user applications:", error);
    }
  };

  const filterJobs = (filters) => {
    dispatch({ type: "FILTER_JOBS", payload: filters });
  };

  const setPage = (page) => {
    dispatch({ type: "SET_PAGE", payload: page });
  };

  const addToFavorites = (jobId) => {
    dispatch({ type: "ADD_FAVORITE", payload: jobId });
    showSuccess("Job added to favorites!");
  };

  const removeFromFavorites = (jobId) => {
    dispatch({ type: "REMOVE_FAVORITE", payload: jobId });
    showSuccess("Job removed from favorites!");
  };

  const addToRecentlyViewed = (jobId) => {
    dispatch({ type: "ADD_RECENTLY_VIEWED", payload: jobId });
  };

  const hasUserApplied = (jobId) => {
    return state.userApplications.some(
      (app) => app.jobId === jobId || app.jobId?._id === jobId
    );
  };

  const addJob = async (jobData) => {
    try {
      const response = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
      if (!response.ok) throw new Error("Failed to create job");
      const newJob = await response.json();
      dispatch({ type: "ADD_JOB", payload: newJob });
      showSuccess("Job created successfully!");
      return newJob;
    } catch (error) {
      showError("Failed to create job");
      throw error;
    }
  };

  const updateJob = async (id, jobData) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jobData),
      });
      if (!response.ok) throw new Error("Failed to update job");
      const updatedJob = await response.json();
      dispatch({ type: "UPDATE_JOB", payload: updatedJob });
      showSuccess("Job updated successfully!");
      return updatedJob;
    } catch (error) {
      showError("Failed to update job");
      throw error;
    }
  };

  const deleteJob = async (id) => {
    try {
      const response = await fetch(`/api/jobs/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete job");
      dispatch({ type: "DELETE_JOB", payload: id });
      showSuccess("Job deleted successfully!");
    } catch (error) {
      showError("Failed to delete job");
      throw error;
    }
  };

  const applyToJob = async (jobId, applicationData) => {
    try {
      const response = await fetch(`/api/apply/${jobId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(applicationData),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      const result = await response.json();
      console.log(result);
      
      const id = result.id;
      

      // Add to user applications
      dispatch({
        type: "ADD_USER_APPLICATION",
        payload: result.application,
      });


         // ✅ Store applied job ID in localStorage
    const appliedJobs = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
    if (!appliedJobs.includes(id)) {
      appliedJobs.push(id);
      localStorage.setItem("appliedJobs", JSON.stringify(appliedJobs));
    }

      showSuccess("Application submitted successfully!");
      return result;
    } catch (error) {
      showError(error.message || "Failed to submit application");
      throw error;
    }
  };

  const getPaginatedJobs = () => {
    const startIndex = (state.currentPage - 1) * state.jobsPerPage;
    const endIndex = startIndex + state.jobsPerPage;
    return state.filteredJobs.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    return Math.ceil(state.totalJobs / state.jobsPerPage);
  };

  useEffect(() => {
    fetchJobs();
    fetchApplications();
  }, []);

  return (
    <JobContext.Provider
      value={{
        ...state,
        fetchJobs,
        fetchApplications,
        fetchUserApplications,
        filterJobs,
        setPage,
        addToFavorites,
        removeFromFavorites,
        addToRecentlyViewed,
        hasUserApplied,
        addJob,
        updateJob,
        deleteJob,
        applyToJob,
        getPaginatedJobs,
        getTotalPages,
      }}
    >
      {children}
    </JobContext.Provider>
  );
}

export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error("useJobs must be used within a JobProvider");
  }
  return context;
};
