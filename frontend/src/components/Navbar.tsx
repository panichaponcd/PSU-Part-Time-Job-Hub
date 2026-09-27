import { useState, useEffect, MouseEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  Menu,
  X,
  Home,
  Briefcase,
  LayoutDashboard,
  Info,
  Users,
  Building2,
  User as UserIcon,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ui/ThemeToggle';
import PsuLogo from './ui/PsuLogo';

function Navbar() {
  const [aboutOpen, setAboutOpen] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false); // Mobile Drawer
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false); // Desktop Profile Dropdown
  const { isLoggedIn, isAdmin, student, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
    setIsOpen(false);
  };

  useEffect(() => {
    setIsOpen(false);
    setAboutOpen(false);
    setDropdownOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu overlay is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = () => {
      setAboutOpen(false);
      setDropdownOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const getLinkClasses = (path: string) =>
    isActive(path)
      ? 'text-psu-blue dark:text-psu-light font-bold border-b-2 border-psu-blue dark:border-psu-light pb-1 pt-1 transition-all'
      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white pb-1 pt-1 transition-colors';

  const userInitial =
    student?.first_name?.charAt(0).toUpperCase() ||
    user?.username?.charAt(0).toUpperCase() ||
    'U';

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#0b132b]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto h-[72px] px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Left: Brand Logo & Title */}
        <Link
          to="/"
          className="flex items-center gap-2.5 sm:gap-3.5 group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-psu-blue rounded-lg pr-2 min-w-0"
        >
          <PsuLogo className="h-8 sm:h-9 w-auto shrink-0" />
          <span className="text-base sm:text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 whitespace-nowrap truncate group-hover:text-psu-navy dark:group-hover:text-psu-light transition-colors">
            Part-time Job Hub
          </span>
        </Link>

        {/* Desktop Navigation Links & Actions */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          <nav className="flex items-center space-x-7 text-sm font-medium">
            <Link to="/" className={getLinkClasses('/')}>
              Home
            </Link>
            <Link to="/jobs" className={getLinkClasses('/jobs')}>
              Jobs
            </Link>
            {isLoggedIn() && isAdmin() && (
              <Link to="/admin/dashboard" className={getLinkClasses('/admin')}>
                Dashboard
              </Link>
            )}

            {/* About Us Dropdown Trigger */}
            <div className="relative group cursor-pointer">
              <button
                type="button"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setAboutOpen(!aboutOpen);
                  setDropdownOpen(false);
                }}
                className={`flex items-center gap-1.5 focus:outline-none transition-colors ${
                  location.pathname.startsWith('/about')
                    ? 'text-psu-blue dark:text-psu-light font-bold border-b-2 border-psu-blue dark:border-psu-light pb-1 pt-1'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white pb-1 pt-1'
                }`}
              >
                <span>About Us</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    aboutOpen ? 'rotate-180 text-psu-blue dark:text-psu-light' : 'group-hover:text-slate-700 dark:group-hover:text-slate-200'
                  }`}
                />
              </button>

              <AnimatePresence>
                {aboutOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-10 left-0 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50"
                  >
                    <Link
                      to="/about"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
                    >
                      <Info className="w-4 h-4 text-psu-blue dark:text-psu-light" />
                      <span>About This Project</span>
                    </Link>
                    <Link
                      to="/about/personnel"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
                    >
                      <Users className="w-4 h-4 text-psu-blue dark:text-psu-light" />
                      <span>Personnel</span>
                    </Link>
                    <Link
                      to="/about/student-organization"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
                    >
                      <Building2 className="w-4 h-4 text-psu-blue dark:text-psu-light" />
                      <span>Student Organization</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* Vertical Divider */}
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>

          {/* Theme Toggle Button */}
          <ThemeToggle />

          {/* Authentication & Profile Control */}
          {isLoggedIn() ? (
            <div className="relative">
              <button
                type="button"
                onClick={(e: MouseEvent<HTMLButtonElement>) => {
                  e.stopPropagation();
                  setDropdownOpen(!dropdownOpen);
                  setAboutOpen(false);
                }}
                className="flex items-center gap-2 focus:outline-none rounded-full group cursor-pointer"
                aria-label="User Profile Menu"
              >
                <div className="w-9 h-9 rounded-full bg-psu-navy dark:bg-psu-blue text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-slate-100 dark:ring-slate-700 group-hover:ring-psu-blue transition-all">
                  {userInitial}
                </div>
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-3 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1 select-none">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        {isAdmin() ? 'Staff Account' : 'Student Account'}
                      </p>
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                        {student ? `${student.first_name} ${student.last_name}` : user?.username}
                      </p>
                      {student?.student_id && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                          {student.student_id}
                        </p>
                      )}
                    </div>

                    <Link
                      to={isAdmin() ? '/admin/dashboard' : '/profile'}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-colors"
                    >
                      {isAdmin() ? (
                        <LayoutDashboard className="w-4 h-4 text-psu-blue dark:text-psu-light" />
                      ) : (
                        <UserIcon className="w-4 h-4 text-psu-blue dark:text-psu-light" />
                      )}
                      <span>{isAdmin() ? 'Dashboard' : 'My Profile'}</span>
                    </Link>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800"></div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/signin')}
              className="px-5 py-2.5 rounded-xl font-medium text-sm text-white bg-psu-navy hover:bg-[#003c71] dark:bg-psu-blue dark:hover:bg-psu-navy active:scale-[0.98] transition-all shadow-sm"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Right Controls: ThemeToggle + Hamburger Button */}
        <div className="flex md:hidden items-center gap-1.5 sm:gap-2 shrink-0">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 top-[72px] bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm z-40 md:hidden"
              aria-hidden="true"
            />

            {/* Floating Menu Panel */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed inset-x-0 top-[72px] z-50 md:hidden overflow-y-auto max-h-[calc(100vh-72px)] border-b border-slate-200 dark:border-slate-800 bg-white/98 dark:bg-[#0b132b]/98 backdrop-blur-md shadow-2xl px-4 py-4"
            >
              <div className="flex flex-col gap-1.5 pb-6">
                {isLoggedIn() && (
                  <div className="px-4 py-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 mb-2">
                    <p className="text-[10px] font-bold text-psu-blue dark:text-psu-light uppercase tracking-wider">
                      {isAdmin() ? 'Staff Account' : 'Student Account'}
                    </p>
                    <p className="text-base font-bold text-slate-800 dark:text-slate-100">
                      {student ? `${student.first_name} ${student.last_name}` : user?.username}
                    </p>
                    {student?.student_id && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{student.student_id}</p>
                    )}
                  </div>
                )}

                <Link
                  to="/"
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-medium transition-colors ${
                    location.pathname === '/'
                      ? 'bg-psu-blue/10 text-psu-blue dark:text-psu-light font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Home className="w-4 h-4 text-psu-blue dark:text-psu-light" />
                  <span>Home</span>
                </Link>
                <Link
                  to="/jobs"
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-medium transition-colors ${
                    location.pathname.startsWith('/jobs')
                      ? 'bg-psu-blue/10 text-psu-blue dark:text-psu-light font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Briefcase className="w-4 h-4 text-psu-blue dark:text-psu-light" />
                  <span>Browse Jobs</span>
                </Link>

                {isLoggedIn() && isAdmin() && (
                  <Link
                    to="/admin/dashboard"
                    className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-medium transition-colors ${
                      location.pathname.startsWith('/admin')
                        ? 'bg-psu-blue/10 text-psu-blue dark:text-psu-light font-bold'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <LayoutDashboard className="w-4 h-4 text-psu-blue dark:text-psu-light" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                {/* Mobile About Accordion */}
                <div className="pt-2 pb-1 border-t border-slate-100 dark:border-slate-800">
                  <p className="px-4 py-1 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    About PSU Phuket
                  </p>
                  <Link
                    to="/about"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <Info className="w-4 h-4 text-psu-blue dark:text-psu-light" />
                    <span>About This Project</span>
                  </Link>
                  <Link
                    to="/about/personnel"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <Users className="w-4 h-4 text-psu-blue dark:text-psu-light" />
                    <span>Project Personnel</span>
                  </Link>
                  <Link
                    to="/about/student-organization"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                  >
                    <Building2 className="w-4 h-4 text-psu-blue dark:text-psu-light" />
                    <span>Student Organization</span>
                  </Link>
                </div>

                {/* Mobile Auth Actions */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                  {isLoggedIn() ? (
                    <>
                      <Link
                        to={isAdmin() ? '/admin/dashboard' : '/profile'}
                        className="flex items-center gap-2.5 px-4 py-3 text-slate-800 dark:text-slate-100 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                      >
                        {isAdmin() ? (
                          <LayoutDashboard className="w-4 h-4 text-psu-blue dark:text-psu-light" />
                        ) : (
                          <UserIcon className="w-4 h-4 text-psu-blue dark:text-psu-light" />
                        )}
                        <span>{isAdmin() ? 'Dashboard' : 'My Profile'}</span>
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-3 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => navigate('/signin')}
                      className="w-full mt-2 px-5 py-3 rounded-xl font-bold text-white bg-psu-navy hover:bg-[#003c71] dark:bg-psu-blue active:scale-[0.98] transition-all shadow-sm"
                    >
                      Sign In
                    </button>
                  )}
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
