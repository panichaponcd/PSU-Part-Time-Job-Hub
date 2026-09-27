import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import bgImage from '../assets/home-bg-1.jpg';
import { Button } from '../components/ui';

function Home() {
  return (
    <div className="relative w-full min-h-[calc(100vh-72px)] flex flex-col justify-center items-center overflow-hidden bg-psu-navy">
      {/* Hero Background Image with Blur */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="absolute inset-0 z-0 blur-sm scale-105 pointer-events-none"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      {/* Dark Ambient Overlay */}
      <div className="absolute inset-0 bg-slate-950/50 dark:bg-slate-950/70 z-10 pointer-events-none" />

      {/* Hero Content */}
      <PageTransition>
        <div className="relative z-20 py-20 px-4 sm:px-6 max-w-5xl mx-auto flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight drop-shadow-2xl">
            Find Part-time Jobs in the Phuket Campus
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-8 text-slate-100/90 max-w-2xl drop-shadow-md">
            A hub for part-time jobs and social activities for all PSU Phuket students
          </p>
          <Link to="/jobs">
            <Button
              variant="primary"
              size="lg"
              className="px-10 py-3.5 text-base sm:text-lg font-semibold shadow-xl bg-psu-blue hover:bg-psu-navy dark:bg-psu-light dark:hover:bg-psu-blue dark:text-slate-900 dark:hover:text-white transition-all"
            >
              Search Part-time Jobs
            </Button>
          </Link>
        </div>
      </PageTransition>
    </div>
  );
}

export default Home;
