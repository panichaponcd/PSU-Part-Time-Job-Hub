export type BadgeStatus = 'OPEN' | 'CLOSED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PASS' | 'FAIL' | string;

export interface BadgeProps {
  status: BadgeStatus;
  label?: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  OPEN: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800/50',
  CLOSED: 'bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700',
  PENDING: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800/50',
  APPROVED: 'bg-emerald-50 text-emerald-700 border border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-700/60 font-bold',
  REJECTED: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800/50',
  IN_PROGRESS: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800/50',
  COMPLETED: 'bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-300 dark:border-indigo-800/50 font-bold',
  PASS: 'bg-emerald-600 text-white font-bold shadow-sm',
  FAIL: 'bg-rose-600 text-white font-bold shadow-sm',
};

export function Badge({ status, label, className = '' }: BadgeProps) {
  const normalized = status.toUpperCase();
  const colorStyle = statusStyles[normalized] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700';
  const displayLabel = label || normalized;

  return (
    <span className={`inline-flex items-center text-[10px] font-heading font-black px-2.5 py-0.5 rounded-full tracking-wider uppercase transition-colors ${colorStyle} ${className}`}>
      {displayLabel}
    </span>
  );
}

export default Badge;
