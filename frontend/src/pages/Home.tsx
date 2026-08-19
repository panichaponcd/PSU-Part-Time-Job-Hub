import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import PageTransition from '../components/PageTransition';
import bgImage from '../assets/home-bg-1.jpg';
import { Button } from '../components/ui';

function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-psu-blue">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-0 blur-lg scale-105"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="fixed inset-0 bg-black/40 z-10" />

      <PageTransition>
        <div className="relative z-20 min-h-screen flex items-center justify-center text-center text-white px-4">
          <div className="max-w-5xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-2xl">
              Find Part-time Jobs in the Phuket Campus
            </h1>
            <p className="text-md md:text-xl mb-10 text-white/90 drop-shadow-md">
              A hub for part-time jobs and social activities for all PSU Phuket students
            </p>
            <Link to="/jobs">
              <Button variant="primary" size="lg" className="px-12 py-4 text-lg md:text-xl font-semibold shadow-xl">
                Search Part-time Jobs
              </Button>
            </Link>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}

export default Home;
