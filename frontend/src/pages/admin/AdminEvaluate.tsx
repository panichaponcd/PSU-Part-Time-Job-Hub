import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../../utils/api';
import { Button } from '../../components/ui';

const itemVariants = {
  hidden: { y: 10, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

const DEFAULT_FORM = {
  punctuality_rating: 5,
  responsibility_rating: 5,
  grooming_rating: 5,
  quality_rating: 5,
  comment: '',
  result_status: 'PASS',
  id: undefined as number | undefined,
};

function StarRating({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1 bg-white/40 p-2 rounded-xl border border-white/60">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="text-2xl transition-transform hover:scale-125 active:scale-90 cursor-pointer"
        >
          <span
            className={
              star <= (hovered || value)
                ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]'
                : 'text-gray-300'
            }
          >
            ★
          </span>
        </button>
      ))}
    </div>
  );
}

function AdminEvaluate() {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();

  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    fetchApplication();
  }, [applicationId]);

  const fetchApplication = async () => {
    setLoading(true);
    setError(null);
    setForm(DEFAULT_FORM);

    try {
      const appRes = await api.get(`/applications/${applicationId}/`);
      if (!appRes.ok) throw new Error('Application not found.');
      const appData = await appRes.json();
      setApplication(appData);

      const evalRes = await api.get(`/evaluations/?application=${applicationId}`);
      const evalData = await evalRes.json();

      const existingEval = Array.isArray(evalData) ? evalData[0] : evalData.results?.[0];

      if (existingEval) {
        setForm({
          punctuality_rating: existingEval.punctuality_rating,
          responsibility_rating: existingEval.responsibility_rating,
          grooming_rating: existingEval.grooming_rating,
          quality_rating: existingEval.quality_rating,
          comment: existingEval.comment,
          result_status: existingEval.result_status,
          id: existingEval.id,
        });
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load record.');
    } finally {
      setLoading(false);
    }
  };

  const averageRating = () => {
    const ratings = [
      form.punctuality_rating,
      form.responsibility_rating,
      form.grooming_rating,
      form.quality_rating,
    ];
    return (ratings.reduce((a, b) => a + b, 0) / 4).toFixed(1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    const isEditing = Boolean(form.id);

    try {
      const endpoint = isEditing ? `/evaluations/${form.id}/` : '/evaluations/';
      const payload = {
        application: applicationId,
        punctuality_rating: form.punctuality_rating,
        responsibility_rating: form.responsibility_rating,
        grooming_rating: form.grooming_rating,
        quality_rating: form.quality_rating,
        comment: form.comment,
        result_status: form.result_status,
      };
      const response = isEditing
        ? await api.patch(endpoint, payload)
        : await api.post(endpoint, payload);

      if (!response.ok) throw new Error('Submission failed.');
      setSuccess(true);
    } catch (err) {
      setError('System error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-white font-medium uppercase tracking-widest animate-pulse">
        Loading evaluation sheet...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="text-white/80 hover:text-white text-sm flex items-center gap-2 transition-all w-fit cursor-pointer"
      >
        ← Back
      </button>

      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/60">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-200/60">
          <div>
            <span className="text-[10px] font-black text-psu-blue uppercase tracking-widest">
              Evaluation Portal
            </span>
            <h1 className="text-2xl font-bold text-gray-800">
              Evaluate {application?.student_name}
            </h1>
            <p className="text-sm text-gray-500 font-medium">{application?.job_title}</p>
          </div>
          <div className="bg-psu-blue text-white px-5 py-3 rounded-2xl shadow-lg text-center">
            <span className="text-[10px] uppercase tracking-widest text-blue-200 font-bold block">
              Average Score
            </span>
            <span className="text-2xl font-black">{averageRating()} / 5.0</span>
          </div>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl mb-6 text-sm font-bold text-center"
          >
            Evaluation saved successfully! Redirecting...
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl mb-6 text-sm font-bold text-center"
          >
            {error}
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Punctuality
            </label>
            <StarRating
              value={form.punctuality_rating}
              onChange={(v) => setForm({ ...form, punctuality_rating: v })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Responsibility
            </label>
            <StarRating
              value={form.responsibility_rating}
              onChange={(v) => setForm({ ...form, responsibility_rating: v })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Grooming
            </label>
            <StarRating
              value={form.grooming_rating}
              onChange={(v) => setForm({ ...form, grooming_rating: v })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Work Quality
            </label>
            <StarRating
              value={form.quality_rating}
              onChange={(v) => setForm({ ...form, quality_rating: v })}
            />
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Supervisor Comments
          </label>
          <textarea
            rows={4}
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="Add detailed feedback regarding the student's work performance..."
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-psu-blue/50"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="primary" isLoading={saving} onClick={handleSubmit}>
            {form.id ? 'Update Evaluation' : 'Submit Evaluation'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AdminEvaluate;
