import { useState, useEffect, SyntheticEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import placeholder from '../assets/placeholder-image.jpg';
import {
  AppBackground,
  GlassCard,
  LoadingState,
  EmptyState,
  Modal,
} from '../components/ui';
import {
  JobScheduleTable,
  JobDetailHeader,
  JobQuickSpecs,
  JobDescription,
  JobApplyCard,
} from '../components/jobs';
import { api } from '../utils/api';

export function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, isAdmin } = useAuth();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applied, setApplied] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [myAppId, setMyAppId] = useState<number | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await api.get(`/jobs/${id}/`);
        const data = await response.json();

        setJob({
          ...data,
          pay: data.compensation_amount,
          location: data.location_type || 'PSU Phuket',
          image: data.poster_image_url || placeholder,
          isOpen: data.status === 'OPEN',
          line_group_url: data.line_group_url,
          required_amount: data.required_amount || 0,
          applicants: data.applicants_count || 0,
        });

        if (isLoggedIn()) {
          const appRes = await api.get('/applications/');
          const apps = await appRes.json();
          const appsList = Array.isArray(apps) ? apps : apps.results || [];

          const myApp = appsList.find((a: any) => String(a.job) === String(id));
          if (myApp) {
            setApplied(true);
            setApplicationStatus(myApp.status);
            setMyAppId(myApp.id);
          }
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching job detail:', error);
        setLoading(false);
      }
    };
    fetchJobDetail();
  }, [id, isLoggedIn]);

  const canSeePrivateDetails = isAdmin() || applicationStatus === 'APPROVED' || applied;
  const canSeeSchedule = isAdmin() || applied || job?.status === 'IN_PROGRESS' || job?.status === 'COMPLETED';

  const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    (e.target as HTMLImageElement).src = placeholder;
  };

  const handleApply = async () => {
    if (!isLoggedIn()) {
      navigate('/signin');
      return;
    }
    setApplying(true);
    setApplyError(null);
    try {
      const response = await api.post('/applications/', { job: id });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(JSON.stringify(data) || 'Failed to apply.');
      }
      const newApp = await response.json();
      setApplied(true);
      setApplicationStatus('APPROVED');
      setMyAppId(newApp.id);
      setJob((prev: any) => ({ ...prev, applicants: (prev.applicants || 0) + 1 }));
    } catch (err: any) {
      setApplyError(err.message || 'Failed to apply.');
    } finally {
      setApplying(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!myAppId) return;
    setApplying(true);
    try {
      const response = await api.delete(`/applications/${myAppId}/`);
      if (!response.ok) {
        throw new Error('Failed to cancel application.');
      }
      setApplied(false);
      setApplicationStatus(null);
      setMyAppId(null);
      setIsCancelModalOpen(false);
      setJob((prev: any) => ({
        ...prev,
        applicants: Math.max(0, (prev.applicants || 1) - 1),
      }));
    } catch (err: any) {
      setApplyError(err.message || 'Could not cancel application.');
    } finally {
      setApplying(false);
    }
  };

  const getScheduleSummary = () => {
    if (!job || !job.schedules || job.schedules.length === 0) {
      return { dates: 'No dates set', totalHours: '0.0', hoursRange: 'Flexible' };
    }
    try {
      const totalHours = job.schedules.reduce((acc: number, shift: any) => {
        const start = new Date(`1970-01-01T${shift.start_time}`);
        const end = new Date(`1970-01-01T${shift.end_time}`);
        const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        return acc + (isNaN(diff) ? 0 : diff);
      }, 0);

      const sorted = job.schedules
        .map((s: any) => new Date(s.date))
        .filter((d: Date) => !isNaN(d.getTime()))
        .sort((a: any, b: any) => a - b);

      if (sorted.length === 0) {
        return { dates: 'Flexible', totalHours: totalHours.toFixed(1), hoursRange: 'Flexible' };
      }

      const startDate = sorted[0].toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      const endDate = sorted[sorted.length - 1].toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      return {
        dates: sorted.length === 1 ? startDate : `${startDate} - ${endDate}`,
        totalHours: totalHours.toFixed(1),
        hoursRange: `${totalHours.toFixed(1)} Hours Total`,
      };
    } catch {
      return { dates: 'Flexible', totalHours: '0.0', hoursRange: 'Flexible' };
    }
  };

  const summary = job ? getScheduleSummary() : { dates: 'Loading...', totalHours: '0.0', hoursRange: '...' };

  // Capacity calculations
  const required = job?.required_amount || 0;
  const applicants = job?.applicants || 0;
  const capacityPct = required > 0 ? Math.min(100, Math.round((applicants / required) * 100)) : 0;
  const remainingSeats = Math.max(0, required - applicants);

  if (loading) {
    return <LoadingState message="Loading job details..." />;
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <EmptyState
          icon={AlertCircle}
          title="Job listing not found or has been removed."
          actionText="Return to Jobs"
          onAction={() => navigate('/jobs')}
        />
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-72px)] w-full overflow-hidden flex flex-col justify-start">
      <AppBackground />

      <PageTransition>
        <main className="relative z-10 pt-4 sm:pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Main Glassmorphic Container (Stitch Baseline) */}
          <GlassCard variant="container">
            {/* Header: Back navigation, title, badges */}
            <div className="mb-8">
              <JobDetailHeader
                title={job.title}
                status={job.status}
                jobType={job.job_type}
              />
            </div>

            {/* Two-Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* LEFT COLUMN: Main Job Specs, Timelines, Info */}
              <section className="lg:col-span-7 space-y-6">
                <JobQuickSpecs
                  pay={job.pay}
                  dates={summary.dates}
                  location={job.location}
                  hoursRange={summary.hoursRange}
                  applicants={applicants}
                  required={required}
                />

                {/* Work Schedule Timeline Section (Visible to Applicants, Admin, or In-Progress/Completed) */}
                {canSeeSchedule && (
                  <div className="bg-slate-50/80 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200/70 dark:border-slate-700/70">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-psu-navy dark:text-psu-blue" />
                        <h2 className="text-base font-bold text-slate-900 dark:text-white">
                          Work Schedule
                        </h2>
                      </div>
                      {applied && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-psu-navy text-white">
                          Applicant Roster
                        </span>
                      )}
                    </div>

                    <JobScheduleTable schedules={job.schedules} jobStatus={job.status} />
                  </div>
                )}

                {/* Description & PSU Guidelines */}
                <JobDescription description={job.description} />
              </section>

              {/* RIGHT COLUMN: Poster, Meta, Interactive Actions */}
              <aside className="lg:col-span-5 space-y-6">
                <JobApplyCard
                  image={job.image}
                  title={job.title}
                  academicTerm={job.academic_term}
                  academicYear={job.academic_year}
                  organizationName={job.organization_name}
                  required={required}
                  applicants={applicants}
                  capacityPct={capacityPct}
                  remainingSeats={remainingSeats}
                  applied={applied}
                  applicationStatus={applicationStatus}
                  isOpen={job.isOpen}
                  jobStatus={job.status}
                  applying={applying}
                  onApply={handleApply}
                  onCancelClick={() => setIsCancelModalOpen(true)}
                  onImageError={handleImageError}
                  canSeePrivateDetails={canSeePrivateDetails}
                  lineGroupUrl={job.line_group_url}
                />

                {/* Admin Quick Action: Edit Post */}
                {isAdmin() && (
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/jobs/${job.id}/edit`)}
                      className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>Edit Job Posting (Admin)</span>
                    </button>
                  </div>
                )}

                {/* Error Banner */}
                {applyError && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-semibold text-center">
                    {applyError}
                  </div>
                )}
              </aside>
            </div>
          </GlassCard>
        </main>
      </PageTransition>

      {/* Confirmation Modal for Cancellation */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Application"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Are you sure you want to cancel your application for{' '}
            <strong className="text-slate-900 dark:text-white font-bold">{job.title}</strong>? Your allocated slot will be released back to other students.
          </p>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Keep Application
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              disabled={applying}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {applying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              Confirm Withdrawal
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default JobDetail;
