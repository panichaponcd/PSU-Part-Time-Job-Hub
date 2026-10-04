import { FC, ReactNode, HTMLAttributes } from 'react';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'container' | 'card' | 'subcard' | 'interactive';
  className?: string;
}

export const GlassCard: FC<GlassCardProps> = ({
  children,
  variant = 'container',
  className = '',
  ...props
}) => {
  const variantStyles = {
    // Primary page-level glass workspace (Stitch Baseline)
    container:
      'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/60 dark:border-slate-800 transform-gpu',
    // Standard section card
    card:
      'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-white/60 dark:border-slate-800 transform-gpu',
    // Nested sub-card / info box
    subcard:
      'bg-slate-50/90 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 dark:border-slate-700/80',
    // Interactive card with hover effects
    interactive:
      'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-5 sm:p-6 shadow-md border border-white/60 dark:border-slate-800 hover:shadow-xl hover:border-psu-blue/40 dark:hover:border-psu-light/40 transition-all transform hover:-translate-y-0.5 transform-gpu',
  };

  return (
    <div
      className={`${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
