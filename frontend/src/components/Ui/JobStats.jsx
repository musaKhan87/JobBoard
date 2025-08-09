import { Briefcase, Building, MapPin, TrendingUp } from "lucide-react";
import { useJobs } from "../../context/JobContext";

function JobStats() {
  const { jobs, filteredJobs } = useJobs();

  const getUniqueCompanies = () => {
    const companies = new Set(jobs.map((job) => job.company));
    return companies.size;
  };

  const getUniqueLocations = () => {
    const locations = new Set(jobs.map((job) => job.location));
    return locations.size;
  };

  const getAverageSalary = () => {
    const salaries = jobs.filter((job) => job.salary).map((job) => job.salary);
    if (salaries.length === 0) return 0;
    const average =
      salaries.reduce((sum, salary) => sum + salary, 0) / salaries.length;
    return Math.round(average);
  };

  const stats = [
    {
      icon: Briefcase,
      label: "Available Jobs",
      value: filteredJobs.length,
      color: "blue",
    },
    {
      icon: Building,
      label: "Companies",
      value: getUniqueCompanies(),
      color: "green",
    },
    {
      icon: MapPin,
      label: "Locations",
      value: getUniqueLocations(),
      color: "purple",
    },
    {
      icon: TrendingUp,
      label: "Avg. Salary",
      value: `$${getAverageSalary().toLocaleString()}`,
      color: "orange",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default JobStats;
