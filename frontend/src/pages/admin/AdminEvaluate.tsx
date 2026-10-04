import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import apiRequest from '../../utils/api';
import {
  EvaluateBreadcrumb,
  EvaluateApplicantHeader,
  EvaluateRubricSection,
  EvaluateCommentsSection,
  EvaluateDecisionSection,
  EvaluateActions,
} from '../../components/admin/evaluate';

interface EvaluationFormData {
  punctuality_rating: number;
  responsibility_rating: number;
  grooming_rating: number;
  quality_rating: number;
  comment: string;
  result_status: 'PASS' | 'FAIL';
  id?: number;
  evaluation_date?: string;
}

const DEFAULT_FORM: EvaluationFormData = {
  punctuality_rating: 5,
  responsibility_rating: 5,
  grooming_rating: 5,
  quality_rating: 5,
  comment: '',
  result_status: 'PASS',
};

export function AdminEvaluate() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();

  const [application, setApplication] = useState<any>(null);
  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [form, setForm] = useState<EvaluationFormData>(DEFAULT_FORM);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    fetchEvaluationData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applicationId]);

  const fetchEvaluationData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch application details
      const appRes = await apiRequest(`/applications/${applicationId}/`);
      if (!appRes.ok) throw new Error('Application record not found');
      const appData = await appRes.json();
      setApplication(appData);

      // 2. Fetch parent job details if available
      if (appData.job) {
        try {
          const jobRes = await apiRequest(`/jobs/${appData.job}/`);
          if (jobRes.ok) {
            const jobData = await jobRes.json();
            setJob(jobData);
          }
        } catch {
          // Non-critical if job fails to load
        }
      }

      // 3. Fetch existing evaluation
      const evalRes = await apiRequest(`/evaluations/?application=${applicationId}`);
      if (evalRes.ok) {
        const evalData = await evalRes.json();
        const existing = Array.isArray(evalData) ? evalData[0] : evalData.results?.[0];

        if (existing) {
          setForm({
            punctuality_rating: existing.punctuality_rating ?? 5,
            responsibility_rating: existing.responsibility_rating ?? 5,
            grooming_rating: existing.grooming_rating ?? 5,
            quality_rating: existing.quality_rating ?? 5,
            comment: existing.comment || '',
            result_status: existing.result_status || 'PASS',
            id: existing.id,
            evaluation_date: existing.evaluation_date,
          });
        }
      }
    } catch (err: any) {
      console.error('Error fetching evaluation data:', err);
      setError(err.message || 'Failed to load evaluation sheet');
    } finally {
      setLoading(false);
    }
  };

  // Live average rating calculation
  const averageScore = useMemo(() => {
    const total =
      form.punctuality_rating +
      form.responsibility_rating +
      form.grooming_rating +
      form.quality_rating;
    return (total / 4).toFixed(1);
  }, [form]);

  const handleRubricChange = (
    criteria: 'punctuality' | 'responsibility' | 'grooming' | 'quality',
    val: number
  ) => {
    setForm((prev) => ({
      ...prev,
      [`${criteria}_rating`]: val,
    }));
  };

  const handleDecisionChange = (status: 'PASS' | 'FAIL') => {
    setForm((prev) => ({
      ...prev,
      result_status: status,
    }));
  };

  const handleCommentChange = (comment: string) => {
    setForm((prev) => ({
      ...prev,
      comment,
    }));
  };

  const handleSubmit = async () => {
    setSaving(true);
    const isEditing = Boolean(form.id);

    try {
      const endpoint = isEditing ? `/evaluations/${form.id}/` : '/evaluations/';
      const method = isEditing ? 'PATCH' : 'POST';

      const payload = {
        application: Number(applicationId),
        punctuality_rating: form.punctuality_rating,
        responsibility_rating: form.responsibility_rating,
        grooming_rating: form.grooming_rating,
        quality_rating: form.quality_rating,
        comment: form.comment.trim(),
        result_status: form.result_status,
      };

      const response = await apiRequest(endpoint, {
        method,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.detail || 'Failed to submit evaluation.');
      }

      const savedData = await response.json();
      setForm((prev) => ({
        ...prev,
        id: savedData.id,
        evaluation_date: savedData.evaluation_date || new Date().toISOString(),
      }));

      setToast({
        message: `${application?.student_name || 'Student'}'s evaluation saved successfully!`,
        type: 'success',
      });

      // Navigate back after delay
      setTimeout(() => {
        if (job?.id) {
          navigate(`/admin/jobs/${job.id}/applicants`);
        } else {
          navigate(-1);
        }
      }, 1400);
    } catch (err: any) {
      console.error('Error saving evaluation:', err);
      setToast({
        message: err.message || 'Error occurred while saving evaluation.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (job?.id) {
      navigate(`/admin/jobs/${job.id}/applicants`);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Breadcrumb Navigation Bar */}
      <EvaluateBreadcrumb job={job} application={application} />

      {/* 2. Main Content Card */}
      {loading ? (
        <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-16 text-center text-slate-500 font-bold animate-pulse shadow-xl border border-white/60 dark:border-slate-800">
          Loading evaluation rubric sheet...
        </div>
      ) : error ? (
        <div className="bg-white/90 dark:bg-slate-900/90 rounded-3xl p-12 text-center border border-rose-200 dark:border-rose-900/40 shadow-xl space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
          <p className="text-sm font-bold text-rose-600 dark:text-rose-400">{error}</p>
          <button
            onClick={fetchEvaluationData}
            className="px-4 py-2 bg-psu-blue text-white rounded-xl text-xs font-bold shadow-md hover:bg-psu-navy transition-all cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : (
        <section className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-white/60 dark:border-slate-800 rounded-3xl shadow-xl p-5 sm:p-8 space-y-8">
          {/* Header Banner */}
          <EvaluateApplicantHeader
            application={application}
            averageScore={averageScore}
            resultStatus={form.result_status}
            evaluationDate={form.evaluation_date}
          />

          {/* Rubric Criteria 2x2 Grid */}
          <EvaluateRubricSection
            punctuality={form.punctuality_rating}
            responsibility={form.responsibility_rating}
            grooming={form.grooming_rating}
            quality={form.quality_rating}
            onChange={handleRubricChange}
          />

          {/* Supervisor Comments */}
          <EvaluateCommentsSection
            comment={form.comment}
            onChange={handleCommentChange}
          />

          {/* Final Employment Decision */}
          <EvaluateDecisionSection
            resultStatus={form.result_status}
            onChange={handleDecisionChange}
          />

          {/* Action Buttons */}
          <EvaluateActions
            isEditing={Boolean(form.id)}
            isSaving={saving}
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </section>
      )}

      {/* 3. Toast Feedback Banner */}
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

export default AdminEvaluate;
