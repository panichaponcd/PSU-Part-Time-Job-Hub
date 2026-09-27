import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import PageTransition from '../PageTransition';
import AppBackground from './AppBackground';
import GlassCard from './GlassCard';

interface InfoPageContainerProps {
  title: string;
  subtitle?: string;
  categoryTag?: string;
  maxWidth?: string;
  children: ReactNode;
}

export const InfoPageContainer: FC<InfoPageContainerProps> = ({
  title,
  subtitle = 'Prince of Songkla University, Phuket Campus',
  categoryTag,
  maxWidth = 'max-w-5xl',
  children,
}) => {
  return (
    <div className="relative min-h-[calc(100vh-72px)] w-full overflow-hidden flex flex-col justify-start">
      <AppBackground />

      <PageTransition>
        <main className={`relative z-10 pt-6 sm:pt-8 pb-16 px-4 sm:px-6 lg:px-8 ${maxWidth} mx-auto w-full flex flex-col gap-6 font-sans`}>
          {/* Header Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <GlassCard variant="card" className="p-6 sm:p-8">
              {categoryTag && (
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-psu-blue/10 dark:bg-psu-light/10 text-psu-blue dark:text-psu-light mb-2">
                  {categoryTag}
                </span>
              )}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-psu-navy dark:text-white tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-semibold tracking-wider uppercase mt-1">
                  {subtitle}
                </p>
              )}
            </GlassCard>
          </motion.div>

          {/* Main Content Workspace */}
          <GlassCard variant="container" className="space-y-8 sm:space-y-10">
            {children}
          </GlassCard>
        </main>
      </PageTransition>
    </div>
  );
};

export default InfoPageContainer;
