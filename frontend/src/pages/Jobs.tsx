import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Search, X, Briefcase, RefreshCw } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import JobCard from '../components/JobCard';
import bgImage from '../assets/home-bg-1.jpg';
import Placeholder from '../assets/placeholder-image.jpg';
import { api } from '../utils/api';

function Jobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all' | 'internal' | 'external'>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/jobs/');
        const data = await response.json();

        const formattedJobs = data
          .map((job: any) => {
            let displayDate = `${job.academic_term}/${job.academic_year}`;

            if (job.schedules && job.schedules.length > 0) {
              const sorted = job.schedules
                .map((s: any) => new Date(s.date))
                .filter((d: Date) => !isNaN(d.getTime()))
                .sort((a: Date, b: Date) => a.getTime() - b.getTime());

              if (sorted.length > 0) {
                const start = sorted[0].toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                });
                const end = sorted[sorted.length - 1].toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });
                displayDate =
                  sorted.length === 1
                    ? `${start} ${sorted[0].getFullYear()}`
                    : `${start} - ${end}`;
              }
            }

            return {
              ...job,
              pay: job.compensation_amount,
              location: job.location_type,
              image: job.poster_image_url || Placeholder,
              isOpen: job.status === 'OPEN',
              type: job.job_type ? job.job_type.toLowerCase() : 'internal',
              date: displayDate,
              applicants: job.applicants_count || 0,
              postedBy: job.organization_name,
            };
          })
          .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

        setJobs(formattedJobs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs: ', error);
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const isPublic = job.status === 'OPEN' || job.status === 'CLOSED';
    const matchesType = filter === 'all' || job.type === filter;
    const matchesSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(search.toLowerCase())) ||
      (job.postedBy && job.postedBy.toLowerCase().includes(search.toLowerCase()));

    return isPublic && matchesType && matchesSearch;
  });

  const resetFilters = () => {
    setSearch('');
    setFilter('all');
  };

  return (
    <div className="relative min-h-[calc(100vh-72px)] w-full overflow-hidden flex flex-col justify-start">
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
      <div className="fixed inset-0 bg-slate-950/50 dark:bg-slate-950/75 z-0 pointer-events-none" />

      <PageTransition>
        <div className="relative z-10 py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Central Glassmorphic Workspace Container */}
          <div className="w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/60 dark:border-slate-800">
            
            {/* Section Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                Search Jobs
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Browse verified part-time shifts and campus gigs for PSU Phuket students
              </p>
            </div>

            {/* Single Horizontal Search & Filter Toolbar */}
            <div className="mb-8 flex flex-col md:flex-row items-stretch md:items-center gap-3">
              {/* Search Input Field */}
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by job title, location, or department..."
                  aria-label="Search job title or keyword"
                  className="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-psu-blue dark:focus:ring-psu-light focus:border-transparent text-sm sm:text-base shadow-sm transition"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                    aria-label="Clear search input"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filter Pills Group */}
              <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl shrink-0 self-start md:self-auto">
                {(['all', 'internal', 'external'] as const).map((type) => {
                  const isActive = filter === type;
                  return (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFilter(type)}
                      className={`px-4 sm:px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        isActive
                          ? 'bg-psu-navy dark:bg-psu-blue text-white shadow-sm'
                          : 'bg-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area: Loading / Grid / Empty State */}
            {loading ? (
              /* Loading Skeletons */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/60 overflow-hidden shadow-sm animate-pulse flex flex-col h-[340px]"
                  >
                    <div className="h-44 bg-slate-200 dark:bg-slate-800" />
                    <div className="p-4 space-y-3 flex-1">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                      <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredJobs.length > 0 ? (
              /* Job Directory Grid */
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredJobs.map((job) => (
                    <motion.div
                      layout
                      key={job.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="h-full"
                    >
                      <JobCard job={job} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              /* Empty Search Results State */
              <div className="text-center py-16 px-4 bg-slate-50/60 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-3">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
                  No jobs found
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-5">
                  No campus shifts matched your search query or filter criteria.
                </p>
                {(search || filter !== 'all') && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-psu-blue dark:text-psu-light bg-psu-blue/10 dark:bg-psu-light/10 hover:bg-psu-blue/20 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Filters</span>
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      </PageTransition>
    </div>
  );
}

export default Jobs;
