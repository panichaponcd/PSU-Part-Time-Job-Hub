import { FC, ReactNode } from 'react';
import { motion } from 'framer-motion';
import defaultBg from '../../assets/home-bg-1.jpg';

interface AppBackgroundProps {
  image?: string;
  blurClass?: string;
  overlayClass?: string;
  children?: ReactNode;
}

export const AppBackground: FC<AppBackgroundProps> = ({
  image = defaultBg,
  blurClass = '',
  overlayClass = 'bg-slate-950/45 dark:bg-slate-950/75',
  children,
}) => {
  return (
    <>
      {/* Background Campus Scenery */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed inset-0 z-0 transform-gpu pointer-events-none ${blurClass}`}
        style={{
          backgroundImage: `radial-gradient(ellipse at 50% 30%, rgba(20, 35, 60, 0.4) 0%, rgba(10, 24, 45, 0.75) 100%), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 0%, rgba(10, 24, 45, 0.7) 100%), url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
        }}
      />
      {/* Ambient Dark Overlay */}
      <div className={`fixed inset-0 ${overlayClass} z-0 pointer-events-none`} />
      {children}
    </>
  );
};

export default AppBackground;
