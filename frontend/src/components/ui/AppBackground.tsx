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
      {/* Background Scenery Container with Dark Base & Vertical Bleed for Mobile Address Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={`fixed -top-12 -bottom-12 inset-x-0 z-0 bg-[#0b132b] overflow-hidden pointer-events-none select-none ${blurClass}`}
      >
        {/* Hardware-decoded static GPU bitmap texture */}
        <img
          src={image}
          alt=""
          aria-hidden="true"
          loading="eager"
          decoding="async"
          className="w-full h-full object-cover object-[center_40%] pointer-events-none select-none transform-gpu"
        />

        {/* Ambient Radial & Linear Contrast Gradients (Separately composited by GPU) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 50% 30%, rgba(20, 35, 60, 0.4) 0%, rgba(10, 24, 45, 0.75) 100%), linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 0%, rgba(10, 24, 45, 0.7) 100%)',
          }}
        />

        {/* Ambient Dark Overlay */}
        <div className={`absolute inset-0 ${overlayClass} pointer-events-none`} />
      </motion.div>

      {children}
    </>
  );
};

export default AppBackground;
