import { BrowserRouter, Route, Routes } from "react-router-dom";

import JobListings from "./pages/JobListings";
import JobDetails from "./pages/JobDetails";
import ApplyJob from "./pages/ApplyJob";
import Favorites from "./pages/Favorites";
import MyApplications from "./pages/MyApplications";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";

import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { JobProvider } from "./context/JobContext";
import Toast from "./components/Ui/Toast";



function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <JobProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Navbar />

              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<JobListings />} />
                  <Route path="/job/:jobId" element={<JobDetails />} />
                  <Route path="/apply/:jobId" element={<ApplyJob />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/my-applications" element={<MyApplications />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminPanel />} />
                </Routes>
              </main>

              <Footer />
              <Toast/>
            </div>
          </BrowserRouter>
        </JobProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
