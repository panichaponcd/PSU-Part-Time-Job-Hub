import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import apiRequest from '../../utils/api';
import {
  JobFormBreadcrumb,
  JobFormHeader,
  JobBasicInfoSection,
  JobClassificationSection,
  JobDescriptionSection,
  JobMediaSection,
  JobScheduleSection,
  JobFormActions,
  ScheduleItem,
} from '../../components/admin/job-form';
import { JobDeleteModal } from '../../components/admin/jobs/JobDeleteModal';

interface JobFormData {
  title: string;
  organization_name: string;
  description: string;
  location_type: string;
  job_type: string;
  compensation_amount: string | number;
  required_amount: string | number;
  status: string;
  academic_term: number;
  academic_year: number;
  poster_image_url: string;
  line_group_url: string;
  schedules: ScheduleItem[];
  applicants_count?: number;
}

const emptyForm: JobFormData = {
  title: '',
  organization_name: '',
  description: '',
  location_type: '',
  job_type: 'EXTERNAL',
  compensation_amount: '',
  required_amount: '',
  status: 'OPEN',
  academic_term: 2,
  academic_year: 2569,
  poster_image_url: '',
  line_group_url: '',
  schedules: [],
};

export function AdminJobForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { refreshAccessToken } = useAuth();
  const isEditing = Boolean(id);

  const [form, setForm] = useState<JobFormData>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch job details in Edit mode
  useEffect(() => {
    if (isEditing && id) {
      setLoading(true);
      apiRequest(`/jobs/${id}/`)
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to load job: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setForm({
            ...data,
            compensation_amount: data.compensation_amount ?? '',
            required_amount: data.required_amount ?? '',
            academic_term: data.academic_term ?? 2,
            academic_year: data.academic_year ?? 2569,
            schedules: (data.schedules || []).map((s: any) => ({
              id: s.id,
              date: s.date || '',
              start_time: s.start_time ? s.start_time.slice(0, 5) : '09:00',
              end_time: s.end_time ? s.end_time.slice(0, 5) : '12:00',
            })),
          });
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id, isEditing]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let formattedValue: any = value;

    if (type === 'number' || name.includes('academic')) {
      formattedValue = value === '' ? '' : parseInt(value, 10);
    }

    setForm((prev) => ({ ...prev, [name]: formattedValue }));
    if (success) setSuccess(false);
    if (error) setError(null);
  };

  const handleSelectChange = (field: keyof JobFormData, val: string | number) => {
    setForm((prev) => ({ ...prev, [field]: val }));
    if (success) setSuccess(false);
    if (error) setError(null);
  };

  // Schedule management
  const addSchedule = () => {
    setForm((prev) => ({
      ...prev,
      schedules: [
        ...prev.schedules,
        { date: '', start_time: '09:00', end_time: '12:00' },
      ],
    }));
  };

  const removeSchedule = (index: number) => {
    setForm((prev) => ({
      ...prev,
      schedules: prev.schedules.filter((_, i) => i !== index),
    }));
  };

  const handleScheduleChange = (index: number, field: keyof ScheduleItem, value: string) => {
    setForm((prev) => {
      const newSchedules = [...prev.schedules];
      newSchedules[index] = { ...newSchedules[index], [field]: value };
      return { ...prev, schedules: newSchedules };
    });
  };

  // Submit handler
  const handleSubmit = async (overrideStatus?: string) => {
    // Validation
    if (!form.title.trim()) {
      setError('Please provide a job title.');
      return;
    }
    if (!form.organization_name.trim()) {
      setError('Please provide an organization or department name.');
      return;
    }
    if (!form.location_type.trim()) {
      setError('Please provide a work location or room.');
      return;
    }
    if (!form.compensation_amount || Number(form.compensation_amount) <= 0) {
      setError('Please enter a valid pay rate (THB).');
      return;
    }
    if (!form.required_amount || Number(form.required_amount) <= 0) {
      setError('Please enter at least 1 vacancy.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    const payload = {
      ...form,
      status: overrideStatus || form.status,
      compensation_amount: Number(form.compensation_amount),
      required_amount: Number(form.required_amount),
    };

    try {
      const url = isEditing ? `/jobs/${id}/` : `/jobs/`;
      let response = await apiRequest(url, {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          response = await apiRequest(url, {
            method: isEditing ? 'PUT' : 'POST',
            body: JSON.stringify(payload),
          });
        }
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(
          errData
            ? typeof errData === 'object'
              ? Object.entries(errData)
                  .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
                  .join(' | ')
              : String(errData)
            : `Server returned HTTP ${response.status}`
        );
      }

      setSuccess(true);
      setTimeout(() => navigate('/admin/jobs'), 1200);
    } catch (err: any) {
      setError(err.message || 'An error occurred while saving the job listing.');
    } finally {
      setSaving(false);
    }
  };

  // Soft delete handler
  const handleDeleteConfirm = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      let response = await apiRequest(`/jobs/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: false, status: 'CLOSED' }),
      });

      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          response = await apiRequest(`/jobs/${id}/`, {
            method: 'PATCH',
            body: JSON.stringify({ is_active: false, status: 'CLOSED' }),
          });
        }
      }

      if (!response.ok) {
        throw new Error('Failed to deactivate job');
      }

      setShowDeleteModal(false);
      navigate('/admin/jobs');
    } catch (err: any) {
      setError(err.message || 'Failed to deactivate job.');
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-28 gap-3">
        <Loader2 className="w-8 h-8 text-psu-blue animate-spin" />
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest animate-pulse">
          Loading Job Details...
        </span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5 px-4 sm:px-6 py-6">
      {/* Top Navigation & Quick Actions Breadcrumb */}
      <JobFormBreadcrumb
        isEditing={isEditing}
        jobTitle={form.title}
        jobId={id}
        applicantsCount={form.applicants_count || 0}
        requiredAmount={Number(form.required_amount) || 0}
        onDelete={() => setShowDeleteModal(true)}
      />

      {/* Main Glass Form Container */}
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60 dark:border-slate-800 space-y-6"
      >
        {/* Header Strip with Title & Dynamic Status Badge */}
        <JobFormHeader
          isEditing={isEditing}
          status={form.status}
          jobId={id}
          academicYear={form.academic_year}
        />

        {/* Feedback Alerts */}
        {success && (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold shadow-2xs">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>Job listing saved successfully! Redirecting to Job Management...</span>
          </div>
        )}

        {error && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-4 rounded-2xl flex items-center gap-3 text-xs sm:text-sm font-bold shadow-2xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 dark:text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Section 1: Basic Identifiers */}
        <JobBasicInfoSection
          title={form.title}
          organizationName={form.organization_name}
          locationType={form.location_type}
          onChange={handleChange}
        />

        {/* Section 2: Compensation, Capacity & Academic Classification */}
        <JobClassificationSection
          jobType={form.job_type}
          onJobTypeChange={(val) => handleSelectChange('job_type', val)}
          compensationAmount={form.compensation_amount}
          requiredAmount={form.required_amount}
          status={form.status}
          onStatusChange={(val) => handleSelectChange('status', val)}
          academicTerm={form.academic_term}
          onTermChange={(val) => handleSelectChange('academic_term', Number(val))}
          academicYear={form.academic_year}
          onChange={handleChange}
        />

        {/* Section 3: Job Description & Candidate Requirements */}
        <JobDescriptionSection
          description={form.description}
          onChange={handleChange}
        />

        {/* Section 4: URLs & Social Coordinators */}
        <JobMediaSection
          posterImageUrl={form.poster_image_url}
          lineGroupUrl={form.line_group_url}
          onChange={handleChange}
        />

        {/* Section 5: Work Schedule Shifts Dynamic Manager */}
        <JobScheduleSection
          schedules={form.schedules}
          onAddSchedule={addSchedule}
          onRemoveSchedule={removeSchedule}
          onScheduleChange={handleScheduleChange}
        />

        {/* Section 6: Action Footer Bar */}
        <JobFormActions
          isEditing={isEditing}
          saving={saving}
          onCancel={() => navigate('/admin/jobs')}
          onSaveDraft={() => handleSubmit('CLOSED')}
          onSubmit={() => handleSubmit()}
        />
      </form>

      {/* Delete Confirmation Modal */}
      {isEditing && (
        <JobDeleteModal
          jobId={showDeleteModal && id ? Number(id) : null}
          jobTitle={form.title}
          isDeleting={deleting}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}

export default AdminJobForm;
