import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { BackToTop } from './components/ui';

import AboutUs from './pages/AboutUs';
import Personnel from './pages/Personnel';
import StudentOrganization from './pages/StudentOrganization';
import HallOfFame from './pages/HallOfFame';
import Articles from './pages/Articles';
import { UserGuide } from './pages/UserGuide';

import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminJobs from './pages/admin/AdminJobs';
import AdminJobForm from './pages/admin/AdminJobForm';
import AdminApplicants from './pages/admin/AdminApplicants';
import AdminEvaluate from './pages/admin/AdminEvaluate';

import { RedirectIfLoggedIn, RequireAuth, RequireAdmin } from './components/ProtectedRoute';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import { API_BASE_URL } from './utils/api';

function DocsRedirect() {
  useEffect(() => {
    window.location.replace(`${API_BASE_URL}/docs`);
  }, []);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();

  const routeKey = location.pathname.startsWith('/admin') ? 'admin-root' : location.pathname;

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={routeKey}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />

        <Route path="/about" element={<AboutUs />} />
        <Route path="/about/personnel" element={<Personnel />} />
        <Route path="/about/student-organization" element={<StudentOrganization />} />
        <Route path="/other/articles" element={<Articles />} />
        <Route path="/other/hall-of-fame" element={<HallOfFame />} />

        {/* Documentation Redirect */}
        <Route path="/docs" element={<DocsRedirect />} />

        {/* User Guide & Testing Manual */}
        <Route path="/guide" element={<UserGuide />} />
        <Route path="/manual" element={<UserGuide />} />

        {/* Auth routes */}
        <Route
          path="/register"
          element={
            <RedirectIfLoggedIn>
              <Register />
            </RedirectIfLoggedIn>
          }
        />

        <Route
          path="/signin"
          element={
            <RedirectIfLoggedIn>
              <SignIn />
            </RedirectIfLoggedIn>
          }
        />

        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="jobs" element={<AdminJobs />} />
          <Route path="jobs/new" element={<AdminJobForm />} />
          <Route path="jobs/:id/edit" element={<AdminJobForm />} />
          <Route path="jobs/:id/applicants" element={<AdminApplicants />} />
          <Route path="applications/:applicationId/evaluate" element={<AdminEvaluate />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-[#0b132b] text-slate-800 dark:text-slate-100">
        <ScrollToTop />
        <Navbar />
        <main className="flex-1 relative z-10">
          <AnimatedRoutes />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </Router>
  );
}

export default App;
