import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Users, RotateCcw } from 'lucide-react';
import apiRequest from '../../utils/api';
import {
  ApplicantsHeader,
  ApplicantsFilters,
  ApplicantsTable,
  ApplicantsCardList,
  ApplicantsPagination,
  KickApplicantModal,
} from '../../components/admin/applicants';
import { PSU_FACULTIES } from '../../constants/faculties';

export function AdminApplicants() {
  const { id } = useParams<{ id: string }>();

  const [job, setJob] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [facultyFilter, setFacultyFilter] = useState('all');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Kick Modal state
  const [applicantToKick, setApplicantToKick] = useState<any | null>(null);
  const [isKicking, setIsKicking] = useState(false);

  // Toast feedback state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Auto-dismiss toast
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  // Fetch job details and applicants
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [jobRes, appRes] = await Promise.all([
        apiRequest(`/jobs/${id}/`),
        apiRequest(`/applications/?job=${id}`),
      ]);

      if (!jobRes.ok) throw new Error(`Failed to load job: ${jobRes.status}`);
      const jobData = await jobRes.json();
      const appData = await appRes.json();

      setJob(jobData);
      const cleanApps = Array.isArray(appData) ? appData : appData.results || [];
      setApplications(cleanApps);
    } catch (err: any) {
      console.error('Error fetching applicant data:', err);
      setError(err.message || 'Failed to load applicant records');
    } finally {
      setLoading(false);
    }
  };

  // Dynamically extract faculties from current applications, with fallback PSU faculties
  const availableFaculties = useMemo(() => {
    const fromApps = applications
      .map((a) => a.faculty?.trim())
      .filter((f) => Boolean(f));
    return Array.from(new Set([...fromApps, ...PSU_FACULTIES])).sort();
  }, [applications]);

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const q = search.trim().toLowerCase();
      const name = (app.student_name || '').toLowerCase();
      const sid = (app.student_id || '').toLowerCase();
      const matchesSearch = !q || name.includes(q) || sid.includes(q);

      const effectiveStatus = (app.evaluation ? 'COMPLETED' : app.status || '').toUpperCase();
      const matchesStatus =
        statusFilter === 'all' || effectiveStatus === statusFilter.toUpperCase();

      const faculty = (app.faculty || '').toLowerCase();
      const matchesFaculty =
        facultyFilter === 'all' || faculty === facultyFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesFaculty;
    });
  }, [applications, search, statusFilter, facultyFilter]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter, facultyFilter]);

  // Paginated applications
  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredApplications.slice(start, start + pageSize);
  }, [filteredApplications, currentPage, pageSize]);

  const isFiltered = search !== '' || statusFilter !== 'all' || facultyFilter !== 'all';

  const handleResetFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setFacultyFilter('all');
  };

  // Kick Applicant execution
  const handleConfirmKick = async () => {
    if (!applicantToKick) return;
    setIsKicking(true);

    try {
      const response = await apiRequest(`/applications/${applicantToKick.id}/`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setApplications((prev) => prev.filter((app) => app.id !== applicantToKick.id));
        setToast({
          message: `${applicantToKick.student_name || 'Applicant'} has been removed from this job.`,
          type: 'success',
        });
        setApplicantToKick(null);
      } else {
        throw new Error('Failed to remove applicant');
      }
    } catch (err: any) {
      console.error('Kick applicant error:', err);
      setToast({
        message: err.message || 'Could not remove applicant. Please try again.',
        type: 'error',
      });
    } finally {
      setIsKicking(false);
    }
  };

  // Client-side CSV export
  const handleExportCsv = () => {
    if (filteredApplications.length === 0) return;

    try {
      const headers = [
        'Application ID',
        'Student Name',
        'Student ID',
        'Faculty',
        'Applied Date',
        'Status',
        'Evaluated',
      ];

      const rows = filteredApplications.map((app) => [
        app.id,
        `"${(app.student_name || '').replace(/"/g, '""')}"`,
        `"${(app.student_id || '').replace(/"/g, '""')}"`,
        `"${(app.faculty || '').replace(/"/g, '""')}"`,
        app.application_date ? new Date(app.application_date).toISOString().slice(0, 10) : '',
        app.evaluation ? 'COMPLETED' : app.status || 'PENDING',
        app.evaluation ? 'Yes' : 'No',
      ]);

      const csvContent =
        '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const safeJobTitle = (job?.title || 'job')
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, '_')
        .slice(0, 30);
      const dateStr = new Date().toISOString().slice(0, 10);

      link.setAttribute('href', url);
      link.setAttribute('download', `applicants_${safeJobTitle}_${dateStr}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setToast({
        message: `Exported ${filteredApplications.length} applicants to CSV successfully!`,
        type: 'success',
      });
    } catch (err) {
      console.error('Export CSV error:', err);
      setToast({
        message: 'Failed to generate CSV export.',
        type: 'error',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header with Breadcrumb & Export Action */}
      <ApplicantsHeader
        job={job}
        totalApplicants={applications.length}
        onExportCsv={handleExportCsv}
      />

      {/* 2. Filters & Search Bar */}
      <ApplicantsFilters
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        facultyFilter={facultyFilter}
        setFacultyFilter={setFacultyFilter}
        availableFaculties={availableFaculties}
        onReset={handleResetFilters}
        isFiltered={isFiltered}
      />

      {/* 3. Applicants Display State */}
      {loading ? (
        <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-16 text-center text-slate-500 font-bold animate-pulse shadow-xl border border-white/60 dark:border-slate-800">
          Fetching applicant records...
        </div>
      ) : error ? (
        <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-12 text-center border border-rose-200 dark:border-rose-900/40 shadow-xl space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
          <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{error}</p>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-psu-blue text-white rounded-xl text-xs font-bold shadow-md hover:bg-psu-navy transition-all cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-16 text-center border border-white/60 dark:border-slate-800 shadow-xl space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-base font-bold text-slate-700 dark:text-slate-300">
            No applicants found
          </p>
          <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
            {isFiltered
              ? 'No applicant matches your current search or filter criteria. Try resetting the filters.'
              : 'There are currently no student applicants for this job position.'}
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-psu-blue hover:bg-psu-navy text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4 relative z-10">
          {/* Desktop Table View */}
          <ApplicantsTable
            applications={paginatedApplications}
            job={job}
            onOpenKickModal={(app) => setApplicantToKick(app)}
          />

          {/* Mobile Card List View */}
          <ApplicantsCardList
            applications={paginatedApplications}
            job={job}
            onOpenKickModal={(app) => setApplicantToKick(app)}
          />

          {/* Pagination Controls */}
          <ApplicantsPagination
            currentPage={currentPage}
            totalItems={filteredApplications.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* 4. Kick Confirmation Modal */}
      <KickApplicantModal
        isOpen={Boolean(applicantToKick)}
        applicant={applicantToKick}
        onClose={() => setApplicantToKick(null)}
        onConfirm={handleConfirmKick}
        isKicking={isKicking}
      />

      {/* 5. Toast Feedback Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transform-gpu will-change-[transform,opacity]"
          >
            <div
              className={`px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border backdrop-blur-xl ${
                toast.type === 'success'
                  ? 'bg-emerald-950/90 text-emerald-100 border-emerald-700/50'
                  : 'bg-rose-950/90 text-rose-100 border-rose-700/50'
              }`}
            >
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              )}
              <span>{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminApplicants;
