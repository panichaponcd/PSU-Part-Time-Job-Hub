import { FC, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastVariant = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  message: string | null;
  onClose?: () => void;
  variant?: ToastVariant;
  duration?: number;
}

const variantConfig: Record<
  ToastVariant,
  {
    icon: typeof CheckCircle2;
    border: string;
    iconBg: string;
    iconColor: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    border: 'border-emerald-500/30 dark:border-emerald-500/40',
    iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
  },
  error: {
    icon: AlertCircle,
    border: 'border-rose-500/30 dark:border-rose-500/40',
    iconBg: 'bg-rose-500/10 dark:bg-rose-500/20',
    iconColor: 'text-rose-600 dark:text-rose-400',
  },
  info: {
    icon: Info,
    border: 'border-sky-500/30 dark:border-sky-500/40',
    iconBg: 'bg-sky-500/10 dark:bg-sky-500/20',
    iconColor: 'text-sky-600 dark:text-sky-400',
  },
  warning: {
    icon: AlertTriangle,
    border: 'border-amber-500/30 dark:border-amber-500/40',
    iconBg: 'bg-amber-500/10 dark:bg-amber-500/20',
    iconColor: 'text-amber-600 dark:text-amber-400',
  },
};

export const Toast: FC<ToastProps> = ({
  message,
  onClose,
  variant = 'success',
  duration = 4000,
}) => {
  useEffect(() => {
    if (!message || !onClose || duration <= 0) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, onClose, duration]);

  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div className="fixed top-[84px] inset-x-3 sm:inset-x-auto sm:right-6 sm:max-w-md z-50 pointer-events-none flex justify-center sm:justify-end">
      <AnimatePresence>
        {message && (
          <motion.div
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.5, bottom: 0.1 }}
            onDragEnd={(_, info) => {
              if (info.offset.y < -20 || info.velocity.y < -200) {
                onClose?.();
              }
            }}
            initial={{ opacity: 0, y: -16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className={`pointer-events-auto transform-gpu will-change-[transform,opacity] [backface-visibility:hidden] [transform:translate3d(0,0,0)] w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border ${config.border} shadow-2xl flex items-center justify-between gap-3 text-slate-800 dark:text-slate-100 select-none touch-manipulation`}
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-7 h-7 rounded-xl ${config.iconBg} ${config.iconColor} flex items-center justify-center shrink-0`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs sm:text-sm font-semibold leading-snug break-words">
                {message}
              </span>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 -mr-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors active:scale-95 shrink-0 flex items-center justify-center touch-manipulation"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
