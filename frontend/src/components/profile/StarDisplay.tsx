import { Star } from 'lucide-react';

export interface StarDisplayProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StarDisplay({ value, size = 'sm', className = '' }: StarDisplayProps) {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const starSizeClass = iconSizes[size] || iconSizes.sm;

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= Math.round(value);

        return (
          <Star
            key={star}
            className={`${starSizeClass} transition-colors ${
              isFilled
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-200 dark:text-slate-700'
            }`}
          />
        );
      })}
    </div>
  );
}

export default StarDisplay;
