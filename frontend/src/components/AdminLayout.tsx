import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Briefcase } from 'lucide-react';
import bgImage from '../assets/home-bg-3.jpg';

function AdminLayout() {
  const location = useLocation();

  const navLinks = [
    {
      to: '/admin/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      isActive: location.pathname === '/admin/dashboard',
    },
    {
      to: '/admin/jobs',
      icon: Briefcase,
      label: 'Job Management',
      isActive:
        location.pathname.startsWith('/admin/jobs') ||
        location.pathname.startsWith('/admin/applications'),
    },
  ];

  return (
    <div className="relative min-h-[calc(100vh-72px)] w-full flex flex-col justify-start">
      {/* Background Campus Scenery with Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-0 blur-[3px] scale-105 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(20, 35, 60, 0.4) 0%, rgba(10, 24, 45, 0.75) 100%), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 0%, rgba(10, 24, 45, 0.7) 100%), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }}
      />
      {/* Ambient Dark Overlay */}
      <div className="fixed inset-0 bg-slate-950/45 dark:bg-slate-950/75 z-0 pointer-events-none" />

      {/* Main Admin Content Container */}
      <div className="relative z-10 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left Sidebar for Desktop (1024px+) */}
        <aside className="w-64 shrink-0 hidden lg:block">
          <div className="sticky top-24 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/60 dark:border-slate-800 overflow-hidden p-3.5 space-y-2">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Admin Panel
              </span>
            </div>
            <nav aria-label="Admin Navigation" className="space-y-1.5">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${
                      link.isActive
                        ? 'bg-psu-navy dark:bg-psu-blue text-white shadow-md'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/70'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{link.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile & Tablet Sub-Navigation Header (<1024px) */}
        <div className="lg:hidden w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-1.5 border border-white/60 dark:border-slate-800 shadow-md flex items-center gap-1.5">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 sm:px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  link.isActive
                    ? 'bg-psu-navy dark:bg-psu-blue text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Primary Page Outlet */}
        <div className="flex-1 min-w-0">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
