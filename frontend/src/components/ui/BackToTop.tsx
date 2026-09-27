import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY =
        window.scrollY ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0;
      setIsVisible(scrollY > 40);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-md text-psu-navy dark:text-white border border-slate-200/90 dark:border-slate-700/80 shadow-xl shadow-slate-900/10 dark:shadow-black/50 hover:bg-psu-blue hover:text-white hover:border-psu-blue dark:hover:bg-psu-blue dark:hover:text-white dark:hover:border-psu-blue hover:-translate-y-1 active:scale-95 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-psu-blue cursor-pointer"
          aria-label="Back to top"
          title="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
