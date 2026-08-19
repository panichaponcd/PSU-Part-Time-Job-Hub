import { useState, useEffect, ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import apiRequest from '../../utils/api';
import placeholder from '../../assets/placeholder-image.jpg';
import { Button, Input } from '../../components/ui';

interface ScheduleItem {
  id?: number;
  date: string;
  start_time: string;
  end_time: string;
}

const emptyForm = {
  title: '',
  organization_name: '',
  description: '',
  location_type: '',
  job_type: 'EXTERNAL',
  compensation_amount: '' as string | number,
  required_amount: '' as string | number,
  status: 'OPEN',
  academic_term: 2,
  academic_year: 2569,
  poster_image_url: '',
  line_group_url: '',
  schedules: [] as ScheduleItem[],
};

function AdminJobForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { refreshAccessToken } = useAuth();
  const isEditing = Boolean(id);

  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (isEditing) {
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
            schedules: data.schedules || [],
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

    setForm({ ...form, [name]: formattedValue });
    if (success) setSuccess(false);
  };

  const addSchedule = () => {
    setForm({
      ...form,
      schedules: [
        ...form.schedules,
        { date: '', start_time: '09:00', end_time: '12:00' },
      ],
    });
  };

  const removeSchedule = (index: number) => {
    const newSchedules = form.schedules.filter((_, i) => i !== index);
    setForm({ ...form, schedules: newSchedules });
  };

  const handleScheduleChange = (index: number, field: keyof ScheduleItem, value: string) => {
    const newSchedules = [...form.schedules];
    newSchedules[index] = { ...newSchedules[index], [field]: value };
    setForm({ ...form, schedules: newSchedules });
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const url = isEditing ? `/jobs/${id}/` : `/jobs/`;
      let response = await apiRequest(url, {
        method: isEditing ? 'PUT' : 'POST',
        body: JSON.stringify(form),
      });

      if (response.status === 401) {
        const newToken = await refreshAccessToken();
        if (newToken) {
          response = await apiRequest(url, {
            method: isEditing ? 'PUT' : 'POST',
            body: JSON.stringify(form),
          });
        }
      }

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(
          errData ? JSON.stringify(errData) : `Server returned HTTP ${response.status}`
        );
      }

      setSuccess(true);
      setTimeout(() => navigate('/admin/jobs'), 1200);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500 font-medium animate-pulse uppercase tracking-widest">
        Loading Job Form...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <button
        onClick={() => navigate('/admin/jobs')}
        className="text-white/80 hover:text-white text-sm flex items-center gap-2 transition-all w-fit cursor-pointer"
      >
        ← Back to Job Management
      </button>

      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/60">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditing ? 'Edit Job Listing' : 'Post New Job'}
        </h1>

        {success && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-2xl mb-6 text-sm font-bold text-center">
            Job saved successfully! Redirecting...
          </div>
        )}

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl mb-6 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <Input
            label="Job Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Lab Assistant"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Organization Name"
              name="organization_name"
              value={form.organization_name}
              onChange={handleChange}
              placeholder="e.g. College of Computing"
              required
            />
            <Input
              label="Location / Room"
              name="location_type"
              value={form.location_type}
              onChange={handleChange}
              placeholder="e.g. Room 6302"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Job Type
              </label>
              <select
                name="job_type"
                value={form.job_type}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white/70 text-gray-800 focus:outline-none focus:ring-2 focus:ring-psu-blue/50"
              >
                <option value="INTERNAL">Internal</option>
                <option value="EXTERNAL">External</option>
              </select>
            </div>

            <Input
              label="Pay Rate (THB)"
              type="number"
              name="compensation_amount"
              value={form.compensation_amount}
              onChange={handleChange}
              placeholder="e.g. 300"
              required
            />

            <Input
              label="Vacancies (Seats)"
              type="number"
              name="required_amount"
              value={form.required_amount}
              onChange={handleChange}
              placeholder="e.g. 5"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Academic Term"
              type="number"
              name="academic_term"
              value={form.academic_term}
              onChange={handleChange}
              required
            />
            <Input
              label="Academic Year"
              type="number"
              name="academic_year"
              value={form.academic_year}
              onChange={handleChange}
              required
            />
            <div className="flex flex-col gap-1 w-full">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white/70 text-gray-800 focus:outline-none focus:ring-2 focus:ring-psu-blue/50"
              >
                <option value="OPEN">Open</option>
                <option value="CLOSED">Closed</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Description
            </label>
            <textarea
              rows={4}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Detailed job description and requirements..."
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white/70 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-psu-blue/50"
            />
          </div>

          <Input
            label="Poster Image URL"
            name="poster_image_url"
            value={form.poster_image_url}
            onChange={handleChange}
            placeholder="https://..."
          />

          <Input
            label="Line Group URL"
            name="line_group_url"
            value={form.line_group_url}
            onChange={handleChange}
            placeholder="https://line.me/ti/g/..."
          />

          {/* Schedule Builder */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Work Schedule Shifts
              </h3>
              <Button type="button" variant="secondary" size="sm" onClick={addSchedule}>
                + Add Shift
              </Button>
            </div>

            {form.schedules.length === 0 ? (
              <p className="text-xs text-gray-400 font-medium italic">No shifts added yet.</p>
            ) : (
              <div className="space-y-3">
                {form.schedules.map((sch, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-gray-50/80 p-3 rounded-2xl border border-gray-200"
                  >
                    <input
                      type="date"
                      value={sch.date}
                      onChange={(e) => handleScheduleChange(idx, 'date', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border text-sm font-medium"
                    />
                    <input
                      type="time"
                      value={sch.start_time}
                      onChange={(e) => handleScheduleChange(idx, 'start_time', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border text-sm font-medium"
                    />
                    <span className="text-gray-400 font-bold text-xs">to</span>
                    <input
                      type="time"
                      value={sch.end_time}
                      onChange={(e) => handleScheduleChange(idx, 'end_time', e.target.value)}
                      className="px-3 py-1.5 rounded-lg border text-sm font-medium"
                    />
                    <Button
                      type="button"
                      variant="danger"
                      size="sm"
                      onClick={() => removeSchedule(idx)}
                      className="ml-auto"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/jobs')}
            >
              Cancel
            </Button>
            <Button type="button" variant="primary" isLoading={saving} onClick={handleSubmit}>
              {isEditing ? 'Save Changes' : 'Create Job Listing'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminJobForm;
