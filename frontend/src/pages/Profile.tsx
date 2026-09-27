import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  GraduationCap,
  BookOpen,
  AlertCircle,
  Pencil,
  X,
  Briefcase,
  Award,
  Star,
  Download,
  Banknote,
  MapPin,
  ArrowRight,
  Loader2,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import bgImage from '../assets/home-bg-1.jpg';
import EvaluationModal from '../components/profile/EvaluationModal';
import Badge from '../components/ui/Badge';
import { generatePSUCertificate } from '../utils/certificate';
import { api } from '../utils/api';

export function Profile() {
  const navigate = useNavigate();
  const { student, user } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [activeAssignments, setActiveAssignments] = useState<any[]>([]);
  const [workHistory, setWorkHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // 1. Fetch Student Profile
      const res = await api.get(`/students/?student_id=${student?.student_id}`);
      const data = await res.json();
      const profile = Array.isArray(data) ? data[0] : data;
      setProfileData(profile);
      setFormData(profile);

      // 2. Fetch Applications
      const appRes = await api.get('/applications/');
      const apps = await appRes.json();
      const appsList = Array.isArray(apps) ? apps : apps.results || [];

      // 3. Process Active Assignments (Approved or Pending, without evaluation)
      const activeList = appsList.filter(
        (a: any) => (a.status === 'APPROVED' || a.status === 'PENDING') && !a.evaluation
      );
      const activeJobsData = await Promise.all(
        activeList.map(async (app: any) => {
          try {
            const jobRes = await api.get(`/jobs/${app.job}/`);
            const jobData = await jobRes.json();
            return {
              ...jobData,
              applicationStatus: app.status,
              applicationId: app.id,
              applicationDate: app.application_date,
            };
          } catch {
            return {
              id: app.job,
              title: app.job_title || 'Campus Assignment',
              applicationStatus: app.status,
              applicationId: app.id,
              applicationDate: app.application_date,
            };
          }
        })
      );

      setActiveAssignments(
        activeJobsData.sort(
          (a, b) => new Date(b.created_at || b.applicationDate).getTime() - new Date(a.created_at || a.applicationDate).getTime()
        )
      );

      // 4. Process Work History (Applications with completed evaluation)
      const historyList = appsList.filter((a: any) => Boolean(a.evaluation));
      const historyJobsData = await Promise.all(
        historyList.map(async (app: any) => {
          try {
            const jobRes = await api.get(`/jobs/${app.job}/`);
            const jobData = await jobRes.json();
            return {
              ...app,
              job_poster_url: jobData.poster_image_url,
              created_at: jobData.created_at,
              organization_name: jobData.organization_name,
            };
          } catch {
            return app;
          }
        })
      );

      setWorkHistory(
        historyJobsData.sort(
          (a, b) => new Date(b.application_date).getTime() - new Date(a.application_date).getTime()
        )
      );

      setLoading(false);
    } catch (err) {
      console.error('Error fetching student profile:', err);
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const bodyData = new FormData();
      bodyData.append('first_name', formData.first_name || '');
      bodyData.append('last_name', formData.last_name || '');
      bodyData.append('faculty', formData.faculty || '');
      bodyData.append('major', formData.major || '');
      bodyData.append('religion', formData.religion || '');
      bodyData.append('allergies', formData.allergies || '');

      const res = await api.patch(`/students/${profileData.id}/`, bodyData);

      if (res.ok) {
        const updated = await res.json();
        setProfileData(updated);
        setIsEditing(false);
      } else {
        const errData = await res.json();
        setError(JSON.stringify(errData) || 'Failed to update profile.');
      }
    } catch (err: any) {
      setError(err.message || 'Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadCertificate = (app: any) => {
    if (!profileData || !app || !app.evaluation) return;

    const evalData = app.evaluation;
    const avgScore = (
      ((evalData.punctuality_rating || 0) +
        (evalData.responsibility_rating || 0) +
        (evalData.quality_rating || 0) +
        (evalData.grooming_rating || 0)) /
      4
    ).toFixed(1);

    generatePSUCertificate({
      studentName: `${profileData.first_name} ${profileData.last_name}`,
      studentId: profileData.student_id,
      faculty: profileData.faculty,
      jobTitle: app.job_title || 'Campus Assignment',
      score: avgScore,
      resultStatus: evalData.result_status || 'PASS',
      completionDate: evalData.evaluation_date
        ? new Date(evalData.evaluation_date).toLocaleDateString('en-GB')
        : undefined,
    });
  };

  const formatPay = (payVal: number | string | undefined) => {
    if (payVal === undefined || payVal === null) return '0';
    if (typeof payVal === 'number') return payVal.toLocaleString();
    const num = Number(payVal);
    return isNaN(num) ? payVal : num.toLocaleString();
  };

  const formatDisplayDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-psu-navy dark:text-psu-light font-medium gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-psu-blue" />
        <span className="text-lg">Loading student profile...</span>
      </div>
    );
  }

  const avatarInitial =
    profileData?.first_name?.charAt(0).toUpperCase() ||
    user?.username?.charAt(0).toUpperCase() ||
    'P';

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
      <div className="fixed inset-0 bg-slate-950/45 dark:bg-slate-950/75 z-0 pointer-events-none" />

      <PageTransition>
        <main className="relative z-10 pt-4 sm:pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6 sm:space-y-8">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-center">
              {error}
            </div>
          )}

          {/* ========================================================================= */}
          {/* 1. STUDENT IDENTITY CARD (Stitch Baseline)                                */}
          {/* ========================================================================= */}
          <section className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60 dark:border-slate-800 relative transition-all duration-300">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Identity Left */}
              <div className="flex items-center gap-5">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-psu-navy to-slate-900 dark:from-psu-blue dark:to-psu-navy text-white flex items-center justify-center text-3xl font-extrabold shadow-md border-2 border-white/80 dark:border-slate-700">
                    {avatarInitial}
                  </div>
                  <span
                    className="absolute -bottom-1 -right-1 bg-emerald-500 border-2 border-white dark:border-slate-900 w-4 h-4 rounded-full shadow-sm"
                    title="Active Student Status"
                  />
                </div>

                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight mb-1">
                    {profileData?.first_name} {profileData?.last_name}
                  </h1>
                  <p className="text-sm font-semibold text-psu-navy dark:text-psu-light">
                    Student ID: {profileData?.student_id} • {profileData?.faculty}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {profileData?.major} • Prince of Songkla University, Phuket Campus
                  </p>
                </div>
              </div>

              {/* Action Button Right */}
              <div className="flex md:self-start items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200 active:scale-[0.98] ${
                    isEditing
                      ? 'bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-100'
                      : 'bg-psu-navy hover:bg-psu-blue text-white'
                  }`}
                >
                  {isEditing ? (
                    <>
                      <X className="w-4 h-4" />
                      <span>Cancel Editing</span>
                    </>
                  ) : (
                    <>
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Read-Only 4-Card Metadata Grid (When not editing) */}
            {!isEditing && (
              <div className="mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                {/* Email */}
                <div className="bg-white/80 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <Mail className="w-3.5 h-3.5 text-psu-blue" />
                    <span>Student Email</span>
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm truncate" title={user?.email}>
                    {user?.email || 'N/A'}
                  </div>
                </div>

                {/* Faculty & Major */}
                <div className="bg-white/80 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-psu-blue" />
                    <span>Academic Unit</span>
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm truncate" title={profileData?.faculty}>
                    {profileData?.faculty || 'PSU Phuket'}
                  </div>
                </div>

                {/* Religion */}
                <div className="bg-white/80 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-psu-blue" />
                    <span>Personal Belief</span>
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm truncate">
                    {profileData?.religion || 'Not specified'}
                  </div>
                </div>

                {/* Allergies / Medical */}
                <div className="bg-white/80 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-xs flex flex-col justify-between">
                  <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                    <span>Diet & Allergies</span>
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-100 text-xs sm:text-sm truncate" title={profileData?.allergies}>
                    {profileData?.allergies || 'None recorded'}
                  </div>
                </div>
              </div>
            )}

            {/* Inline Edit Form (When editing) */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800"
                >
                  <form onSubmit={handleSave} className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <Pencil className="w-4 h-4 text-psu-blue" />
                        <span>Edit Student Information</span>
                      </h3>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">
                        Synchronized with PSU student profile
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1.5">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.first_name || ''}
                          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-psu-navy focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1.5">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.last_name || ''}
                          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-psu-navy focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1.5">
                          Faculty
                        </label>
                        <input
                          type="text"
                          value={formData.faculty || ''}
                          onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-psu-navy focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1.5">
                          Major / Specialization
                        </label>
                        <input
                          type="text"
                          value={formData.major || ''}
                          onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                          className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-psu-navy focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1.5">
                          Religion
                        </label>
                        <input
                          type="text"
                          value={formData.religion || ''}
                          onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                          placeholder="e.g. Buddhism, Islam, Christianity, etc."
                          className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-psu-navy focus:outline-none transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase mb-1.5">
                          Diet & Allergies / Special Conditions
                        </label>
                        <input
                          type="text"
                          value={formData.allergies || ''}
                          onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                          placeholder="e.g. Halal, Vegetarian, Peanut allergy, etc."
                          className="w-full px-3.5 py-2.5 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 focus:ring-2 focus:ring-psu-navy focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 text-xs font-bold text-white bg-psu-navy hover:bg-psu-blue rounded-xl shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-75"
                      >
                        {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                        <span>Save Changes</span>
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* ========================================================================= */}
          {/* 2. ACTIVE ASSIGNMENTS SECTION                                             */}
          {/* ========================================================================= */}
          <section className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
                  <Briefcase className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Active Assignments{' '}
                  <span className="text-slate-400 font-normal">({activeAssignments.length})</span>
                </h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline-block">
                Enrolled Jobs & Shifts
              </span>
            </div>

            {activeAssignments.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 space-y-3">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  You do not have any active campus job assignments right now.
                </p>
                <Link
                  to="/jobs"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-psu-navy hover:bg-psu-blue transition-colors shadow-sm"
                >
                  <span>Browse Available Jobs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeAssignments.map((job) => (
                  <div
                    key={job.applicationId || job.id}
                    className="bg-white/80 dark:bg-slate-800/60 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                          {job.title}
                        </h3>
                        <Badge status={job.applicationStatus || job.status || 'APPROVED'} />
                      </div>

                      {job.organization_name && (
                        <p className="text-xs font-semibold text-psu-navy dark:text-psu-light mb-3">
                          {job.organization_name}
                        </p>
                      )}

                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                        {job.compensation_amount && (
                          <div className="flex items-center gap-2">
                            <Banknote className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                            <span className="font-bold text-emerald-700 dark:text-emerald-400">
                              ฿{formatPay(job.compensation_amount)}
                            </span>
                          </div>
                        )}

                        {job.location_type && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{job.location_type}</span>
                          </div>
                        )}

                        {job.applicationDate && (
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <Calendar className="w-3.5 h-3.5 shrink-0" />
                            <span>Enrolled: {formatDisplayDate(job.applicationDate)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-end">
                      <button
                        type="button"
                        onClick={() => navigate(`/jobs/${job.id}`)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-psu-navy hover:bg-psu-blue rounded-xl transition-all shadow-xs"
                      >
                        <span>View Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ========================================================================= */}
          {/* 3. WORK HISTORY & PERFORMANCE SECTION (Stitch Baseline)                   */}
          {/* ========================================================================= */}
          <section className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-indigo-100 dark:bg-indigo-950/60 text-psu-navy dark:text-blue-300 rounded-xl">
                  <Award className="w-5 h-5" />
                </span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Work History & Performance{' '}
                  <span className="text-slate-400 font-normal">({workHistory.length})</span>
                </h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline-block">
                Evaluated by PSU Supervisors
              </span>
            </div>

            {workHistory.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  No completed work evaluations on record yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3.5">
                {workHistory.map((app) => {
                  const evalData = app.evaluation;
                  const isPass = evalData?.result_status === 'PASS';

                  return (
                    <div
                      key={app.id}
                      className="bg-white/80 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-slate-900 dark:text-white text-base">
                            {app.job_title || 'Completed Job'}
                          </h3>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                            Completed
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Applied: {formatDisplayDate(app.application_date)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Download Certificate Button (Real jsPDF generator) */}
                        {isPass && (
                          <button
                            type="button"
                            onClick={() => handleDownloadCertificate(app)}
                            title="Download Certificate"
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-psu-navy hover:bg-psu-blue rounded-xl shadow-xs transition-all cursor-pointer active:scale-[0.98]"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Certificate</span>
                          </button>
                        )}

                        {/* View Evaluation Sheet Button */}
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedApp(app);
                            setIsModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-psu-navy dark:hover:text-white bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-300 dark:border-slate-600 rounded-xl shadow-2xs transition-all group cursor-pointer"
                        >
                          <span>View Evaluation Sheet</span>
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
      </PageTransition>

      {/* Performance Evaluation Sheet Modal */}
      <EvaluationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedApp={selectedApp}
      />
    </div>
  );
}

export default Profile;
