import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Briefcase, RefreshCw } from 'lucide-react';
import PageTransition from '../components/PageTransition';
import JobCard from '../components/JobCard';
import { AppBackground, GlassCard, EmptyState } from '../components/ui';
import { JobFilterToolbar } from '../components/jobs';
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
      <AppBackground />

      <PageTransition>
        <div className="relative z-10 py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Central Glassmorphic Workspace Container */}
          <GlassCard variant="container">
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
            <JobFilterToolbar
              search={search}
              onSearchChange={setSearch}
              onClearSearch={() => setSearch('')}
              filter={filter}
              onFilterChange={setFilter}
            />

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
              <EmptyState
                icon={Briefcase}
                title="No jobs found"
                description="No campus shifts matched your search query or filter criteria."
                actionText={search || filter !== 'all' ? 'Reset Filters' : undefined}
                actionIcon={RefreshCw}
                onAction={search || filter !== 'all' ? resetFilters : undefined}
              />
            )}
          </GlassCard>
        </div>
      </PageTransition>
    </div>
  );
}

export default Jobs;
