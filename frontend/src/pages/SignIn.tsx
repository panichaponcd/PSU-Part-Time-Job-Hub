import { useState, useEffect, FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Button,
  Input,
  AppBackground,
  GlassCard,
  Toast,
  PsuLogo,
  ToastVariant,
  AlertBanner,
} from '../components/ui';
import { popAuthToast } from '../utils/authToast';

function SignIn() {
  const location = useLocation();
  const [{ toastMessage, toastVariant }, setToastState] = useState<{
    toastMessage: string | null;
    toastVariant: ToastVariant;
  }>(() => {
    const popped = popAuthToast();
    if (popped) {
      return { toastMessage: popped.message, toastVariant: popped.variant };
    }
    return {
      toastMessage: (location.state as any)?.message || null,
      toastVariant: (location.state as any)?.variant || 'success',
    };
  });
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
  }, [location.state]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const role = await login(identifier, password);
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/jobs');
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

      {/* Reusable Toast Notification */}
      <Toast
        message={toastMessage}
        variant={toastVariant}
        onClose={() => setToastState((prev) => ({ ...prev, toastMessage: null }))}
      />

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md mx-auto"
      >
        <GlassCard variant="container" className="p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <PsuLogo className="h-16 w-auto mb-3 drop-shadow-sm" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
               Part-time Job Hub
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Sign in to continue
            </p>
          </div>

          <AlertBanner message={error} variant="error" className="mb-4" />

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
