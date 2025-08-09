import {
  Briefcase,
  Heart,
  Github,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white py-16 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Briefcase className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">JobBoard</span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              Connecting talented professionals with amazing opportunities. Find
              your dream job or discover your next great hire with our
              comprehensive job board platform.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* For Job Seekers */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">For Job Seekers</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Browse Jobs
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Career Advice
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Resume Builder
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Salary Guide
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Interview Tips
                </a>
              </li>
            </ul>
          </div>

          {/* For Employers */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">For Employers</h3>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Post a Job
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Browse Resumes
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Hiring Solutions
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Employer Branding
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Recruitment Tools
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center text-gray-300 mb-4 md:mb-0">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 mx-2" />
              <span>for job seekers everywhere</span>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
              <span>&copy; 2024 JobBoard. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
