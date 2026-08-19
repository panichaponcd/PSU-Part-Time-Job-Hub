import { useState, ChangeEvent, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import bgImage from '../assets/home-bg-1.jpg';
import logo from '../assets/psu-logo.svg';
import { api } from '../utils/api';
import { Button, Input } from '../components/ui';

const FACULTIES = [
  'Faculty of Hospitality and Tourism',
  'Faculty of International Studies',
  'Faculty of Technology and Environment',
  'College of Computing',
];

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
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-24">
      <motion.div
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1.1, opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 blur-lg"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-black/40" />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-lg mx-4"
      >
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/30">
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="PSU Logo" className="h-14 w-auto mb-3" />
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Create Account</h1>
            <p className="text-sm text-gray-500 mt-1 font-medium text-center px-4">
              PSU Phuket students only
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl mb-6 text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Student ID"
              name="student_id"
              value={form.student_id}
              onChange={handleChange}
              placeholder="e.g. 66306XXXXX"
              required
            />

            <div className="grid grid-cols-2 gap-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 w-full">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Faculty
                </label>
                <select
                  name="faculty"
                  value={form.faculty}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white/70 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-psu-blue/50"
                >
                  <option value="">Select faculty</option>
                  {FACULTIES.map((f) => (
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

            <div className="grid grid-cols-2 gap-4">
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
              className="w-full py-4 uppercase text-xs tracking-widest mt-2"
            >
              Create Account
            </Button>

            <p className="text-center text-sm text-gray-500 font-medium">
              Already have an account?{' '}
              <Link to="/signin" className="text-psu-accent hover:text-blue-700 transition-colors font-bold">
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default Register;
