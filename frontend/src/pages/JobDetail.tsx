import { useState, useEffect, SyntheticEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Banknote,
  Calendar,
  MapPin,
  Clock,
  Users,
  CheckCircle2,
  Lock,
  Phone,
  Mail,
  AlertCircle,
  ShieldCheck,
  ExternalLink,
  Loader2,
  Award,
  Edit,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import bgImage from '../assets/home-bg-1.jpg';
import placeholder from '../assets/placeholder-image.jpg';
import lineIcon from '../assets/LINE_logo.svg';
import JobScheduleTable from '../components/jobs/JobScheduleTable';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { api } from '../utils/api';

export function JobDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isLoggedIn, isStudent, isAdmin } = useAuth();

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
      if (response.ok) {
        setApplied(false);
        setApplicationStatus(null);
        setMyAppId(null);
        setJob((prev: any) => ({ ...prev, applicants: Math.max(0, (prev.applicants || 0) - 1) }));
        setIsCancelModalOpen(false);
      } else {
        throw new Error('Could not cancel application.');
      }
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

  const formatPay = (payVal: number | string | undefined) => {
    if (payVal === undefined || payVal === null) return '0';
    if (typeof payVal === 'number') return payVal.toLocaleString();
    const num = Number(payVal);
    return isNaN(num) ? payVal : num.toLocaleString();
  };

  // Capacity calculations
  const required = job?.required_amount || 0;
  const applicants = job?.applicants || 0;
  const capacityPct = required > 0 ? Math.min(100, Math.round((applicants / required) * 100)) : 0;
  const remainingSeats = Math.max(0, required - applicants);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-psu-navy dark:text-psu-light font-medium gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-psu-blue" />
        <span className="text-lg">Loading job details...</span>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 gap-4">
        <AlertCircle className="w-12 h-12 text-slate-400" />
        <p className="text-lg font-semibold">Job listing not found or has been removed.</p>
        <button
          onClick={() => navigate('/jobs')}
          className="px-5 py-2.5 rounded-xl bg-psu-navy text-white text-sm font-semibold hover:bg-psu-blue transition-colors"
        >
          Return to Jobs
        </button>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-72px)] w-full overflow-hidden flex flex-col justify-start">
      {/* Authentic PSU Campus Backdrop with Blur */}
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

      <PageTransition>
        <main className="relative z-10 pt-4 sm:pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {/* Back Navigation Breadcrumb Link */}
          <div className="mb-4 sm:mb-5 flex items-center justify-between">
            <button
              onClick={() => navigate('/jobs')}
              className="inline-flex items-center text-white/90 hover:text-white font-semibold text-sm transition-all group bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" />
              Back to Jobs
            </button>
          </div>

          {/* Main Glassmorphic Container (Stitch Baseline) */}
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/60 dark:border-slate-800">
            {/* Two-Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
              {/* ============================================== */}
              {/* LEFT COLUMN: Main Job Specs, Timelines, Info   */}
              {/* ============================================== */}
              <section className="lg:col-span-7 space-y-6">
                {/* Header & Title Area */}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge status={job.status} />
                    {job.job_type && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {job.job_type === 'INTERNAL' ? 'Campus Internal' : 'External Partner'}
                      </span>
                    )}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {job.title}
                  </h1>
                </div>

                {/* Quick Specs Info Grid Card */}
                <div className="bg-slate-50/80 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6 text-sm">
                    {/* Pay Rate */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-100 dark:border-emerald-800/40">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-[11px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                          PAY RATE
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-base">
                          ฿{formatPay(job.pay)}
                        </span>
                      </div>
                    </div>

                    {/* Working Dates */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-psu-blue dark:text-blue-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-blue-100 dark:border-blue-800/40">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-[11px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                          DATES
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-base">
                          {summary.dates}
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-500 dark:text-rose-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-rose-100 dark:border-rose-800/40">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-[11px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                          LOCATION
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {job.location}
                        </span>
                      </div>
                    </div>

                    {/* Working Shift Time */}
                    <div className="flex items-start gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-500 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-indigo-100 dark:border-indigo-800/40">
                        <Clock className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-[11px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                          WORKING HOURS
                        </span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {summary.hoursRange}
                        </span>
                      </div>
                    </div>

                    {/* Vacancies / Seats */}
                    <div className="flex items-start gap-3.5 sm:col-span-2 pt-3 border-t border-slate-200/80 dark:border-slate-700/80">
                      <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-100 dark:border-amber-800/40">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="block text-[11px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                          CAPACITY & VACANCIES
                        </span>
                        <span className="font-bold text-slate-900 dark:text-white text-sm">
                          {applicants} / {required || 'Unlimited'} Seats Required
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Schedule Timeline Section */}
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
                        Applicant
                      </span>
                    )}
                  </div>

                  <JobScheduleTable schedules={job.schedules} />
                </div>

                {/* Official LINE Group Chat Card (Unlocked when applied or admin) */}
                {canSeePrivateDetails && job.line_group_url && (
                  <div className="bg-emerald-50/60 dark:bg-emerald-950/30 rounded-2xl p-5 sm:p-6 shadow-sm border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-center gap-5">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-emerald-100 dark:border-emerald-800 flex-shrink-0 flex items-center justify-center">
                      <img src={lineIcon} alt="LINE Official" className="w-16 h-16 object-contain" />
                    </div>
                    <div className="flex-grow text-center sm:text-left space-y-2">
                      <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                        Official Operations Group
                      </span>
                      <h3 className="font-bold text-slate-900 dark:text-white text-base">
                        Connect with Coordinators & Peers
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Join the official group chat for shift announcements, venue coordination, and real-time updates.
                      </p>
                      <a
                        href={job.line_group_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-[#06c755] hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-[0.98]"
                      >
                        Join LINE Group
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Job Description Block */}
                <div className="bg-slate-50/80 dark:bg-slate-800/60 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-4">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-psu-navy dark:text-psu-blue" />
                    <span>Job Description</span>
                  </h2>
                  <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {job.description || 'No detailed description provided.'}
                  </div>

                  {/* Standard PSU Qualifications Checklist */}
                  <div className="pt-3 border-t border-slate-200/70 dark:border-slate-700/70">
                    <h3 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider mb-2.5">
                      Qualifications & Guidelines
                    </h3>
                    <ul className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>Enrolled Prince of Songkla University student in good standing.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>Punctual, accountable, and adheres to university conduct policies.</span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>Certified activity transcript hours awarded upon completion.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* ============================================== */}
              {/* RIGHT COLUMN: Poster, Meta, Interactive Actions */}
              {/* ============================================== */}
              <aside className="lg:col-span-5 space-y-6">
                <div className="bg-slate-50/80 dark:bg-slate-800/60 backdrop-blur-md rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-700/80 space-y-6">
                  {/* Job Thumbnail Image Container in 16:9 Aspect Ratio */}
                  <div className="overflow-hidden rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700/60 bg-slate-900 group">
                    <img
                      src={job.image}
                      alt={job.title}
                      onError={handleImageError}
                      className="aspect-video w-full object-cover transform group-hover:scale-105 transition duration-300"
                    />
                  </div>

                  {/* Meta Information */}
                  <div className="space-y-3 text-xs sm:text-sm border-b border-slate-200/80 dark:border-slate-700/80 pb-5">
                    <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                      <span className="font-medium">Academic Term:</span>
                      <span className="font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-600">
                        {job.academic_term ? `${job.academic_term}/${job.academic_year || ''}` : 'Current Term'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 dark:text-slate-500 block text-[10px] uppercase font-bold tracking-wider">
                        POSTED BY:
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight block mt-0.5">
                        {job.organization_name || 'Prince of Songkla University'}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 block mt-0.5">
                        PSU Phuket Campus
                      </span>
                    </div>
                  </div>

                  {/* Live Applicant Counter & Progress Bar */}
                  {required > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-end">
                        <span className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                          Applicant Capacity
                        </span>
                        <span className="text-base font-extrabold text-psu-navy dark:text-psu-light">
                          {applicants} / {required} Seats
                        </span>
                      </div>

                      {/* Progress Bar Track */}
                      <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5">
                        <div
                          className="h-full bg-gradient-to-r from-psu-blue to-psu-navy rounded-full transition-all duration-500"
                          style={{ width: `${capacityPct}%` }}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{capacityPct}% Filled</span>
                        <span className={remainingSeats === 0 ? 'text-rose-500 font-bold' : 'font-medium'}>
                          {remainingSeats === 0 ? 'Full (Registration Closed)' : `${remainingSeats} seats remaining`}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Action Buttons Block (Lifecycle States) */}
                  <div className="space-y-3 pt-2">
                    {/* STATE 1: Before Applying (Open) */}
                    {!applied && job.isOpen && (
                      <div className="space-y-3">
                        <button
                          onClick={handleApply}
                          disabled={applying}
                          className="w-full py-3.5 px-4 bg-psu-navy hover:bg-psu-blue text-white font-bold text-base rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-75"
                        >
                          {applying ? (
                            <>
                              <Loader2 className="w-5 h-5 animate-spin" />
                              <span>Submitting Application...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-5 h-5" />
                              <span>Apply Now</span>
                            </>
                          )}
                        </button>
                        <p className="text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                          <span>Authenticated via PSU Passport student credentials</span>
                        </p>
                      </div>
                    )}

                    {/* STATE 2: Applied & OPEN (Cancel Available) */}
                    {applied && job.isOpen && (
                      <div className="space-y-3">
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-center">
                          <span className="text-emerald-700 dark:text-emerald-300 font-bold text-sm flex items-center justify-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            You have applied for this position
                          </span>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
                            Status: {applicationStatus || 'Approved'}
                          </p>
                        </div>

                        <button
                          onClick={() => setIsCancelModalOpen(true)}
                          disabled={applying}
                          className="w-full py-3.5 px-4 bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white font-bold text-base rounded-xl shadow-md transition duration-200 flex items-center justify-center gap-2 disabled:opacity-75"
                        >
                          <AlertCircle className="w-5 h-5" />
                          <span>Cancel Application</span>
                        </button>
                        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                          Registration is currently open. You may withdraw your application anytime.
                        </p>
                      </div>
                    )}

                    {/* STATE 3: Applied & CLOSED / IN_PROGRESS (Locked) */}
                    {applied && !job.isOpen && job.status !== 'COMPLETED' && (
                      <div className="space-y-3">
                        <button
                          disabled
                          className="w-full py-3.5 px-4 bg-slate-500 text-white font-bold text-base rounded-xl cursor-not-allowed shadow-none flex items-center justify-center gap-2 opacity-90"
                        >
                          <Lock className="w-5 h-5 text-slate-300" />
                          <span>Applied (Roster Finalized)</span>
                        </button>

                        <div className="bg-amber-50 dark:bg-amber-950/40 rounded-xl p-3.5 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 space-y-1.5">
                          <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                            <span>To withdraw, please contact staff directly:</span>
                          </div>
                          <p className="leading-relaxed">
                            Registration is closed and shift assignments are locked. Reach out to Student Affairs:
                          </p>
                          <div className="pt-1 font-semibold text-psu-navy dark:text-psu-light flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-psu-navy dark:text-psu-blue" />
                              <span>Tel: 076-276000 ext. 6012-6014</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5 text-psu-navy dark:text-psu-blue" />
                              <span>Email: student-affairs@phuket.psu.ac.th</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STATE 4: Applied & COMPLETED */}
                    {applied && job.status === 'COMPLETED' && (
                      <div className="space-y-3">
                        <button
                          disabled
                          className="w-full py-3.5 px-4 bg-blue-600 text-white font-bold text-base rounded-xl cursor-not-allowed shadow-none flex items-center justify-center gap-2"
                        >
                          <Award className="w-5 h-5 text-white" />
                          <span>Completed</span>
                        </button>
                        <div className="bg-blue-50 dark:bg-blue-950/40 rounded-xl p-3 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-200 leading-relaxed text-center flex items-center justify-center gap-1.5">
                          <span>Thank you for participating! Your certified activity hours have been recorded.</span>
                        </div>
                      </div>
                    )}

                    {/* Closed Job & Not Applied */}
                    {!applied && !job.isOpen && (
                      <div className="space-y-3">
                        <button
                          disabled
                          className="w-full py-3.5 px-4 bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold text-base rounded-xl cursor-not-allowed shadow-none flex items-center justify-center gap-2"
                        >
                          <Lock className="w-5 h-5" />
                          <span>Registration Closed</span>
                        </button>
                        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
                          This job is no longer accepting new student applications.
                        </p>
                      </div>
                    )}

                    {/* ADMIN ACTION: Edit Post */}
                    {isAdmin() && (
                      <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                        <button
                          onClick={() => navigate(`/admin/jobs/${job.id}/edit`)}
                          className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          <span>Edit Job Posting (Admin)</span>
                        </button>
                      </div>
                    )}

                    {/* Error display */}
                    {applyError && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-600 dark:text-rose-400 text-xs font-semibold text-center">
                        {applyError}
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            </div>
          </div>
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
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Keep Application
            </button>
            <button
              type="button"
              onClick={handleConfirmCancel}
              disabled={applying}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors flex items-center gap-1.5"
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
