import { useState, useEffect, FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import { AppBackground, GlassCard, LoadingState } from '../components/ui';
import {
  StudentIdentityCard,
  StudentProfileForm,
  ActiveAssignmentsSection,
  WorkHistorySection,
  EvaluationModal,
} from '../components/profile';
import { generatePSUCertificate } from '../utils/certificate';
import { api } from '../utils/api';

export function Profile() {
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

  const handleSave = async (e: FormEvent) => {
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

  if (loading) {
    return <LoadingState message="Loading student profile..." />;
  }

  const avatarInitial =
    profileData?.first_name?.charAt(0).toUpperCase() ||
    user?.username?.charAt(0).toUpperCase() ||
    'P';

  return (
    <div className="relative min-h-[calc(100vh-72px)] w-full overflow-hidden flex flex-col justify-start">
      <AppBackground />

      <PageTransition>
        <main className="relative z-10 pt-4 sm:pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-6 sm:space-y-8">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold text-center">
              {error}
            </div>
          )}

          {/* 1. STUDENT IDENTITY CARD */}
          <GlassCard variant="card" className="relative transition-all duration-300">
            <StudentIdentityCard
              profileData={profileData}
              userEmail={user?.email}
              avatarInitial={avatarInitial}
              isEditing={isEditing}
              onToggleEdit={() => setIsEditing(!isEditing)}
            />

            {/* Inline Edit Form */}
            <AnimatePresence>
              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800"
                >
                  <StudentProfileForm
                    formData={formData}
                    onChange={setFormData}
                    onSubmit={handleSave}
                    onCancel={() => setIsEditing(false)}
                    saving={saving}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </GlassCard>

          {/* 2. ACTIVE ASSIGNMENTS SECTION */}
          <ActiveAssignmentsSection assignments={activeAssignments} />

          {/* 3. WORK HISTORY & PERFORMANCE SECTION */}
          <WorkHistorySection
            workHistory={workHistory}
            onDownloadCertificate={handleDownloadCertificate}
            onOpenEvaluation={(app) => {
              setSelectedApp(app);
              setIsModalOpen(true);
            }}
          />
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
