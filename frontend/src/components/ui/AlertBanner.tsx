import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

export type AlertBannerVariant = 'error' | 'warning' | 'info' | 'success';

export interface AlertBannerProps {
  message: string | null | undefined;
  variant?: AlertBannerVariant;
  className?: string;
}

const variantStyles: Record<
  AlertBannerVariant,
  {
    container: string;
    icon: typeof AlertCircle;
    iconClass: string;
  }
> = {
  error: {
    container:
      'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300',
    icon: AlertCircle,
    iconClass: 'text-rose-500 dark:text-rose-400',
  },
  warning: {
    container:
      'bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
    icon: AlertTriangle,
    iconClass: 'text-amber-500 dark:text-amber-400',
  },
  info: {
    container:
      'bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-sky-700 dark:text-sky-300',
    icon: Info,
    iconClass: 'text-sky-500 dark:text-sky-400',
  },
  success: {
    container:
      'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
    icon: CheckCircle2,
    iconClass: 'text-emerald-500 dark:text-emerald-400',
  },
};

export const AlertBanner: React.FC<AlertBannerProps> = ({
  message,
  variant = 'error',
  className = '',
}) => {
  const config = variantStyles[variant];
  const Icon = config.icon;

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-bold text-center ${config.container} ${className}`}
          role="alert"
          aria-live="polite"
        >
          <Icon className={`w-4 h-4 shrink-0 ${config.iconClass}`} />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertBanner;
