import { Link, useLocation } from "react-router-dom";
import { Briefcase, User, Home, Heart, FileText } from "lucide-react";
import { useJobs } from "../../context/JobContext";


const Navbar = () => {
  const location = useLocation();
  const { favoriteJobs, userApplications } = useJobs();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            <Briefcase className="h-8 w-8" />
            <span className="hidden sm:block">JobBoard</span>
          </Link>

          <div className="flex items-center space-x-2 sm:space-x-6">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-2 sm:px-3 py-2 rounded-md transition-colors text-sm sm:text-base ${
                isActive("/")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
              }`}
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:block">Jobs</span>
            </Link>

            <div className="relative">
              <Link
                to="/favorites"
                className={`flex items-center space-x-1 px-2 sm:px-3 py-2 rounded-md transition-colors text-sm sm:text-base ${
                  isActive("/favorites")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                }`}
              >
                <Heart className="h-4 w-4" />
                <span className="hidden sm:block">Favorites</span>
                {favoriteJobs.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {favoriteJobs.length}
                  </span>
                )}
              </Link>
            </div>

            <div className="relative">
              <Link
                to="/my-applications"
                className={`flex items-center space-x-1 px-2 sm:px-3 py-2 rounded-md transition-colors text-sm sm:text-base ${
                  isActive("/my-applications")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                }`}
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:block">My Applications</span>
                {userApplications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {userApplications.length}
                  </span>
                )}
              </Link>
            </div>

            <Link
              to="/admin"
              className={`flex items-center space-x-1 px-2 sm:px-3 py-2 rounded-md transition-colors text-sm sm:text-base ${
                isActive("/admin")
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
              }`}
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:block">Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
