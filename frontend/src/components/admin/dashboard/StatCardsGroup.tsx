import { ReactNode } from 'react';
import { Briefcase, Users, CheckCircle2, Wallet } from 'lucide-react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  sub?: string;
  badgeText?: string;
  variant: 'blue' | 'sky' | 'emerald' | 'amber';
}

function StatCard({ icon, label, value, sub, badgeText, variant }: StatCardProps) {
  const variantStyles = {
    blue: {
      container: 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200/60 dark:border-blue-900/60 text-[#006398] dark:text-blue-300',
      badge: 'bg-blue-100 dark:bg-blue-900/50 text-[#006398] dark:text-blue-200',
    },
    sky: {
      container: 'bg-sky-50/80 dark:bg-sky-950/40 border-sky-200/60 dark:border-sky-900/60 text-sky-600 dark:text-sky-400',
      badge: 'bg-sky-100 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300',
    },
    emerald: {
      container: 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200/60 dark:border-emerald-900/60 text-emerald-600 dark:text-emerald-400',
      badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300',
    },
    amber: {
      container: 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-200/60 dark:border-amber-900/60 text-amber-600 dark:text-amber-400',
      badge: 'bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300',
    },
  };

  const currentVariant = variantStyles[variant];

  return (
    <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 shadow-xl border border-white/60 dark:border-slate-800 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-0.5 group">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-12 h-12 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-105 ${currentVariant.container}`}
        >
          {icon}
        </div>
        {badgeText && (
          <span
            className={`text-[10px] font-bold tracking-wider px-2.5 py-0.5 rounded-full uppercase ${currentVariant.badge}`}
          >
            {badgeText}
          </span>
        )}
      </div>
      <div>
        <p className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none tracking-tight">
          {value}
        </p>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1.5">
          {label}
        </p>
        {sub && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-medium">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

export interface StatCardsGroupProps {
  activeJobsCount: number;
  applicantsCount: number;
  approvedCount: number;
  totalBudget: number;
}

export function StatCardsGroup({
  activeJobsCount,
  applicantsCount,
  approvedCount,
  totalBudget,
}: StatCardsGroupProps) {
  const placementRate =
    applicantsCount > 0 ? `${Math.round((approvedCount / applicantsCount) * 100)}% rate` : undefined;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      <StatCard
        icon={<Briefcase className="w-6 h-6" />}
        label="Active Listings"
        value={activeJobsCount}
        sub="Available postings"
        variant="blue"
      />
      <StatCard
        icon={<Users className="w-6 h-6" />}
        label="Total Applicants"
        value={applicantsCount}
        sub="Student submissions"
        badgeText={applicantsCount > 0 ? `${applicantsCount} enrolled` : undefined}
        variant="sky"
      />
      <StatCard
        icon={<CheckCircle2 className="w-6 h-6" />}
        label="Approved Placements"
        value={approvedCount}
        sub="Confirmed workers"
        badgeText={placementRate}
        variant="emerald"
      />
      <StatCard
        icon={<Wallet className="w-6 h-6" />}
        label="Total Budget"
        value={`฿${totalBudget.toLocaleString()}`}
        sub="Allocated compensation"
        badgeText="THB"
        variant="amber"
      />
    </div>
  );
}

export default StatCardsGroup;
