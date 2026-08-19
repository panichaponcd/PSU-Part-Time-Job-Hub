export type BadgeStatus = 'OPEN' | 'CLOSED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PASS' | 'FAIL' | string;

export interface BadgeProps {
  status: BadgeStatus;
  label?: string;
  className?: string;
}

const statusStyles: Record<string, string> = {
  OPEN: 'bg-green-500 text-white',
  CLOSED: 'bg-gray-500 text-white',
  PENDING: 'bg-amber-500 text-white',
  APPROVED: 'bg-emerald-500 text-white',
  REJECTED: 'bg-red-500 text-white',
  PASS: 'bg-green-600 text-white',
  FAIL: 'bg-red-600 text-white',
};

export function Badge({ status, label, className = '' }: BadgeProps) {
  const normalized = status.toUpperCase();
  const colorStyle = statusStyles[normalized] || 'bg-gray-400 text-white';
  const displayLabel = label || normalized;

  return (
    <span className={`text-[10px] font-black px-3 py-1 rounded-full tracking-wider ${colorStyle} ${className}`}>
      {displayLabel}
    </span>
  );
}

export default Badge;
