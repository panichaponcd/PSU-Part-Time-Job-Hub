import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  GoogleSignInButton,
} from '../components/ui';
import { popAuthToast, setAuthToast } from '../utils/authToast';

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
  const { login, loginWithGoogle } = useAuth();
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

  const handleGoogleCredential = async (credential: string) => {
    setError(null);
    setLoading(true);

    try {
      const { role, isNewUser } = await loginWithGoogle(credential);
      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else if (isNewUser) {
        setAuthToast(
          'Welcome! Your PSU account was created automatically. Please confirm your profile details.',
          'success'
        );
        navigate('/profile', { state: { isNewUser: true } });
      } else {
        navigate('/jobs');
      }
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

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
          <div className="flex flex-col items-center mb-6">
            <PsuLogo className="h-16 w-auto mb-3 drop-shadow-sm" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              Part-time Job Hub
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium text-center">
              Sign in with your PSU Google account
            </p>
          </div>

          <AlertBanner message={error} variant="error" className="mb-4" />

          {/* Primary PSU Google SSO */}
          <div className="space-y-2.5">
            <GoogleSignInButton
              onCredential={handleGoogleCredential}
              onError={(msg) => setError(msg)}
              disabled={loading}
            />
            <p className="text-[11px] text-center text-slate-500 dark:text-slate-400">
              Restricted to <span className="font-semibold">@phuket.psu.ac.th</span> &amp;{' '}
              <span className="font-semibold">@psu.ac.th</span> accounts. New student profiles are created automatically.
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700/80" />
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider font-semibold">
              <span className="px-3 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 rounded-full">
                or staff / demo login
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="Username, Student ID, or Email"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="e.g. staff or 6630613009"
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
        </GlassCard>
      </motion.div>
    </div>
  );
}

export default SignIn;
