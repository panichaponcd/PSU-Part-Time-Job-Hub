import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';
import bgImage from '../assets/home-bg-1.jpg';
import EvaluationModal from '../components/profile/EvaluationModal';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

import { api } from '../utils/api';

function Profile() {
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

      // 3. Process Active Assignments
      const activeList = appsList.filter((a: any) => (a.status === 'APPROVED' || a.status === 'PENDING') && !a.evaluation);
      const activeJobsData = await Promise.all(
        activeList.map(async (app: any) => {
          const jobRes = await api.get(`/jobs/${app.job}/`);
          const jobData = await jobRes.json();
          return { ...jobData, status: app.status, applicationId: app.id };
        })
      );
      setActiveAssignments(
        activeJobsData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      );

      // 4. Process Work History
      const historyList = appsList.filter((a: any) => Boolean(a.evaluation));
      const historyJobsData = await Promise.all(
        historyList.map(async (app: any) => {
          const jobRes = await api.get(`/jobs/${app.job}/`);
          const jobData = await jobRes.json();
          return { ...app, job_poster_url: jobData.poster_image_url, created_at: jobData.created_at };
        })
      );
      setWorkHistory(
        historyJobsData.sort((a, b) => new Date(b.application_date).getTime() - new Date(a.application_date).getTime())
      );

      setLoading(false);
    } catch (err) {
      console.error('Error fetching professional profile:', err);
      setLoading(false);
    }
  };

  const handleSave = async () => {
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

      if (formData.student_card_file) {
        bodyData.append('student_card_image', formData.student_card_file);
      }

      const res = await api.patch(`/students/${profileData.id}/`, bodyData);

      if (res.ok) {
        const updated = await res.json();
        setProfileData(updated);
        setIsEditing(false);
      } else {
        const errData = await res.json();
        setError(JSON.stringify(errData));
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white font-medium">
        <p>Loading professional profile...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-0 scale-110 blur-[6px]"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="fixed inset-0 bg-black/30 z-10" />

      <PageTransition>
        <div className="relative z-20 pt-24 pb-16 px-4 md:px-8 max-w-6xl mx-auto space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-bold text-center">
              {error}
            </div>
          )}
          {/* Header Card */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-xl border border-white/60 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-psu-blue text-white font-black text-4xl flex items-center justify-center shadow-lg border-4 border-white">
                {student?.first_name?.charAt(0).toUpperCase() || user?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  {profileData?.first_name} {profileData?.last_name}
                </h1>
                <p className="text-sm font-semibold text-psu-blue mt-1">
                  ID: {profileData?.student_id} • {profileData?.faculty}
                </p>
                <p className="text-xs text-gray-500 font-medium">{profileData?.major}</p>
              </div>
            </div>

            <Button
              variant={isEditing ? 'outline' : 'primary'}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel Editing' : '✏️ Edit Profile'}
            </Button>
          </div>

          {/* Edit Profile Form */}
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-xl border border-white/60 space-y-6"
            >
              <h2 className="text-lg font-bold text-gray-800">Edit Professional Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  value={formData.first_name || ''}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                />
                <Input
                  label="Last Name"
                  value={formData.last_name || ''}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                />
                <Input
                  label="Faculty"
                  value={formData.faculty || ''}
                  onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
                />
                <Input
                  label="Major"
                  value={formData.major || ''}
                  onChange={(e) => setFormData({ ...formData, major: e.target.value })}
                />
                <Input
                  label="Religion"
                  value={formData.religion || ''}
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                />
                <Input
                  label="Allergies / Special Conditions"
                  value={formData.allergies || ''}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button variant="primary" isLoading={saving} onClick={handleSave}>
                  Save Changes
                </Button>
              </div>
            </motion.div>
          )}

          {/* Active Assignments */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-xl border border-white/60 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              ⚡ Active Assignments ({activeAssignments.length})
            </h2>
            {activeAssignments.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No active job assignments currently.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeAssignments.map((job) => (
                  <div
                    key={job.id}
                    onClick={() => navigate(`/jobs/${job.id}`)}
                    className="bg-white/80 p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold text-gray-800 text-md">{job.title}</h3>
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        💵 ฿{job.compensation_amount} • 📍 {job.location_type}
                      </p>
                    </div>
                    <Badge status={job.status} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Work History */}
          <div className="bg-white/70 backdrop-blur-lg rounded-3xl p-6 md:p-8 shadow-xl border border-white/60 space-y-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              📜 Work History & Performance ({workHistory.length})
            </h2>
            {workHistory.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No completed work evaluations on record.</p>
            ) : (
              <div className="space-y-3">
                {workHistory.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white/80 p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-bold text-gray-800 text-md">{app.job_title || 'Completed Job'}</h3>
                      <p className="text-xs text-gray-500 font-medium">
                        Applied: {new Date(app.application_date).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedApp(app);
                        setIsModalOpen(true);
                      }}
                    >
                      View Evaluation Sheet ⭐
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </PageTransition>

      <EvaluationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedApp={selectedApp}
      />
    </div>
  );
}

export default Profile;
