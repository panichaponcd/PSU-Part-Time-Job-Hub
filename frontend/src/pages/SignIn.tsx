import { useState, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import bgImage from '../assets/home-bg-1.jpg';
import logo from '../assets/psu-logo.svg';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

function SignIn() {
  const location = useLocation();
  const successMessage = (location.state as any)?.message;
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const role = await login(identifier, password);
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
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
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/30">
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="PSU Logo" className="h-16 w-auto mb-3 drop-shadow-sm" />
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Part-time Job Hub</h1>
            <p className="text-sm text-gray-500 mt-1 font-medium">Sign in to continue</p>
          </div>

          {successMessage && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-50 border border-green-100 text-green-700 text-xs font-bold px-4 py-3 rounded-xl mb-4 text-center uppercase tracking-wider"
            >
              {successMessage}
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-red-50 border border-red-100 text-red-600 text-xs font-bold px-4 py-3 rounded-xl mb-4 text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Student ID or Email"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. 6630613009"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              isLoading={loading}
              variant="primary"
              className="w-full py-4 uppercase text-xs tracking-widest mt-2"
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-psu-accent hover:text-blue-700 transition-colors font-bold">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default SignIn;
