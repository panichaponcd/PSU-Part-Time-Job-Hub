import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../utils/api';
import { Button, Input, AppBackground, GlassCard, PsuLogo, AlertBanner } from '../components/ui';
import { PSU_FACULTIES } from '../constants/faculties';

function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirm_password: '',
    faculty: '',
    major: '',
    religion: '',
    allergies: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password !== form.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/register/', form);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      navigate('/signin', {
        state: { message: 'Registration successful! Please sign in.' },
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden py-12 px-4">
      <AppBackground />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg mx-auto"
      >
        <GlassCard variant="container" className="p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <PsuLogo className="h-14 w-auto mb-3 drop-shadow-sm" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Create Account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium text-center px-4">
              PSU Phuket students only
            </p>
          </div>

          <AlertBanner message={error} variant="error" className="mb-6" />

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Student ID"
              name="student_id"
              value={form.student_id}
              onChange={handleChange}
              placeholder="e.g. 66306XXXXX"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
                required
              />
              <Input
                label="Last Name"
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="PSU Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="s66306XXXXX@phuket.psu.ac.th"
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Faculty
                </label>
                <select
                  name="faculty"
                  value={form.faculty}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-psu-blue"
                >
                  <option value="">Select faculty</option>
                  {PSU_FACULTIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                label="Major"
                name="major"
                value={form.major}
                onChange={handleChange}
                placeholder="Digital Engineering"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                required
              />
            </div>

            <Button
              type="submit"
              isLoading={loading}
              variant="primary"
              className="w-full py-4 uppercase text-xs tracking-widest mt-2 cursor-pointer"
            >
              Create Account
            </Button>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400 font-medium">
              Already have an account?{' '}
              <Link to="/signin" className="text-psu-blue dark:text-psu-light hover:underline transition-colors font-bold">
                Sign In
              </Link>
            </p>
          </form>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default Register;
