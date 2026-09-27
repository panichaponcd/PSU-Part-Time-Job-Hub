import { FC } from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingState: FC<LoadingStateProps> = ({
  message = 'Loading...',
  fullScreen = true,
  className = '',
}) => {
  return (
    <div
      className={`${
        fullScreen ? 'min-h-screen' : 'min-h-[300px]'
      } flex items-center justify-center text-psu-navy dark:text-psu-light font-medium gap-3 ${className}`}
      role="status"
      aria-live="polite"
    >
      <Loader2 className="w-8 h-8 animate-spin text-psu-blue dark:text-psu-light" />
      <span className="text-base sm:text-lg">{message}</span>
    </div>
  );
};

export default LoadingState;
