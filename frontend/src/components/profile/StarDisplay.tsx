export interface StarDisplayProps {
  value: number;
  size?: 'sm' | 'lg';
}

export function StarDisplay({ value, size = 'sm' }: StarDisplayProps) {
  const starClasses = {
    sm: 'text-2xl',
    lg: 'text-5xl',
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${starClasses[size] || 'text-3xl'} ${
            star <= value ? 'text-yellow-400' : 'text-gray-200'
          }`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default StarDisplay;
