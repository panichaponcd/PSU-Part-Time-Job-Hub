import { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/psu-logo.svg';
import { Button, Input, AppBackground, GlassCard } from '../components/ui';

function SignIn() {
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string | null>(
    (location.state as any)?.message || null
  );
  const navigate = useNavigate();
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Clear location.state from browser history so it does not persist on page refresh
    if ((location.state as any)?.message) {
      window.history.replaceState({}, document.title);
    }

    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state, successMessage]);

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
    <div className="relative min-h-[calc(100vh-72px)] flex items-center justify-center overflow-hidden py-12 px-4">
      <AppBackground />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        <GlassCard variant="container" className="p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <img src={logo} alt="PSU Logo" className="h-16 w-auto mb-3 drop-shadow-sm" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Part-time Job Hub
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Sign in to continue
            </p>
          </div>

          <AnimatePresence>
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-4 py-3 rounded-xl mb-4 text-center tracking-wide transform-gpu flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <motion.div
              initial={{ x: -10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs font-bold px-4 py-3 rounded-xl mb-4 text-center"
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
              className="w-full py-4 uppercase text-xs tracking-widest mt-2 cursor-pointer"
            >
              Sign In
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-psu-blue dark:text-psu-light hover:underline transition-colors font-bold">
              Register
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default SignIn;
